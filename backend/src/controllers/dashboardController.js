import pool from "../config/db.js";


// =========================================
// GET ADMIN DASHBOARD STATS
// =========================================

export const getDashboardStats = async (
  req,
  res
) => {

  try {

    // =========================================
    // TOTAL REVENUE
    // =========================================

    const [revenueResult] =
      await pool.query(`
        SELECT
          SUM(totalAmount) AS totalRevenue
        FROM orders
        WHERE paymentStatus = 'paid'
      `);

    const totalRevenue =
      revenueResult[0].totalRevenue || 0;


    // =========================================
    // TOTAL ORDERS
    // =========================================

    const [ordersResult] =
      await pool.query(`
        SELECT COUNT(*) AS totalOrders
        FROM orders
      `);

    const totalOrders =
      ordersResult[0].totalOrders || 0;


    // =========================================
    // TOTAL CUSTOMERS
    // =========================================

    const [usersResult] =
      await pool.query(`
        SELECT COUNT(*) AS totalUsers
        FROM users
        WHERE role = 'user'
      `);

    const totalUsers =
      usersResult[0].totalUsers || 0;


    // =========================================
    // TOTAL PRODUCTS
    // =========================================

    const [productsResult] =
      await pool.query(`
        SELECT COUNT(*) AS totalProducts
        FROM products
      `);

    const totalProducts =
      productsResult[0].totalProducts || 0;


    // =========================================
    // RECENT ORDERS
    // =========================================

    const [recentOrders] =
      await pool.query(`
        SELECT
          orders.id,
          orders.orderNumber,
          orders.totalAmount,
          orders.status,
          orders.createdAt,
          users.fullName
        FROM orders
        INNER JOIN users
        ON orders.userId = users.id
        ORDER BY orders.createdAt DESC
        LIMIT 5
      `);


    // =========================================
    // RESPONSE
    // =========================================

    res.status(200).json({

      success: true,

      stats: {

        totalRevenue,

        totalOrders,

        totalUsers,

        totalProducts,

      },

      recentOrders,

    });

  } catch (error) {

    console.error(error);

    res.status(500).json({

      success: false,

      message:
        "Failed to fetch dashboard stats",

    });

  }

};