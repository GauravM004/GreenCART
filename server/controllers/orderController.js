import * as orderService from "../services/orderService.js";

// Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
  try {
    const userId = req.userId; // Get from authentication middleware
    const { items, address } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    await orderService.placeOrderCOD(userId, { items, address });

    return res.json({ success: true, message: "Order Placed Successfully" });
  } catch (error) {
    console.error("Error placing COD order:", error);
    return res.json({ success: false, message: error.message });
  }
};

// Place Order Razorpay : /api/order/razorpay
export const placeOrderRazorpay = async (req, res) => {
  try {
    const userId = req.userId; // Get from authentication middleware
    const { items, address } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }
    if (!address || items.length === 0) {
      return res.json({ success: false, message: "Invalid data" });
    }

    const { order, razorpayOrder } = await orderService.placeOrderRazorpay(userId, {
      items,
      address,
    });

    return res.json({
      success: true,
      key_id: process.env.RAZORPAY_KEY_ID,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      orderId: order.id,
    });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

// Verify Razorpay Payment (called by frontend after checkout success) : /api/order/razorpay/verify
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId, userId } = req.body;

    const isValid = orderService.verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      await orderService.deleteOrder(orderId);
      return res.status(400).json({ success: false, message: "Payment verification failed" });
    }

    await orderService.markOrderPaid(orderId, userId, razorpay_payment_id);

    return res.json({ success: true, message: "Payment verified" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Razorpay Webhooks to Verify Payments Action : /razorpay
export const razorpayWebhooks = async (request, response) => {
  try {
    const sig = request.headers["x-razorpay-signature"];

    const isValid = orderService.verifyWebhookSignature(request.body, sig); // raw body (Buffer), see express.raw() in server.js
    if (!isValid) {
      return response.status(400).send("Webhook Error: Invalid signature");
    }

    const event = JSON.parse(request.body);

    switch (event.event) {
      case "payment.captured": {
        const { id: paymentId, notes } = event.payload.payment.entity;
        const { orderId, userId } = notes;
        await orderService.markOrderPaid(orderId, userId, paymentId);
        break;
      }
      case "payment.failed": {
        const { notes } = event.payload.payment.entity;
        await orderService.deleteOrder(notes.orderId);
        break;
      }
      default:
        console.error(`Unhandled event type ${event.event}`);
        break;
    }

    response.json({ received: true });
  } catch (error) {
    response.status(400).send(`Webhook Error: ${error.message}`);
  }
};

// Get Orders by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // Get from authentication middleware

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const orders = await orderService.getUserOrders(userId);
    res.json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get All Orders (for seller / admin) : /api/order/seller
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderService.getAllOrders();
    res.json({ success: true, orders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// UPDATE ORDER STATUS : /api/order/:orderId/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { newStatus, note, deliveryPartnerName, deliveryPartnerPhone, estimatedDeliveryDate } =
      req.body;

    if (!orderService.isValidStatus(newStatus)) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid status. Allowed: pending, accepted, assigning_delivery, out_for_delivery, delivered",
      });
    }

    const order = await orderService.updateOrderStatus(orderId, {
      newStatus,
      note,
      deliveryPartnerName,
      deliveryPartnerPhone,
      estimatedDeliveryDate,
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // TODO: Send notification to user about status change
    console.log(`Order ${orderId} status updated to ${newStatus}. Notifying user...`);

    return res.json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// SUBMIT ORDER RATING : /api/order/:orderId/rating
export const submitOrderRating = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { rating, review } = req.body;
    const userId = req.userId;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const result = await orderService.submitOrderRating(orderId, userId, { rating, review });

    if (result.error === "not_found") {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    if (result.error === "unauthorized") {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }
    if (result.error === "not_delivered") {
      return res.status(400).json({ success: false, message: "Can only rate delivered orders" });
    }
    if (result.error === "already_rated") {
      return res.status(400).json({ success: false, message: "Order already rated" });
    }

    return res.json({
      success: true,
      message: "Thank you for rating!",
      order: result.order,
    });
  } catch (error) {
    console.error("Error submitting rating:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
