import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  User,
  MapPin,
  Calendar,
  CreditCard,
  Phone,
  Filter,
  Search,
  RefreshCw,
  Eye,
  ChevronDown,
} from "lucide-react";

const Orders = () => {
  const { currency, axios } = useAppContext();
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/seller");
      if (data.success) {
        setOrders(data.orders);
        console.log("Orders JSON Data", data.orders);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    console.log("Orders JSON Data", orders);
  }, []);

  const adminStatusLabel = (status) => {
    switch (status) {
      case "Order Placed":
        return "New Order";
      case "Processing":
        return "Processing";
      case "Shipped":
        return "Dispatched";
      case "Delivered":
        return "Delivered";
      case "Cancelled":
        return "Cancelled";
      default:
        return status;
    }
  };

  const statusStyles = (status) => {
    switch (status) {
      case "Order Placed":
        return {
          badge: "bg-orange-100 text-orange-700 border-orange-200",
          icon: <Clock className="w-4 h-4" />,
          dot: "bg-orange-500",
        };
      case "Processing":
        return {
          badge: "bg-blue-100 text-blue-700 border-blue-200",
          icon: <RefreshCw className="w-4 h-4" />,
          dot: "bg-blue-500",
        };
      case "Shipped":
        return {
          badge: "bg-purple-100 text-purple-700 border-purple-200",
          icon: <Truck className="w-4 h-4" />,
          dot: "bg-purple-500",
        };
      case "Delivered":
        return {
          badge: "bg-green-100 text-green-700 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          dot: "bg-green-500",
        };
      case "Cancelled":
        return {
          badge: "bg-red-100 text-red-700 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          dot: "bg-red-500",
        };
      default:
        return {
          badge: "bg-gray-100 text-gray-700 border-gray-200",
          icon: <Package className="w-4 h-4" />,
          dot: "bg-gray-500",
        };
    }
  };

  // Filter orders
  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesSearch =
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.address?.firstName} ${order.address?.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    newOrders: orders.filter((o) => o.status === "Order Placed").length,
    processing: orders.filter((o) => o.status === "Processing").length,
    shipped: orders.filter((o) => o.status === "Shipped").length,
    delivered: orders.filter((o) => o.status === "Delivered").length,
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="md:p-10 p-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Package className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900">
                Orders Management
              </h2>
              <p className="text-sm text-gray-600">
                Review and process customer orders
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          {[
            {
              label: "Total",
              value: stats.total,
              color: "indigo",
              icon: <Package className="w-5 h-5" />,
            },
            {
              label: "New Orders",
              value: stats.newOrders,
              color: "orange",
              icon: <Clock className="w-5 h-5" />,
            },
            {
              label: "Processing",
              value: stats.processing,
              color: "blue",
              icon: <RefreshCw className="w-5 h-5" />,
            },
            {
              label: "Shipped",
              value: stats.shipped,
              color: "purple",
              icon: <Truck className="w-5 h-5" />,
            },
            {
              label: "Delivered",
              value: stats.delivered,
              color: "green",
              icon: <CheckCircle className="w-5 h-5" />,
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div
                className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center text-${stat.color}-600 mb-3`}
              >
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Order ID or Customer name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-medium text-gray-700 bg-white"
              >
                <option value="all">All Orders</option>
                <option value="Order Placed">New Orders</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button
                onClick={fetchOrders}
                className="px-4 py-2.5 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition flex items-center gap-2 font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                <span className="hidden sm:inline">Refresh</span>
              </button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No orders found
              </h3>
              <p className="text-gray-500">
                {searchTerm || filterStatus !== "all"
                  ? "Try adjusting your filters"
                  : "Orders will appear here once customers place them"}
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const statusInfo = statusStyles(order.status);

              return (
                <div
                  key={order._id}
                  className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                          <Package className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 mb-1">Order ID</p>
                          <p className="font-semibold text-gray-900 font-mono">
                            #{order._id}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 flex-wrap">
                        <span
                          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border ${statusInfo.badge}`}
                        >
                          {statusInfo.icon}
                          {adminStatusLabel(order.status)}
                          {order.status === "Order Placed" && (
                            <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                          )}
                        </span>

                        <span
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            order.isPaid
                              ? "bg-green-100 text-green-700 border border-green-200"
                              : "bg-red-100 text-red-700 border border-red-200"
                          }`}
                        >
                          {order.isPaid ? "✓ Paid" : "Payment Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-5 border-b border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Order Items ({order.items.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-200 hover:bg-white hover:border-indigo-200 transition"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 truncate text-sm">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="px-2 py-0.5 bg-purple-100 text-green-700 rounded text-xs font-medium">
                                {item.product.category}
                              </span>
                              <span className="mx-1">•</span>
                              Qty: {item.quantity}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {currency}
                              {item.product.offerPrice * item.quantity}
                            </p>
                            <p className="text-xs text-gray-500">
                              {currency}
                              {item.product.offerPrice} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Customer & Delivery Info */}
                  <div className="p-5 bg-gray-50">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            Customer
                          </p>
                          <p className="font-semibold text-gray-900">
                            {order.address?.firstName} {order.address?.lastName}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-600">
                            <Phone className="w-3.5 h-3.5 " />
                            {order.address?.phone}
                          </div>
                        </div>
                      </div>

                      {/* Delivery Address */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            Delivery Address
                          </p>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            {order.address?.street}, {order.address?.city}
                            <br />
                            {order.address?.state}, {order.address?.country}
                          </p>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1 font-medium">
                            Order Details
                          </p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              <CreditCard className="w-3.5 h-3.5" />
                              {order.paymentType}
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-gray-700">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(order.createdAt).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 border-t border-indigo-100">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex gap-2">
                        <button className="px-4 py-2 bg-green-400 text-white rounded-lg hover:bg-green-600 transition font-medium text-sm flex items-center gap-2 cursor-pointer">
                          <ChevronDown className="w-4 h-4" />
                          Update Status
                        </button>
                        <button className="px-4 py-2 border-2 border-indigo-200 text-green-600 rounded-lg hover:bg-indigo-50 transition font-medium text-sm flex items-center gap-2 cursor-pointer">
                          <Eye className="w-4 h-4" />
                          View Details
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-gray-700 font-medium">
                          Total Amount:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          {currency}
                          {order.amount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Results Summary */}
        {filteredOrders.length > 0 && (
          <div className="mt-6 text-center text-sm text-gray-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
