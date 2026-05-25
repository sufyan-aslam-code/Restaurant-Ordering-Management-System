import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Clock, ArrowRight } from "lucide-react";
import Container from "../../components/common/Container";
import Button from "../../components/common/Button";
import { getMyOrders } from "../../api/orders";

const statusLabelMap = {
  pending: "Pending",
  placed: "Placed",
  preparing: "Preparing",
  on_the_way: "On The Way",
  delivered: "Delivered",
  cancelled: "Cancelled"
};

const formatCurrency = (amount) => `Rs. ${Number(amount || 0).toFixed(2)}`;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err?.response?.data?.message || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 dark:bg-slate-950 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-slate-950 min-h-screen">
      <Container>
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
              My Orders
            </h1>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Track, view, and manage your food orders.
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {orders.length === 0 && !error ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-gray-100 dark:border-slate-800 shadow-sm">
              <Package size={64} className="mx-auto text-gray-300 dark:text-slate-600 mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                No orders yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Looks like you haven't placed any orders. Let's fix that!
              </p>

              {/* Added 'flex justify-center' wrapper to center the button */}
              <div className="flex justify-center">
                <Link to="/menu">
                  <Button className="px-8 py-3 rounded-xl">
                    Browse Menu
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md transition-shadow"
                >
                  {/* Left Side: Info */}
                  <div className="space-y-3 flex-1 w-full">
                    <div className="flex items-center justify-between md:justify-start gap-4">
                      <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        {order.orderNumber || order.trackingId}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500 text-xs font-bold uppercase tracking-wider rounded-full">
                        {statusLabelMap[order.status] || order.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-6 text-gray-600 dark:text-gray-300 text-sm">
                      <div className="flex items-center gap-2">
                        <Package size={16} />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={16} />
                        <span>{order.estimatedDeliveryMinutes || 30} mins</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Price & Action */}
                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-4 md:gap-2">
                    <div className="text-left md:text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total</p>
                      <p className="text-xl font-bold text-orange-500">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>

                    <Link
                      to={`/track-order?tracking=${encodeURIComponent(order.orderNumber || order.trackingId)}`}
                      className="text-sm font-semibold text-gray-800 dark:text-white hover:text-orange-500 flex items-center gap-1 transition-colors"
                    >
                      Track Order <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};

export default MyOrders;