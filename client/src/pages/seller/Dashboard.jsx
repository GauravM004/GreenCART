import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Clock, 
  AlertTriangle,
  Package,
  Users,
  Calendar,
  ArrowUp,
  ArrowDown,
  Activity,
  CheckCircle,
  Truck,
  Eye
} from "lucide-react";

const Dashboard = () => {
  const [DashboardData, setDashBoardData] = useState([]);
  const { axios } = useAppContext();

  const DashboardDataFetch = async () => {
    try {
      const { data } = await axios.get("/api/admin/dashboard");
      if (data.success) {
        setDashBoardData(data);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    DashboardDataFetch();
  }, []);

  const formatStatus = (status) => {
    switch (status) {
      case "Order Placed":
        return { 
          label: "Order Placed", 
          color: "yellow",
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
          icon: <Clock className="w-3.5 h-3.5" />
        };
      case "Processing":
        return { 
          label: "Processing", 
          color: "blue",
          bg: "bg-blue-100",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: <Activity className="w-3.5 h-3.5" />
        };
      case "Shipped":
        return { 
          label: "Dispatched", 
          color: "purple",
          bg: "bg-purple-100",
          text: "text-purple-700",
          border: "border-purple-200",
          icon: <Truck className="w-3.5 h-3.5" />
        };
      case "Delivered":
        return { 
          label: "Delivered", 
          color: "green",
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
          icon: <CheckCircle className="w-3.5 h-3.5" />
        };
      default:
        return { 
          label: status, 
          color: "gray",
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
          icon: <Package className="w-3.5 h-3.5" />
        };
    }
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Activity className="w-7 h-7 text-white" />
              </div>
              Admin Dashboard
            </h1>
            <p className="text-gray-600 ml-15">
              Monitor your store performance and manage operations
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600 font-medium">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric',
                year: 'numeric'
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards with Enhanced Design */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            label: "Total Orders",
            value: DashboardData?.stats?.totalOrders ?? 0,
            gradient: "from-blue-500 to-indigo-600",
            icon: <ShoppingCart className="w-6 h-6" />,
            trend: "+12%",
            trendUp: true,
            bgIcon: "bg-blue-100",
            textIcon: "text-blue-600"
          },
          {
            label: "Total Revenue",
            value: `₹${DashboardData?.stats?.totalRevenue  || '17,350'}`,
            gradient: "from-emerald-500 to-green-600",
            icon: <DollarSign className="w-6 h-6" />,
            trend: "+23%",
            trendUp: true,
            bgIcon: "bg-emerald-100",
            textIcon: "text-emerald-600"
          },
          {
            label: "Pending Orders",
            value: DashboardData?.stats?.pendingOrders ?? 0,
            gradient: "from-amber-500 to-orange-600",
            icon: <Clock className="w-6 h-6" />,
            trend: "-5%",
            trendUp: false,
            bgIcon: "bg-amber-100",
            textIcon: "text-amber-600"
          },
          {
            label: "Low Stock Items",
            value: 4,
            gradient: "from-rose-500 to-pink-600",
            icon: <AlertTriangle className="w-6 h-6" />,
            trend: "+2",
            trendUp: false,
            bgIcon: "bg-rose-100",
            textIcon: "text-rose-600"
          },
        ].map((item, index) => (
          <div
            key={index}
            className="relative bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group overflow-hidden"
          >
            {/* Animated gradient bar */}
            <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${item.gradient}`} />
            
            {/* Background decoration */}
            <div className={`absolute -right-8 -bottom-8 w-32 h-32 bg-gradient-to-br ${item.gradient} opacity-5 rounded-full group-hover:scale-150 transition-transform duration-500`} />
            
            <div className="flex items-start justify-between mb-4">
              <div className={`w-14 h-14 ${item.bgIcon} rounded-xl flex items-center justify-center ${item.textIcon} shadow-sm`}>
                {item.icon}
              </div>
              <div className={`flex items-center gap-1 text-xs font-semibold ${item.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                {item.trendUp ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                {item.trend}
              </div>
            </div>
            
            <p className="text-sm text-gray-500 font-medium mb-1">{item.label}</p>
            <p className="text-3xl font-bold text-gray-900">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Orders Analytics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Orders Analytics
              </h3>
              <p className="text-sm text-gray-500">Last 7 days order volume</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
          </div>

          <div className="flex items-end gap-3 h-48 px-2">
            {[40, 70, 55, 90, 65, 80, 60].map((h, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-blue-100 to-transparent rounded-t-lg relative overflow-hidden group cursor-pointer"
              >
                <div
                  style={{ height: `${h}%` }}
                  className="absolute bottom-0 w-full bg-gradient-to-t from-blue-500 to-indigo-500 rounded-t-lg transition-all duration-500 group-hover:from-blue-600 group-hover:to-indigo-600"
                >
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
                </div>
                {/* Tooltip on hover */}
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {Math.round(h * 1.5)} orders
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Mon - Sun</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                15%
              </span>
              <span className="text-gray-500">vs last week</span>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                Revenue Analytics
              </h3>
              <p className="text-sm text-gray-500">Revenue growth trend</p>
            </div>
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-emerald-600" />
            </div>
          </div>

          <div className="relative h-48">
            <svg viewBox="0 0 300 100" className="w-full h-full">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#f0f0f0" strokeWidth="1" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#f0f0f0" strokeWidth="1" />
              
              {/* Gradient area under line */}
              <defs>
                <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
              
              <polygon
                fill="url(#areaGradient)"
                points="0,80 40,60 80,65 120,40 160,50 200,30 240,35 280,20 280,100 0,100"
              />
              
              <polyline
                fill="none"
                stroke="url(#lineGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="0,80 40,60 80,65 120,40 160,50 200,30 240,35 280,20"
              />
              
              {/* Data points */}
              {[[0,80], [40,60], [80,65], [120,40], [160,50], [200,30], [240,35], [280,20]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="4" fill="#10b981" className="hover:r-6 transition-all" />
              ))}
            </svg>
          </div>

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-xs text-gray-400">Weekly overview</span>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-green-600 font-semibold flex items-center gap-1">
                <ArrowUp className="w-4 h-4" />
                23%
              </span>
              <span className="text-gray-500">vs last month</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Recent Orders
                </h2>
                <p className="text-sm text-gray-500">Latest customer orders</p>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition">
              <Eye className="w-4 h-4" />
              View All
            </button>
          </div>
        </div>

        {!DashboardData?.recentOrders?.length ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No recent orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-600 bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Customer</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {DashboardData.recentOrders.map((order) => {
                  const status = formatStatus(order.status);

                  return (
                    <tr key={order._id} className="hover:bg-blue-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900 font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold shadow-sm">
                            {(order.userId?.name || "U").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {order.userId?.name || "Unknown"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {order.userId?.email || "N/A"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-gray-900 text-base">
                          ₹{order.amount}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${status.bg} ${status.text} ${status.border}`}>
                          {status.icon}
                          {status.label}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          {formatDate(order.createdAt)}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;