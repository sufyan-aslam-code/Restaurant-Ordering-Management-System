import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Package,
  MapPin,
  Clock,
} from "lucide-react";

import Container from "../../components/common/Container";
import { getOrderByTrackingId } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

const statusMap = {
  placed: "Order Confirmed",
  preparing: "Preparing",
  on_the_way: "Out for Delivery",
  delivered: "Delivered",
};

const TrackOrder = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const {
    isAuthenticated,
    loadingProfile,
  } = useAuth();

  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("tracking") || ""
  );
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loadingProfile && !isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, loadingProfile, navigate]);

  const handleTrack = async (event) => {
    event.preventDefault();

    if (!trackingNumber.trim()) {
      setError("Please enter a tracking ID.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await getOrderByTrackingId(trackingNumber.trim());
      setOrderInfo(response.data.order);
    } catch (requestError) {
      setOrderInfo(null);
      setError(
        requestError?.response?.data?.message ||
          "Unable to find this order right now."
      );
    } finally {
      setLoading(false);
    }
  };

  const statusText = useMemo(() => {
    if (!orderInfo) {
      return "";
    }

    return statusMap[orderInfo.status] || orderInfo.status;
  }, [orderInfo]);

  return (
    <section className="py-20 min-h-screen bg-linear-to-br from-orange-50 via-white to-orange-100">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Track Order
          </span>

          <h1 className="text-5xl font-bold text-gray-900 mb-5">
            Track Your Delivery
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 leading-8">
            Enter your tracking ID to view your latest order status.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white rounded-3xl shadow-lg p-10 border border-gray-200 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            {error ? (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            <div>
              <label className="block text-gray-700 font-semibold mb-3">
                Tracking ID
              </label>

              <input
                type="text"
                placeholder="Enter your tracking ID (e.g., FH123456...)"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 outline-none transition"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-2xl transition duration-300 disabled:opacity-60"
              disabled={loading}
            >
              {loading ? "Checking..." : "Track Order"}
            </button>
          </form>
        </div>

        {orderInfo ? (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-lg p-10 border border-gray-200 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Order #{orderInfo.trackingId}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Package size={24} className="text-orange-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Status</h3>
                    <p className="text-gray-600">{statusText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <Clock size={24} className="text-orange-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Estimated Time
                    </h3>
                    <p className="text-gray-600">
                      {orderInfo.estimatedDeliveryMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-orange-500" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      Delivery Address
                    </h3>
                    <p className="text-gray-600">
                      {orderInfo.deliveryAddress}, {orderInfo.city}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
};

export default TrackOrder;
