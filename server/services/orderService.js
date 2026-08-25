import crypto from "crypto";
import Razorpay from "razorpay";
import prisma from "../configs/db.js";
import { clearCart } from "./cartService.js";

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const TAX_RATE = 0.02;

// Recompute the amount server-side from live product prices rather than
// trusting whatever the client sent - items: [{ product: <productId>, quantity }]
const calculateOrderAmount = async (items) => {
  const products = await prisma.product.findMany({
    where: { id: { in: items.map((item) => item.product) } },
  });
  const priceById = new Map(products.map((p) => [p.id, p.offerPrice]));

  const subtotal = items.reduce((sum, item) => {
    const price = priceById.get(item.product);
    if (price === undefined) {
      throw new Error(`Product ${item.product} not found`);
    }
    return sum + price * item.quantity;
  }, 0);

  return subtotal + Math.floor(subtotal * TAX_RATE);
};

export const placeOrderCOD = async (userId, { items, address }) => {
  const amount = await calculateOrderAmount(items);

  return prisma.order.create({
    data: {
      userId,
      addressId: address,
      amount,
      paymentType: "COD",
      items: {
        create: items.map((item) => ({
          productId: item.product,
          quantity: item.quantity,
        })),
      },
    },
  });
};

export const placeOrderRazorpay = async (userId, { items, address }) => {
  const amount = await calculateOrderAmount(items);

  const order = await prisma.order.create({
    data: {
      userId,
      addressId: address,
      amount,
      paymentType: "Razorpay",
      items: {
        create: items.map((item) => ({
          productId: item.product,
          quantity: item.quantity,
        })),
      },
    },
  });

  // Razorpay amount is in the smallest currency unit (paise for INR)
  const razorpayOrder = await razorpayInstance.orders.create({
    amount: Math.floor(amount * 100),
    currency: "INR",
    receipt: order.id,
    notes: { orderId: order.id, userId },
  });

  return { order, razorpayOrder };
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  return expectedSignature === signature;
};

export const markOrderPaid = async (orderId, userId, transactionId) => {
  await prisma.order.update({
    where: { id: orderId },
    data: { isPaid: true, transactionId },
  });
  await clearCart(userId);
};

export const deleteOrder = (orderId) => {
  return prisma.order.delete({ where: { id: orderId } });
};

export const verifyWebhookSignature = (rawBody, signature) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest("hex");
  return expectedSignature === signature;
};

const orderIncludes = {
  items: { include: { product: true } },
  address: true,
};

export const getUserOrders = (userId) => {
  return prisma.order.findMany({
    where: {
      userId,
      OR: [{ paymentType: "COD" }, { isPaid: true }],
    },
    include: orderIncludes,
    orderBy: { createdAt: "desc" },
  });
};

export const getAllOrders = () => {
  return prisma.order.findMany({
    where: { OR: [{ paymentType: "COD" }, { isPaid: true }] },
    include: orderIncludes,
    orderBy: { createdAt: "desc" },
  });
};

export const findOrderById = (orderId) => {
  return prisma.order.findUnique({ where: { id: orderId } });
};

const ALLOWED_STATUSES = [
  "pending",
  "accepted",
  "assigning_delivery",
  "out_for_delivery",
  "delivered",
];

export const isValidStatus = (status) => ALLOWED_STATUSES.includes(status);

export const updateOrderStatus = async (
  orderId,
  { newStatus, note, deliveryPartnerName, deliveryPartnerPhone, estimatedDeliveryDate }
) => {
  const existingOrder = await prisma.order.findUnique({ where: { id: orderId } });
  if (!existingOrder) return null;

  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      ...(deliveryPartnerName && { deliveryPartnerName }),
      ...(deliveryPartnerPhone && { deliveryPartnerPhone }),
      ...(estimatedDeliveryDate && { estimatedDeliveryDate: new Date(estimatedDeliveryDate) }),
      statusHistory: {
        create: {
          status: newStatus,
          changedBy: "admin",
          note: note || `Status changed from ${existingOrder.status} to ${newStatus}`,
        },
      },
    },
    include: { statusHistory: true },
  });

  return order;
};

export const submitOrderRating = async (orderId, userId, { rating, review }) => {
  const order = await prisma.order.findUnique({ where: { id: orderId } });

  if (!order) return { error: "not_found" };
  if (order.userId !== userId) return { error: "unauthorized" };
  if (order.status !== "delivered") return { error: "not_delivered" };
  if (order.isRated) return { error: "already_rated" };

  const updatedOrder = await prisma.order.update({
    where: { id: orderId },
    data: { rating, review: review || "", isRated: true },
  });

  return { order: updatedOrder };
};
