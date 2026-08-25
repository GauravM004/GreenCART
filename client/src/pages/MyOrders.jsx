import React, { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { selectAuthUser } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle,
  Truck,
  ShoppingBag,
  Calendar,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import toast from "react-hot-toast";
import OrderStatusTracker from "../components/OrderStatusTracker";
import { useGetUserOrdersQuery } from "../features/orders/orderApi";

const MyOrders = () => {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const currency = import.meta.env.VITE_CURRENCY;
  const user = useAppSelector(selectAuthUser);
  const navigate = useNavigate();
  const { data: ordersData, refetch } = useGetUserOrdersQuery(undefined, { skip: !user });
  const myOrders = ordersData?.success ? ordersData.orders : [];

  const handleRatingSubmit = () => {
    refetch();
  };

  useEffect(() => {
    if (!user) {
      toast.error("You are unauthenticated. Please login to view your orders");
      navigate("/");
    }
  }, [user, navigate]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock className="w-4 h-4" />;
      case "Delivered":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Truck className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "Delivered":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
          </div>
          <p className="text-gray-600 ml-13">
            Track and manage your grocery orders
          </p>
        </div>

        {/* Empty State */}
        {myOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No orders yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer"
              onClick={() => navigate("/products")}
            >
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {myOrders.map((order) => {
            const isExpanded = expandedOrder === order._id;
            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                {/* Order Header - Clickable to expand */}
                <div
                  onClick={() =>
                    setExpandedOrder(isExpanded ? null : order._id)
                  }
                  className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Package className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">
                          Order #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Calendar className="w-3.5 h-3.5 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${getStatusColor(order.status)}`}
                      >
                        {getStatusIcon(order.status)}
                        {order.status}
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Order Summary - Always visible */}
                <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-600">
                      {order.items.length} item
                      {order.items.length !== 1 ? "s" : ""}
                    </span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-600">{order.paymentType}</span>
                  </div>
                  <span className="font-bold text-green-600">
                    Total: {currency}
                    {order.amount}
                  </span>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                  <>
                    {/* Status Tracker */}
                    <div className="p-5 border-b border-gray-100">
                      <OrderStatusTracker
                        order={order}
                        api={api}
                        onRatingSubmit={handleRatingSubmit}
                      />
                    </div>
                  </>
                )}

                {/* Order Items */}
                <div className="divide-y divide-gray-100">
                  <div className="p-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">
                      Order Items
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {order.items.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 p-3 rounded-lg bg-gray-50 hover:bg-white border border-gray-100 hover:border-gray-200 transition"
                        >
                          <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={item.product.image[0]}
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-gray-900 mb-1 truncate text-sm">
                              {item.product.name}
                            </p>

                            <div className="flex items-center gap-3 text-sm text-gray-500">
                              <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                                {item.product.category}
                              </span>

                              <span>•</span>

                              <span className="font-medium">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>

                          <div className="text-right flex-shrink-0">
                            <p className="text-sm font-bold text-gray-900">
                              {currency}
                              {item.product.offerPrice * item.quantity}
                            </p>

                            <p className="text-xs text-gray-500 mt-0.5">
                              {currency}
                              {item.product.offerPrice} each
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Delivery & Payment Details */}
                <div className="p-5 border-t border-gray-100 bg-gradient-to-r from-blue-50/60 to-indigo-50/60">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Delivery Details */}
                    <div className="bg-white/80 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3 text-gray-700">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <h4 className="text-sm font-semibold">
                          Delivery Details
                        </h4>
                      </div>

                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900">
                          {order.address?.firstName} {order.address?.lastName}
                        </p>

                        <p>{order.address?.street}</p>

                        <p>
                          {order.address?.city}, {order.address?.state}{" "}
                          {order.address?.zipCode}
                        </p>

                        <p>{order.address?.country}</p>
                      </div>
                    </div>

                    {/* Payment Details */}
                    <div className="bg-white/80 rounded-xl p-4 backdrop-blur-sm">
                      <div className="flex items-center gap-2 mb-3 text-gray-700">
                        <CreditCard className="w-4 h-4 text-green-500" />
                        <h4 className="text-sm font-semibold">
                          Payment Details
                        </h4>
                      </div>

                      <div className="text-sm text-gray-600 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Method</span>
                          <span className="font-medium text-gray-800">
                            {order.paymentType}
                          </span>
                        </div>

                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span
                            className={`font-semibold ${
                              order.isPaid
                                ? "text-green-600"
                                : "text-orange-600"
                            }`}
                          >
                            {order.isPaid ? "✓ Paid" : "Pending"}
                          </span>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-gray-500">Order Total</span>
                          <span className="font-bold text-green-600 text-lg">
                            {currency}
                            {order.amount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
