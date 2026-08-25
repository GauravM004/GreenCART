import React, { useState } from 'react';
import { X, AlertCircle, Truck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const OrderStatusUpdateModal = ({
  isOpen,
  onClose,
  orderId,
  currentStatus,
  onStatusUpdate,
  api
}) => {

  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const [note, setNote] = useState('');
  const [deliveryPartnerName, setDeliveryPartnerName] = useState('');
  const [deliveryPartnerPhone, setDeliveryPartnerPhone] = useState('');
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const statusOptions = [
    {
      value: 'pending',
      label: 'Order Confirmed',
      description: 'Order placed and confirmed by store',
      icon: '📋'
    },
    {
      value: 'accepted',
      label: 'Being Packed',
      description: 'Our team is packing your items with care',
      icon: '📦'
    },
    {
      value: 'assigning_delivery',
      label: 'Delivery Partner Found',
      description: 'Perfect delivery partner matched for your order',
      icon: '🚗'
    },
    {
      value: 'out_for_delivery',
      label: 'On the Way',
      description: 'Your groceries are en route to you',
      icon: '🚚'
    },
    {
      value: 'delivered',
      label: 'Delivered & Fresh',
      description: 'Order successfully delivered to your doorstep',
      icon: '🎉'
    }
  ];

  const handleUpdateStatus = async () => {

    if (selectedStatus === currentStatus && !note) {
      toast.error('Please select a new status or add a note');
      return;
    }

    setIsLoading(true);

    try {

      const payload = {
        newStatus: selectedStatus,
        note: note || undefined
      };

      if (selectedStatus === 'assigning_delivery') {

        if (!deliveryPartnerName || !deliveryPartnerPhone) {
          toast.error('Please provide delivery partner details');
          setIsLoading(false);
          return;
        }

        payload.deliveryPartnerName = deliveryPartnerName;
        payload.deliveryPartnerPhone = deliveryPartnerPhone;

        if (estimatedDeliveryDate) {
          payload.estimatedDeliveryDate = estimatedDeliveryDate;
        }

      }

      const { data } = await api.put(`/api/order/${orderId}/status`, payload);

      if (data.success) {
        toast.success('Order status updated successfully!');
        onStatusUpdate(data.order);
        handleClose();
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false);
    }

  };

  const handleClose = () => {

    setSelectedStatus(currentStatus);
    setNote('');
    setDeliveryPartnerName('');
    setDeliveryPartnerPhone('');
    setEstimatedDeliveryDate('');
    onClose();

  };

  if (!isOpen) return null;

  const selectedStatusObj = statusOptions.find(s => s.value === selectedStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">

        {/* Header */}

        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-bold">Update Order Status</h2>
            <p className="text-blue-100 text-sm mt-1">Order ID: {orderId}</p>
          </div>

          <button
            onClick={handleClose}
            className="hover:bg-blue-800 p-2 rounded-lg transition"
          >
            <X size={24} />
          </button>

        </div>

        {/* Current Status */}

        <div className="bg-gray-50 p-6 border-b">

          <p className="text-sm font-medium text-gray-600 mb-2">
            Current Status:
          </p>

          <div className="inline-block px-4 py-2 rounded-full bg-gray-200 text-gray-800">
            {statusOptions.find(s => s.value === currentStatus)?.label}
          </div>

        </div>

        {/* Status Timeline */}

        <div className="p-6">

          <h3 className="text-lg font-semibold mb-6">
            Select New Status
          </h3>

          <div className="relative pl-10">

            {/* vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

            {statusOptions.map((status) => (

              <div
                key={status.value}
                className="relative mb-6 cursor-pointer"
                onClick={() => setSelectedStatus(status.value)}
              >

                {/* timeline circle */}

                <div
                  className={`absolute -left-[26px] top-1 h-4 w-4 rounded-full border-2 
                  ${selectedStatus === status.value
                      ? "bg-blue-600 border-blue-600"
                      : "bg-white border-gray-300"
                    }`}
                />

                {/* card */}

                <div
                  className={`p-4 rounded-lg border transition
                  ${selectedStatus === status.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >

                  <div className="flex items-start gap-3">

                    <input
                      type="radio"
                      name="status"
                      checked={selectedStatus === status.value}
                      onChange={() => setSelectedStatus(status.value)}
                      className="mt-1"
                    />

                    <div>

                      <p className="font-semibold text-gray-900">
                        {status.icon} {status.label}
                      </p>

                      <p className="text-sm text-gray-600">
                        {status.description}
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            ))}

          </div>

          {/* Delivery Partner Section */}

          {selectedStatus === 'assigning_delivery' && (

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4 mb-6">

              <h4 className="font-semibold mb-4 flex items-center gap-2">
                <Truck size={18} className="text-purple-600" />
                Delivery Partner Details
              </h4>

              <div className="space-y-4">

                <input
                  type="text"
                  placeholder="Partner Name"
                  value={deliveryPartnerName}
                  onChange={(e) => setDeliveryPartnerName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="tel"
                  placeholder="Partner Phone"
                  value={deliveryPartnerPhone}
                  onChange={(e) => setDeliveryPartnerPhone(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />

                <input
                  type="datetime-local"
                  value={estimatedDeliveryDate}
                  onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                />

              </div>

            </div>

          )}

          {/* Note */}

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            className="w-full px-3 py-2 border rounded-lg mb-6"
          />

          {/* Info Box */}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">

            <AlertCircle className="text-blue-600 mt-0.5" size={20} />

            <p className="text-sm text-blue-800">
              Customer will be notified automatically when status changes.
            </p>

          </div>

        </div>

        {/* Footer */}

        <div className="bg-gray-50 p-6 border-t flex gap-3 justify-end">

          <button
            onClick={handleClose}
            className="px-6 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdateStatus}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2"
          >

            {isLoading ? "Updating..." : (
              <>
                <CheckCircle size={18} />
                Update Status
              </>
            )}

          </button>

        </div>

      </div>

    </div>
  );
};

export default OrderStatusUpdateModal;