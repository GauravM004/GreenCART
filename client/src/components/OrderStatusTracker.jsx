import React, { useState } from "react";
import {
  Star,
  Send,
  CheckCircle,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
} from "lucide-react";
import toast from "react-hot-toast";

/**
 * OrderStatusTracker Component
 * Displays order status timeline for customers
 * Allows customer to rate order after delivery
 *
 * Props:
 *  - order: order object with status and statusHistory
 *  - api: axios instance
 *  - onRatingSubmit: callback after rating submitted
 */
const OrderStatusTracker = ({ order, api, onRatingSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);

  // Status timeline
  const statusTimeline = [
    {
      value: "pending",
      label: "Order Placed",
      description: "Your order has been received",
      icon: "📋",
      color: "bg-gray-100 text-gray-700",
    },
    {
      value: "accepted",
      label: "Order Accepted",
      description: "Seller confirmed your order",
      icon: "✓",
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "assigning_delivery",
      label: "Processing",
      description: "Finding best delivery option",
      icon: "🔍",
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "out_for_delivery",
      label: "Out for Delivery",
      description: "Your order is on the way",
      icon: "🚚",
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "delivered",
      label: "Delivered",
      description: "Order successfully delivered",
      icon: "📦",
      color: "bg-green-100 text-green-700",
    },
  ];

  // Get current status index
  const currentStatusIndex = statusTimeline.findIndex(
    (s) => s.value === order.status,
  );

  const handleRatingSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }

    setIsSubmittingRating(true);
    try {
      const { data } = await api.post(`/api/order/${order._id}/rating`, {
        rating,
        review,
      });

      if (data.success) {
        toast.success("Thank you for your feedback!");
        setRating(0);
        setReview("");
        if (onRatingSubmit) {
          onRatingSubmit(data.order);
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "Failed to submit rating");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* STATUS TIMELINE */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Truck className="text-blue-600" size={20} />
          Order Status
        </h3>

        {/* Horizontal Timeline */}
        <div className="relative">
          {/* Progress bar background */}
          <div className="absolute top-5 left-5 right-5 h-1 bg-gray-200">
            {" "}
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
              style={{
                width: `${((currentStatusIndex / (statusTimeline.length - 1)) * 100)}%`,
              }}
            />
          </div>

          {/* Timeline steps - Horizontal Layout */}
          <div className="flex justify-between items-start gap-2">
            {statusTimeline.map((step, index) => {
              const isCompleted = index <= currentStatusIndex;
              const isCurrent = index === currentStatusIndex;

              return (
                <div
                  key={step.value}
                  className="flex-1 flex flex-col items-center"
                >
                  {/* Timeline dot */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-all z-10 bg-white border-2 ${
                      isCompleted
                        ? "border-green-500 text-green-600"
                        : "border-gray-300 text-gray-400"
                    } ${isCurrent ? "ring-4 ring-blue-300 scale-110" : ""}`}
                  >
                    {step.icon}
                  </div>

                  {/* Timeline content - compact vertical */}
                  <div className="text-center mt-3 w-full px-1">
                    <p
                      className={`font-semibold text-sm transition line-clamp-2 ${
                        isCompleted ? "text-gray-900" : "text-gray-500"
                      } ${isCurrent ? "text-blue-600" : ""}`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs ${isCompleted ? "text-gray-600" : "text-gray-400"} line-clamp-2`}
                    >
                      {step.description}
                    </p>

                    {/* Show delivery partner info if available and this step is active */}
                    {isCurrent && order.deliveryPartnerName && (
                      <div className="mt-2 bg-orange-50 border border-orange-200 rounded p-1.5 text-xs w-full">
                        <p className="font-medium text-orange-900 mb-0.5">
                          📍 {order.deliveryPartnerName}
                        </p>
                        <p className="text-orange-800">
                          📞 {order.deliveryPartnerPhone}
                        </p>
                        {order.estimatedDeliveryDate && (
                          <p className="text-orange-800 mt-0.5">
                            ⏰{" "}
                            {new Date(
                              order.estimatedDeliveryDate,
                            ).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Show timestamp if available */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                      <>
                        {order.statusHistory
                          .filter((h) => h.status === step.value)
                          .map((history, idx) => (
                            <div
                              key={idx}
                              className="mt-1.5 text-xs text-gray-500"
                            >
                              ✓ {new Date(history.timestamp).toLocaleString()}
                              {/* show note only if it's meaningful */}
                              {history.note &&
                                !history.note
                                  .toLowerCase()
                                  .includes("status changed") && (
                                  <p className="text-xs text-gray-500">
                                    {history.note}
                                  </p>
                                )}
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* RATING SECTION (show only if delivered) */}
      {order.status === "delivered" && !order.isRated && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-6">
          <h3 className="text-lg font-bold mb-1 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            Rate Your Order
          </h3>
          <p className="text-gray-600 text-sm mb-4">
            Help us improve by sharing your experience
          </p>

          <div className="space-y-4">
            {/* Star rating */}
            <div className="flex gap-2 justify-center py-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform hover:scale-125"
                >
                  <Star
                    size={36}
                    className={`transition ${
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <div className="text-center text-sm font-medium text-gray-700">
                {rating === 5 && "🎉 Excellent!"}
                {rating === 4 && "😊 Good!"}
                {rating === 3 && "😐 Okay"}
                {rating === 2 && "😞 Could be better"}
                {rating === 1 && "😞 Poor experience"}
              </div>
            )}

            {/* Review textarea */}
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your feedback... (Optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 resize-none"
              rows="3"
            />

            {/* Submit button */}
            <button
              onClick={handleRatingSubmit}
              disabled={isSubmittingRating || rating === 0}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmittingRating ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={18} />
                  Submit Rating
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* ALREADY RATED */}
      {order.isRated && (
        <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-6">
          <div className="flex gap-3 items-start">
            <CheckCircle
              className="text-green-600 flex-shrink-0 mt-0.5"
              size={20}
            />
            <div>
              <p className="font-semibold text-green-900 mb-1">
                Thank you for rating!
              </p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={`${
                      i < order.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span className="text-sm text-green-800 ml-2">
                  ({order.rating} out of 5 stars)
                </span>
              </div>
              {order.review && (
                <p className="mt-3 text-green-800 italic text-sm">
                  "{order.review}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATUS NOTES */}
      {order.statusHistory && order.statusHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h4 className="font-semibold mb-3 text-gray-900">Status History</h4>
          <div className="space-y-2 text-sm">
            {[...order.statusHistory].reverse().map((history, idx) => (
              <div
                key={idx}
                className="flex justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <span className="font-medium text-gray-700">
                  {history.status}
                </span>
                <span className="text-gray-500">
                  {new Date(history.timestamp).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderStatusTracker;
