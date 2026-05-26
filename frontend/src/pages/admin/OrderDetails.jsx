import {
  Clock,
} from "lucide-react";

const OrderDetails = ({
  order,
  formatDate,
}) => {
  if (!order) return null;

  const orderItems = Array.isArray(order.items)
    ? order.items
    : [];

  return (
    <div className="space-y-6">
      
      {/* Customer & Delivery Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-5 rounded-2xl border border-gray-100">
        
        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Customer Details
          </h4>

          <p className="font-semibold text-gray-900">
            {order.fullName || "Unknown Customer"}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {order.phoneNumber || "No phone provided"}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {order.email || "No email provided"}
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
            Delivery Info
          </h4>

          <p className="text-sm text-gray-800 font-medium leading-relaxed">
            {order.deliveryAddress || "No address provided"}
          </p>

          <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
            <Clock size={16} />
            <span>
              Ordered: {formatDate(order.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
          Order Items
        </h4>

        <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white">

          {orderItems.length > 0 ? (
            <ul className="divide-y divide-gray-100 max-h-64 overflow-y-auto">

              {orderItems.map((item, index) => (
                <li
                  key={`${item.id}-${index}`}
                  className="p-4 flex items-center justify-between hover:bg-gray-50 transition"
                >
                  
                  <div className="flex items-center gap-4">

                    {item.image ? (
                      <img
                        src={item.image || "/placeholder-food.jpg"}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover bg-gray-100 border border-gray-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400 text-xs font-medium">
                        Img
                      </div>
                    )}

                    <div>
                      <p className="font-bold text-gray-900">
                        {item.name || "Unknown Item"}
                      </p>

                      <p className="text-sm text-gray-500 font-medium">
                        Rs. {Number(item.price || 0).toLocaleString()} × {item.quantity || 1}
                      </p>
                    </div>
                  </div>

                  <div className="font-bold text-gray-900">
                    Rs. {Number(
                      item.subtotal ||
                      (item.price * item.quantity) ||
                      0
                    ).toLocaleString()}
                  </div>
                </li>
              ))}

            </ul>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              No item details found for this order.
            </div>
          )}

          {/* Totals Footer */}
          <div className="bg-gray-50 p-4 border-t border-gray-100 flex flex-col gap-2 text-sm">

            <div className="flex justify-between text-gray-600">
              <span>Payment Method:</span>

              <span className="font-semibold text-gray-900">
                {order.paymentMethod || "Not specified"}

                <span
                  className={`text-xs ml-1 ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-yellow-600"
                  }`}
                >
                  ({order.paymentStatus || "pending"})
                </span>
              </span>
            </div>

            <div className="flex justify-between text-gray-600">
              <span>Estimated Delivery:</span>

              <span className="font-semibold text-gray-900">
                {order.estimatedDeliveryMinutes || 30} mins
              </span>
            </div>

            <div className="flex justify-between items-center mt-2 pt-3 border-t border-gray-200">
              
              <span className="font-bold text-gray-900 text-base">
                Total Amount:
              </span>

              <span className="font-black text-orange-500 text-xl">
                Rs. {Number(order.totalAmount || 0).toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-100">

          <h4 className="text-xs font-bold text-yellow-800 uppercase tracking-wider mb-1">
            Customer Note
          </h4>

          <p className="text-sm text-yellow-900">
            {order.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;