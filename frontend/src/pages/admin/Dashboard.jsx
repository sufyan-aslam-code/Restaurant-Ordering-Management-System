import { useEffect, useState } from "react";

import {
  DollarSign,
  ShoppingBag,
  Users,
  Utensils,
  TrendingUp,
} from "lucide-react";

import { toast } from "react-toastify";

import {
  getDashboardStats,
} from "../../api/dashboard";


const Dashboard = () => {

  // =========================================
  // STATES
  // =========================================

  const [loading, setLoading] =
    useState(true);

  const [dashboardData, setDashboardData] =
    useState({

      stats: {

        totalRevenue: 0,

        totalOrders: 0,

        totalUsers: 0,

        totalProducts: 0,

      },

      recentOrders: [],

    });


  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================

  const fetchDashboardData = async () => {

    try {

      setLoading(true);

      const response =
        await getDashboardStats();

      setDashboardData(
        response.data
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to load dashboard"
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // INITIAL LOAD
  // =========================================

  useEffect(() => {

    fetchDashboardData();

  }, []);


  // =========================================
  // STATS
  // =========================================

  const stats =
    dashboardData.stats;


  // =========================================
  // STAT CARD
  // =========================================

  const StatCard = ({
    title,
    value,
    icon: Icon,
    colorClass,
  }) => (

    <div
      className="
        bg-white
        p-6
        rounded-3xl
        border
        border-gray-100
        shadow-sm
        hover:shadow-md
        transition
        flex
        items-center
        gap-4
      "
    >

      <div
        className={`
          p-4
          rounded-2xl
          ${colorClass}
        `}
      >

        <Icon size={24} />

      </div>


      <div>

        <p
          className="
            text-sm
            font-medium
            text-gray-500
            mb-1
          "
        >
          {title}
        </p>


        <h3
          className="
            text-2xl
            font-black
            text-gray-900
          "
        >
          {value}
        </h3>

      </div>

    </div>

  );


  // =========================================
  // LOADING STATE
  // =========================================

  if (loading) {

    return (

      <div
        className="
          flex
          items-center
          justify-center
          min-h-[60vh]
        "
      >

        <div className="text-center">

          <div
            className="
              w-12
              h-12
              border-4
              border-orange-500
              border-t-transparent
              rounded-full
              animate-spin
              mx-auto
              mb-4
            "
          />

          <p className="text-gray-500">
            Loading dashboard...
          </p>

        </div>

      </div>

    );

  }


  return (

    <div className="max-w-7xl mx-auto">

      {/* ========================================= */}
      {/* HEADER */}
      {/* ========================================= */}

      <div className="mb-8">

        <h1
          className="
            text-3xl
            font-bold
            text-gray-900
          "
        >
          Dashboard Overview
        </h1>

        <p
          className="
            text-gray-500
            mt-2
          "
        >
          Welcome back to the
          FoodieHub admin panel.
        </p>

      </div>


      {/* ========================================= */}
      {/* STATS GRID */}
      {/* ========================================= */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mb-10
        "
      >

        <StatCard
          title="Total Revenue"
          value={`Rs. ${Number(
            stats.totalRevenue || 0
          ).toLocaleString()}`}
          icon={DollarSign}
          colorClass="
            bg-green-100
            text-green-600
          "
        />


        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={ShoppingBag}
          colorClass="
            bg-blue-100
            text-blue-600
          "
        />


        <StatCard
          title="Total Customers"
          value={stats.totalUsers}
          icon={Users}
          colorClass="
            bg-purple-100
            text-purple-600
          "
        />


        <StatCard
          title="Menu Items"
          value={stats.totalProducts}
          icon={Utensils}
          colorClass="
            bg-orange-100
            text-orange-600
          "
        />

      </div>


      {/* ========================================= */}
      {/* RECENT ORDERS */}
      {/* ========================================= */}

      <div
        className="
          bg-white
          rounded-3xl
          border
          border-gray-100
          shadow-sm
          overflow-hidden
        "
      >

        {/* HEADER */}
        <div
          className="
            p-6
            border-b
            border-gray-100
            flex
            items-center
            justify-between
          "
        >

          <h2
            className="
              text-lg
              font-bold
              text-gray-900
              flex
              items-center
              gap-2
            "
          >

            <TrendingUp
              size={20}
              className="
                text-orange-500
              "
            />

            Recent Orders

          </h2>

        </div>


        {/* TABLE */}
        <div className="overflow-x-auto">

          <table
            className="
              w-full
              min-w-[700px]
            "
          >

            <thead>

              <tr
                className="
                  bg-gray-50
                  border-b
                  border-gray-100
                "
              >

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Order ID
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Customer
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Date
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-left
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Status
                </th>

                <th
                  className="
                    px-6
                    py-4
                    text-right
                    text-sm
                    font-semibold
                    text-gray-500
                  "
                >
                  Total
                </th>

              </tr>

            </thead>


            <tbody>

              {dashboardData.recentOrders
                .length > 0 ? (

                dashboardData.recentOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      className="
                        border-b
                        border-gray-50
                        hover:bg-gray-50/50
                        transition
                      "
                    >

                      {/* ORDER NUMBER */}
                      <td
                        className="
                          px-6
                          py-5
                          font-semibold
                          text-gray-900
                        "
                      >
                        {
                          order.orderNumber
                        }
                      </td>


                      {/* CUSTOMER */}
                      <td
                        className="
                          px-6
                          py-5
                          text-gray-700
                        "
                      >
                        {
                          order.fullName
                        }
                      </td>


                      {/* DATE */}
                      <td
                        className="
                          px-6
                          py-5
                          text-sm
                          text-gray-500
                        "
                      >

                        {
                          new Date(
                            order.createdAt
                          ).toLocaleDateString()
                        }

                      </td>


                      {/* STATUS */}
                      <td className="px-6 py-5">

                        <span
                          className={`
                            inline-flex
                            items-center
                            px-3
                            py-1
                            rounded-full
                            text-xs
                            font-bold
                            capitalize

                            ${
                              order.status ===
                              "delivered"

                                ? `
                                  bg-green-100
                                  text-green-700
                                `

                                : order.status ===
                                  "preparing"

                                ? `
                                  bg-blue-100
                                  text-blue-700
                                `

                                : order.status ===
                                  "cancelled"

                                ? `
                                  bg-red-100
                                  text-red-700
                                `

                                : `
                                  bg-yellow-100
                                  text-yellow-700
                                `
                            }
                          `}
                        >

                          {order.status}

                        </span>

                      </td>


                      {/* TOTAL */}
                      <td
                        className="
                          px-6
                          py-5
                          text-right
                          font-bold
                          text-gray-900
                        "
                      >

                        Rs. {
                          Number(
                            order.totalAmount
                          ).toLocaleString()
                        }

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="
                      py-16
                      text-center
                      text-gray-500
                    "
                  >

                    No recent orders found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>

  );

};

export default Dashboard;