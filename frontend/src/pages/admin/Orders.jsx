import { useEffect, useMemo, useState } from "react";

import {
  Search,
  Eye,
  Clock,
  Truck,
  XCircle,
  CheckCircle2,
  PackageCheck,
} from "lucide-react";

import { toast } from "react-toastify";

import useApi from "../../hooks/useApi";

import apiClient from "../../api/client";

import Modal from "../../components/common/Modal";

import OrderDetails from "./OrderDetails";


// =========================================
// STATUS CONFIG
// =========================================
const STATUS_OPTIONS = [
  "all",
  "pending",
  "confirmed",
  "preparing",
  "delivered",
  "cancelled",
];


// =========================================
// STATUS BADGE
// =========================================
const StatusBadge = ({ status }) => {

  const normalizedStatus =
    status?.toLowerCase();

  const statusConfig = {

    pending: {
      icon: Clock,
      className:
        "bg-yellow-100 text-yellow-700",
      label: "Pending",
    },

    confirmed: {
      icon: CheckCircle2,
      className:
        "bg-blue-100 text-blue-700",
      label: "Confirmed",
    },

    preparing: {
      icon: PackageCheck,
      className:
        "bg-purple-100 text-purple-700",
      label: "Preparing",
    },

    delivered: {
      icon: Truck,
      className:
        "bg-green-100 text-green-700",
      label: "Delivered",
    },

    cancelled: {
      icon: XCircle,
      className:
        "bg-red-100 text-red-700",
      label: "Cancelled",
    },
  };

  const currentStatus =
    statusConfig[normalizedStatus] ||
    statusConfig.pending;

  const Icon =
    currentStatus.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold whitespace-nowrap ${currentStatus.className}`}
    >
      <Icon size={14} />

      {currentStatus.label}
    </span>
  );
};


// =========================================
// MAIN COMPONENT
// =========================================
const Orders = () => {

  const [searchTerm, setSearchTerm] =
    useState("");

  const [filterStatus, setFilterStatus] =
    useState("all");

  const [orders, setOrders] =
    useState([]);

  const [updatingId, setUpdatingId] =
    useState(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [selectedOrder, setSelectedOrder] =
    useState(null);


  // =========================================
  // FETCH ORDERS
  // =========================================
  const {
    data,
    loading,
    error,
  } = useApi(() =>
    apiClient.get("/admin/orders")
  );


  // =========================================
  // SET ORDERS
  // =========================================
  useEffect(() => {

    if (!data?.orders) return;

    setOrders(data.orders);

  }, [data]);


  // =========================================
  // FILTERED ORDERS
  // =========================================
  const filteredOrders =
    useMemo(() => {

      return orders.filter((order) => {

        const searchableText =
          `${order.orderNumber} ${order.fullName || ""} ${order.phoneNumber || ""}`.toLowerCase();

        const matchesSearch =
          searchableText.includes(
            searchTerm.toLowerCase()
          );

        const matchesStatus =
          filterStatus === "all"
            ? true
            : order.status === filterStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      });

    }, [
      orders,
      searchTerm,
      filterStatus,
    ]);


  // =========================================
  // UPDATE ORDER STATUS
  // =========================================
  const handleUpdateStatus =
    async (
      orderId,
      newStatus
    ) => {

      try {

        setUpdatingId(orderId);

        await apiClient.patch(
          `/orders/admin/${orderId}/status`,
          {
            status: newStatus,
          }
        );

        setOrders((prev) =>
          prev.map((order) =>
            order.id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        if (
          selectedOrder &&
          selectedOrder.id === orderId
        ) {

          setSelectedOrder((prev) => ({
            ...prev,
            status: newStatus,
          }));
        }

        toast.success(
          `Order marked as ${newStatus}`
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to update order status"
        );

      } finally {

        setUpdatingId(null);
      }
    };


  // =========================================
  // VIEW ORDER DETAILS
  // =========================================
  const handleViewOrder =
    async (order) => {

      try {

        const response =
          await apiClient.get(
            `/admin/orders/${order.id}`
          );

        setSelectedOrder(
          response.data.order
        );

        setIsModalOpen(true);

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to load order details"
        );
      }
    };


  // =========================================
  // FORMAT DATE
  // =========================================
  const formatDate = (date) => {

    if (!date) return "N/A";

    return new Date(date)
      .toLocaleString(
        "en-PK",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }
      );
  };


  // =========================================
  // TOTAL REVENUE
  // =========================================
  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.totalAmount || 0
        ),
      0
    );


  return (
    <div className="max-w-7xl mx-auto pb-12">

      {/* MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        title={`Order ${selectedOrder?.orderNumber || ""}`}
        maxWidth="max-w-3xl"
      >
        <OrderDetails
          order={selectedOrder}
          formatDate={formatDate}
        />
      </Modal>


      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Manage Orders
        </h1>

        <p className="mt-1 text-gray-500">
          Track and manage all customer orders.
        </p>
      </div>


      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-gray-500">
            Total Orders
          </p>

          <h3 className="mt-2 text-3xl font-black text-gray-900">
            {orders.length}
          </h3>
        </div>


        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-gray-500">
            Pending Orders
          </p>

          <h3 className="mt-2 text-3xl font-black text-yellow-600">
            {
              orders.filter(
                (order) =>
                  order.status === "pending"
              ).length
            }
          </h3>
        </div>


        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-gray-500">
            Delivered Orders
          </p>

          <h3 className="mt-2 text-3xl font-black text-green-600">
            {
              orders.filter(
                (order) =>
                  order.status === "delivered"
              ).length
            }
          </h3>
        </div>


        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm hover:shadow-md transition">
          <p className="text-sm font-medium text-gray-500">
            Revenue
          </p>

          <h3 className="mt-2 text-3xl font-black text-gray-900">
            Rs. {totalRevenue.toLocaleString()}
          </h3>
        </div>

      </div>


      {/* TOOLBAR */}
      <div className="rounded-t-3xl border border-gray-100 border-b-0 bg-white p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        {/* SEARCH */}
        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Search orders (Name, Phone, ID)..."
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(
                event.target.value
              )
            }
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-100"
          />
        </div>


        {/* FILTERS */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">

          {STATUS_OPTIONS.map(
            (status) => (
              <button
                key={status}
                onClick={() =>
                  setFilterStatus(status)
                }
                className={`whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  filterStatus === status
                    ? "bg-gray-900 text-white shadow-sm"
                    : "border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status.charAt(0).toUpperCase() +
                  status.slice(1)}
              </button>
            )
          )}

        </div>
      </div>


      {/* TABLE */}
      <div className="overflow-hidden rounded-b-3xl border border-gray-100 bg-white shadow-sm">

        {loading ? (

          <div className="p-16 text-center">

            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />

            <p className="text-gray-500">
              Loading orders...
            </p>
          </div>

        ) : error ? (

          <div className="p-16 text-center text-red-500">
            Failed to load orders.
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Order
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Total
                  </th>

                  <th className="px-6 py-4 text-right text-sm font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>


              <tbody className="divide-y divide-gray-50">

                {filteredOrders.length > 0 ? (

                  filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="transition hover:bg-gray-50/80 dark:hover:bg-slate-800/50"
                    >

                      {/* ORDER */}
                      <td className="px-6 py-5">

                        <div>
                          <h3 className="font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>

                          <p className="mt-1 text-xs text-gray-500 font-medium">
                            {formatDate(
                              order.createdAt
                            )}
                          </p>
                        </div>
                      </td>


                      {/* CUSTOMER */}
                      <td className="px-6 py-5">

                        <h3 className="font-semibold text-gray-800">
                          {order.fullName ||
                            "Unknown Customer"}
                        </h3>
                      </td>


                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <StatusBadge
                          status={order.status}
                        />
                      </td>


                      {/* TOTAL */}
                      <td className="px-6 py-5 font-bold text-gray-900 whitespace-nowrap">

                        Rs. {Number(
                          order.totalAmount || 0
                        ).toLocaleString()}
                      </td>


                      {/* ACTIONS */}
                      <td className="px-6 py-5">

                        <div className="flex items-center justify-end gap-2">

                          {/* CONFIRM */}
                          {order.status === "pending" && (
                            <button
                              disabled={
                                updatingId === order.id
                              }
                              onClick={() =>
                                handleUpdateStatus(
                                  order.id,
                                  "confirmed"
                                )
                              }
                              className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 transition hover:bg-blue-100 disabled:opacity-50"
                            >
                              Confirm
                            </button>
                          )}


                          {/* PREPARING */}
                          {order.status === "confirmed" && (
                            <button
                              disabled={
                                updatingId === order.id
                              }
                              onClick={() =>
                                handleUpdateStatus(
                                  order.id,
                                  "preparing"
                                )
                              }
                              className="rounded-xl bg-purple-50 px-3 py-2 text-xs font-bold text-purple-600 transition hover:bg-purple-100 disabled:opacity-50"
                            >
                              Preparing
                            </button>
                          )}


                          {/* DELIVER */}
                          {order.status === "preparing" && (
                            <button
                              disabled={
                                updatingId === order.id
                              }
                              onClick={() =>
                                handleUpdateStatus(
                                  order.id,
                                  "delivered"
                                )
                              }
                              className="rounded-xl bg-green-50 px-3 py-2 text-xs font-bold text-green-600 transition hover:bg-green-100 disabled:opacity-50"
                            >
                              Delivered
                            </button>
                          )}


                          {/* CANCEL */}
                          {![
                            "delivered",
                            "cancelled",
                          ].includes(order.status) && (
                            <button
                              disabled={
                                updatingId === order.id
                              }
                              onClick={() =>
                                handleUpdateStatus(
                                  order.id,
                                  "cancelled"
                                )
                              }
                              className="rounded-xl bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              Cancel
                            </button>
                          )}


                          {/* VIEW */}
                          <button
                            onClick={() =>
                              handleViewOrder(order)
                            }
                            className="rounded-xl p-2.5 text-gray-500 bg-gray-50 border border-transparent transition hover:bg-white hover:border-gray-200 hover:text-orange-500 hover:shadow-sm"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))

                ) : (

                  <tr>

                    <td
                      colSpan="5"
                      className="py-16 text-center text-gray-500"
                    >

                      <div className="flex flex-col items-center justify-center">

                        <PackageCheck
                          size={48}
                          className="text-gray-300 mb-4"
                        />

                        <p className="text-lg font-medium text-gray-900">
                          No orders found
                        </p>

                        <p className="text-sm mt-1">
                          Try adjusting your filters or search term.
                        </p>
                      </div>
                    </td>
                  </tr>
                )}

              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;