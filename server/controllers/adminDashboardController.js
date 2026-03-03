import Product from "../models/Product.js";
import User from "../models/User.js";
import Address from "../models/Address.js";
import Order from "../models/Order.js";

// GET /api/admin/dashboard
export const adminDashboardData = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const pendingOrders = await Order.countDocuments({
      status: { $in: ["Order Placed", "Processing", "Shipped"] },
    });

    const revenueResult = await Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 6);
    last7Days.setHours(0, 0, 0, 0);

    const analytics = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },
          orders: { $sum: 1 },
          revenue: {
            $sum: {
              $cond: [{ $eq: ["$isPaid", true] }, "$amount", 0],
            },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("userId", "name email")
      .select("amount status isPaid createdAt");

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        pendingOrders,
      },
      analytics,
      recentOrders,
    });
  } catch (error) {
    console.error("Admin Dashboard Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard data",
    });
  }
};

