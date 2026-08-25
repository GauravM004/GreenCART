import * as adminDashboardService from "../services/adminDashboardService.js";

// GET /api/admin/dashboard
export const adminDashboardData = async (req, res) => {
  try {
    const { stats, analytics, recentOrders } = await adminDashboardService.getDashboardData();

    return res.status(200).json({
      success: true,
      stats,
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
