import { CheckCircle } from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

import Container from "../../components/common/Container";
import Button from "../../components/common/Button";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const trackingId = order?.trackingId || "Not available";
  const estimatedDelivery = order?.estimatedDeliveryMinutes
    ? `${order.estimatedDeliveryMinutes} mins`
    : "30 - 40 mins";
  const paymentStatus = order?.paymentStatus
    ? order.paymentStatus[0].toUpperCase() + order.paymentStatus.slice(1)
    : "Paid";

  return (
    <section className="py-20 bg-gray-50 min-h-screen flex items-center">
      <Container>

        <div
          className="
            max-w-2xl
            mx-auto
            bg-white
            rounded-3xl
            shadow-md
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
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Order Placed Successfully!
          </h1>

          {/* Description */}
          <p className="text-gray-500 leading-8 mb-8">
            Thank you for your order.
            Your delicious meal is being prepared and
            will be delivered soon.
          </p>

          {/* Order Info */}
          <div
            className="
              bg-gray-100
              rounded-2xl
              p-6
              mb-8
              space-y-3
            "
          >

            <div className="flex justify-between">

              <span className="text-gray-600">
                Order ID
              </span>

              <span className="font-semibold text-gray-800">
                {trackingId}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Estimated Delivery
              </span>

              <span className="font-semibold text-gray-800">
                {estimatedDelivery}
              </span>

            </div>

            <div className="flex justify-between">

              <span className="text-gray-600">
                Payment Status
              </span>

              <span className="font-semibold text-green-600">
                {paymentStatus}
              </span>

            </div>

          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">

            <Button
              onClick={() => navigate("/menu")}
              className="min-w-45"
            >
              Order More
            </Button>

            <Button
              variant="secondary"
              onClick={() => navigate("/profile#orders")}
              className="min-w-45"
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