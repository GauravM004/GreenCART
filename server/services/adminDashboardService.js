import prisma from "../configs/db.js";

const toDateKey = (date) => date.toISOString().slice(0, 10); // YYYY-MM-DD

export const getDashboardData = async () => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 6);
  last7Days.setHours(0, 0, 0, 0);

  const [totalOrders, pendingOrders, revenueResult, recentOrdersRaw, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: { not: "delivered" } } }),
      prisma.order.aggregate({ where: { isPaid: true }, _sum: { amount: true } }),
      prisma.order.findMany({
        where: { createdAt: { gte: last7Days } },
        select: { createdAt: true, amount: true, isPaid: true },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          amount: true,
          status: true,
          isPaid: true,
          createdAt: true,
          user: { select: { name: true, email: true } },
        },
      }),
    ]);

  const totalRevenue = revenueResult._sum.amount || 0;

  // Bucket the last-7-days orders by day (replaces Mongo's $dateToString/$group)
  const byDay = new Map();
  for (const order of recentOrdersRaw) {
    const key = toDateKey(order.createdAt);
    const bucket = byDay.get(key) || { _id: key, orders: 0, revenue: 0 };
    bucket.orders += 1;
    if (order.isPaid) bucket.revenue += order.amount;
    byDay.set(key, bucket);
  }
  const analytics = Array.from(byDay.values()).sort((a, b) => (a._id > b._id ? 1 : -1));

  return {
    stats: { totalOrders, totalRevenue, pendingOrders },
    analytics,
    recentOrders,
  };
};
