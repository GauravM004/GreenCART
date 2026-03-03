import React, { useEffect, useState } from "react";
import { useAppContext } from "../context/AppContext";
import { Package, Clock, CheckCircle, Truck, ShoppingBag, Calendar, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

const MyOrders = () => {
  const [myOrders, setMyOrders] = useState([]);
  const { currency, axios, user, navigate } = useAppContext();

  const fetchMyOrders = async () => {
    try {
      const { data } = await axios.get("/api/order/user");
      if (data.success) {
        setMyOrders(data.orders);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyOrders();
    } else {
      setMyOrders([]);
      toast.error("You are unauthenticated. Please login to view your orders");
      return navigate("/");
    }
  }, [user]);

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
          <p className="text-gray-600 ml-13">Track and manage your grocery orders</p>
        </div>

        {/* Empty State */}
        {myOrders.length === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-6">Start shopping to see your orders here</p>
            <button className="px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition cursor-pointer" onClick={() => navigate("/products")}>
              Start Shopping
            </button>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-6">
          {myOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {/* Order Header */}
              <div className="bg-gradient-to-r from-gray-50 to-white p-5 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-lg">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border font-semibold text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {order.status}
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="divide-y divide-gray-100">
                {order.items.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center gap-4 p-5 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.product.image[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 mb-1 truncate">
                        {item.product.name}
                      </p>
                      <div className="flex items-center gap-3 text-sm text-gray-500">
                        <span className="px-2 py-0.5 bg-gray-100 rounded text-xs font-medium">
                          {item.product.category}
                        </span>
                        <span>•</span>
                        <span className="font-medium">Qty: {item.quantity}</span>
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-gray-900">
                        {currency}{item.product.offerPrice * item.quantity}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {currency}{item.product.offerPrice} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Footer */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 border-t border-green-100">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-600" />
                    <span className="text-gray-700 font-medium">{order.paymentType}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`font-semibold ${order.isPaid ? "text-green-600" : "text-orange-600"}`}>
                      {order.isPaid ? "✓ Paid" : "Pay on Delivery"}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-gray-700 font-medium">Total:</span>
                    <span className="text-2xl font-bold text-green-600">
                      {currency}{order.amount}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;