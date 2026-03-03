import React, { useEffect, useState } from "react";
import {
  ShoppingBag,
  Home,
  Clock,
  MapPin,
  CheckCircle2,
  Truck,
} from "lucide-react";

function SuccessPage({ selectedAddress, navigate }) {
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => setShowConfetti(false), 2500);
  }, []);

  const orderNumber = `GRO${Math.floor(Math.random() * 100000)}`;

  const deliveryTime = new Date(Date.now() + 2 * 60 * 60 * 1000);
  const timeString = deliveryTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const dateString = deliveryTime.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const address = selectedAddress || {
    street: "123 Main Street",
    city: "New York",
    state: "NY",
    country: "USA",
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 py-8 px-4">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                width: "8px",
                height: "8px",
                background: ["#22c55e", "#10b981", "#84cc16"][
                  Math.floor(Math.random() * 3)
                ],
                borderRadius: "50%",
                animation: `fall ${1.5 + Math.random() * 2}s linear forwards`,
                animationDelay: `${Math.random() * 0.3}s`,
                opacity: 0.7,
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-lg mx-auto">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
            <div className="relative bg-green-500 rounded-full p-5 shadow-lg">
              <CheckCircle2
                className="w-12 h-12 text-white"
                strokeWidth={2.5}
              />
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed! 🛒
          </h1>
          <p className="text-gray-600">
            Your groceries are being prepared for delivery
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-4">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="font-semibold text-gray-900">{orderNumber}</p>
            </div>
            <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
              Confirmed
            </span>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 mb-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="bg-green-500 p-2.5 rounded-lg">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-0.5">
                  Estimated Delivery
                </p>
                <p className="font-bold text-gray-900 text-xl">{timeString}</p>
                <p className="text-sm text-gray-600">{dateString}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-lg mt-0.5">
              <MapPin className="w-5 h-5 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-gray-500 mb-1.5">Delivering to</p>
              <p className="font-medium text-gray-900">
                {address.name || "Home"}
              </p>
              <p className="text-sm text-gray-700 leading-relaxed">
                {address.street}, {address.city}, {address.state},{" "}
                {address.country}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-5">
          <div className="flex items-start gap-2">
            <Clock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              You'll receive a notification when your delivery is on the way
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => navigate("/my-orders")}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3.5 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            View Order Details
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3.5 rounded-lg border-2 border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Need to modify your order?{" "}
            <a
              href="#"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              Contact us
            </a>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

export default SuccessPage;
