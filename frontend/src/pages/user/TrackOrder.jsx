import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  Package,
  MapPin,
  Clock,
} from "lucide-react";

import Container from "../../components/common/Container";
import { getOrderByOrderNumber } from "../../api/orders";
import { useAuth } from "../../context/AuthContext";

const statusMap = {
  pending: "Pending", // Corrected to reflect database state
  confirmed: "Confirmed",
  preparing: "Preparing",
  on_the_way: "Out for Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
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
      const response = await getOrderByOrderNumber(trackingNumber.trim());
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
    <section className="py-20 min-h-screen bg-gray-50 dark:bg-slate-950">
      <Container>
        <div className="text-center mb-16">
          <span className="inline-block bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 font-semibold px-5 py-2 rounded-full mb-5">
            Track Order
          </span>

          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-5">
            Track Your Delivery
          </h1>

          <p className="max-w-3xl mx-auto text-lg text-gray-500 dark:text-gray-400 leading-8">
            Enter your tracking ID to view your latest order status.
          </p>
        </div>

        <div className="max-w-2xl mx-auto bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 border border-gray-100 dark:border-slate-800 mb-12">
          <form onSubmit={handleTrack} className="space-y-6">
            {error && (
              <div className="rounded-xl border border-red-200 dark:border-red-500/30 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-3">
                Tracking ID
              </label>
              <input
                type="text"
                placeholder="Enter your tracking ID (e.g., FH-...)"
                value={trackingNumber}
                onChange={(event) => setTrackingNumber(event.target.value)}
                className="w-full px-5 py-4 rounded-2xl border border-gray-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 outline-none transition"
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

        {orderInfo && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-lg p-10 border border-gray-100 dark:border-slate-800 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Order #{orderInfo.orderNumber}
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Package size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Status</h3>
                    <p className="text-gray-600 dark:text-gray-400">{statusText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Clock size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Estimated Time</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {orderInfo.estimatedDeliveryMinutes} mins
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-500/10 flex items-center justify-center shrink-0">
                    <MapPin size={24} className="text-orange-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Delivery Address</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {orderInfo.deliveryAddress}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default TrackOrder;