import { CheckCircle } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  // FIXED: Looking for orderNumber instead of trackingId
  const trackingId = order?.orderNumber || "Not available";
  
  const estimatedDelivery = order?.estimatedDeliveryMinutes
    ? `${order.estimatedDeliveryMinutes} mins`
    : "30 - 40 mins";
    
  const paymentStatus = order?.paymentStatus
    ? order.paymentStatus[0].toUpperCase() + order.paymentStatus.slice(1)
    : "Paid";

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center">
      <Container>
        <div
          className="
            max-w-2xl
            mx-auto
            bg-white
            dark:bg-slate-900
            rounded-3xl
            shadow-md
            border border-gray-100 dark:border-slate-800
            p-10
            text-center
          "
        >
          {/* Success Icon */}
          <div className="flex justify-center mb-6">
            <CheckCircle
              size={90}
              className="text-green-500"
            />
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Order Placed Successfully!
          </h1>

          {/* Description */}
          <p className="text-gray-500 dark:text-gray-400 leading-8 mb-8">
            Thank you for your order.
            Your delicious meal is being prepared and
            will be delivered soon.
          </p>

          {/* Order Info */}
          <div
            className="
              bg-gray-100 dark:bg-slate-800
              rounded-2xl
              p-6
              mb-8
              space-y-4
            "
          >
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Order ID
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {trackingId}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Estimated Delivery
              </span>
              <span className="font-semibold text-gray-800 dark:text-gray-100">
                {estimatedDelivery}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">
                Payment Status
              </span>
              <span className="font-semibold text-green-600 dark:text-green-500">
                {paymentStatus}
              </span>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => navigate("/menu")}
              className="min-w-45 py-3 rounded-xl"
            >
              Order More
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/my-orders")}
              className="min-w-45 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-white"
            >
              View My Orders
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default OrderSuccess;