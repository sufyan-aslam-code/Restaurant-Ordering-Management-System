import { query } from "../config/db.js";

const generateOrderNumber = () => {
  const random = Math.floor(100000 + Math.random() * 900000);
  return `FH-${Date.now()}-${random}`;
};

const formatOrder = (order, items = []) => ({
  id: order.id,
  orderNumber: order.orderNumber,
  totalAmount: Number(order.totalAmount),
  status: order.status,
  paymentMethod: order.paymentMethod,
  paymentStatus: order.paymentStatus,
  deliveryAddress: order.deliveryAddress,
  phoneNumber: order.phoneNumber,
  estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
  notes: order.notes,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
  items,
});

// =========================================
// CREATE ORDER
// =========================================

export const createOrder = async (req, res) => {
  try {
    const {
  items,
  deliveryAddress,
  phoneNumber,
  paymentMethod = "Cash on Delivery",
  paymentStatus = "pending",
  notes = "",
} = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Order items are required.",
      });
    }

    if (!deliveryAddress || !phoneNumber) {
      return res.status(400).json({
        message: "Delivery address and phone number are required.",
      });
    }

    let totalAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const productId = Number(item.productId);
      const quantity = Number(item.quantity);

      if (!productId || quantity <= 0) {
        return res.status(400).json({
          message: "Invalid product or quantity.",
        });
      }

      const [products] = await query(
        `
        SELECT
          id,
          name,
          price,
          stockQuantity,
          image
        FROM products
        WHERE id = ?
        LIMIT 1
        `,
        [productId]
      );

      const product = products[0];

      if (!product) {
        return res.status(404).json({
          message: `Product with ID ${productId} not found.`,
        });
      }

      if (!product.stockQuantity || product.stockQuantity <= 0) {
        return res.status(400).json({
          message: `${product.name} is currently unavailable.`,
        });
      }

      if (product.stockQuantity < quantity) {
        return res.status(400).json({
          message: `Only ${product.stockQuantity} ${product.name} available in stock.`,
        });
      }

      const price = Number(product.price);
      const subtotal = price * quantity;

      totalAmount += subtotal;

      validatedItems.push({
        productId: product.id,
        name: product.name,
        image: product.image,
        quantity,
        price,
        subtotal,
      });
    }

    const orderNumber = generateOrderNumber();

    const [orderResult] = await query(
      `
      INSERT INTO orders (
        orderNumber,
        userId,
        totalAmount,
        status,
        paymentMethod,
        paymentStatus,
        deliveryAddress,
        phoneNumber,
        estimatedDeliveryMinutes,
        notes
      )
      VALUES (?, ?, ?, 'pending', ?, ?, ?, ?, 35, ?)
      `,
      [
  orderNumber,
  req.auth.sub,
  totalAmount,
  paymentMethod,
  paymentStatus,
  deliveryAddress.trim(),
  phoneNumber.trim(),
  notes.trim(),
]
    );

    const orderId = orderResult.insertId;

    for (const item of validatedItems) {
      await query(
        `
        INSERT INTO order_items (
          orderId,
          productId,
          quantity,
          price,
          subtotal
        )
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          orderId,
          item.productId,
          item.quantity,
          item.price,
          item.subtotal,
        ]
      );

      await query(
        `
        UPDATE products
        SET stockQuantity = stockQuantity - ?
        WHERE id = ?
        `,
        [
          item.quantity,
          item.productId,
        ]
      );
    }

    const [orders] = await query(
      `
      SELECT *
      FROM orders
      WHERE id = ?
      LIMIT 1
      `,
      [orderId]
    );

    const createdOrder = orders[0];

    try {
      const [users] = await query(
        `
        SELECT fullName, email
        FROM users
        WHERE id = ?
        LIMIT 1
        `,
        [req.auth.sub]
      );

      const user = users[0];

      if (user?.email) {
        const itemsHtml = validatedItems
          .map(
            (item) => `
              <li style="margin-bottom:8px;">
                ${item.name} × ${item.quantity}
                — Rs. ${item.subtotal.toFixed(2)}
              </li>
            `
          )
          .join("");

       const html = `
  <div style="
    background:#f3f4f6;
    padding:40px 20px;
    font-family:Arial,sans-serif;
  ">

    <div style="
      max-width:600px;
      margin:0 auto;
      background:#ffffff;
      border-radius:16px;
      overflow:hidden;
      box-shadow:0 4px 12px rgba(0,0,0,0.08);
    ">

      <!-- HEADER -->
      <div style="
        background:#f97316;
        color:white;
        padding:28px;
        text-align:center;
      ">
        <h1 style="
          margin:0;
          font-size:30px;
          font-weight:700;
        ">
          FoodieHub
        </h1>

        <p style="
          margin-top:8px;
          font-size:15px;
          opacity:0.9;
        ">
          Order Confirmation
        </p>
      </div>

      <!-- BODY -->
      <div style="padding:32px;">

        <p style="
          font-size:18px;
          margin-bottom:20px;
          color:#111827;
        ">
          Hi ${user.fullName},
        </p>

        <p style="
          color:#4b5563;
          margin-bottom:24px;
          font-size:15px;
        ">
          Your order has been placed successfully. We are preparing your delicious meal and will notify you once your order is confirmed.
        </p>

        <!-- ORDER SUMMARY -->
        <div style="
          background:#f9fafb;
          border:1px solid #e5e7eb;
          border-radius:12px;
          padding:20px;
          margin-bottom:28px;
        ">

          <h3 style="
            margin-top:0;
            margin-bottom:16px;
            color:#111827;
          ">
            Order Summary
          </h3>

          <p style="margin:8px 0;">
            <strong>Order Number:</strong>
            ${orderNumber}
          </p>

          <p style="margin:8px 0;">
            <strong>Payment Method:</strong>
            ${paymentMethod}
          </p>

          <p style="margin:8px 0;">
            <strong>Total Amount:</strong>
            Rs. ${totalAmount.toFixed(2)}
          </p>

        </div>

        <!-- ITEMS -->
        <h3 style="
          margin-bottom:14px;
          color:#111827;
        ">
          Ordered Items
        </h3>

        <div style="
          border:1px solid #e5e7eb;
          border-radius:12px;
          overflow:hidden;
          margin-bottom:28px;
        ">
          <ul style="
            list-style:none;
            padding:0;
            margin:0;
          ">
            ${validatedItems
              .map(
                (item) => `
                  <li style="
                    padding:16px 20px;
                    border-bottom:1px solid #e5e7eb;
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    font-size:14px;
                    color:#374151;
                  ">
                    <span>
                      ${item.name} × ${item.quantity}
                    </span>

                    <strong>
                      Rs. ${item.subtotal.toFixed(2)}
                    </strong>
                  </li>
                `
              )
              .join("")}
          </ul>
        </div>

        <!-- DELIVERY INFO -->
        <div style="
          background:#fff7ed;
          border:1px solid #fdba74;
          color:#9a3412;
          padding:16px 18px;
          border-radius:12px;
          font-size:14px;
          margin-bottom:28px;
        ">
          Estimated Delivery Time: <strong>35 mins</strong>
        </div>

        <!-- BUTTON -->
        <div style="text-align:center;">

          <a
            href="#"
            style="
              display:inline-block;
              background:#f97316;
              color:white;
              text-decoration:none;
              padding:14px 26px;
              border-radius:10px;
              font-size:15px;
              font-weight:600;
            "
          >
            View Order
          </a>

        </div>

      </div>

      <!-- FOOTER -->
      <div style="
        padding:20px;
        text-align:center;
        font-size:12px;
        color:#6b7280;
        border-top:1px solid #e5e7eb;
        background:#fafafa;
      ">
        © 2026 FoodieHub. All rights reserved.
      </div>

    </div>
  </div>
`;

        import("../utils/email.js").then(({ sendMail }) =>
          sendMail({
            to: user.email,
            subject: `FoodieHub Order Confirmation (${orderNumber})`,
            html,
          }).catch((err) =>
            console.error("Order email error:", err)
          )
        );
      }
    } catch (emailError) {
      console.error(
        "Order confirmation email failed:",
        emailError
      );
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      order: formatOrder(createdOrder, validatedItems),
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Unable to place order right now.",
    });
  }
};

// =========================================
// GET MY ORDERS
// =========================================

export const getMyOrders = async (req, res) => {
  try {
    const [orders] = await query(
      `
      SELECT *
      FROM orders
      WHERE userId = ?
      ORDER BY createdAt DESC
      `,
      [req.auth.sub]
    );

    const formattedOrders = [];

    for (const order of orders) {
      const [items] = await query(
        `
  SELECT
    oi.id,
    oi.productId,

    COALESCE(p.name, 'Deleted Product') AS name,

    p.image,

    oi.quantity,
    oi.price,
    oi.subtotal

  FROM order_items oi

  LEFT JOIN products p
    ON oi.productId = p.id

  WHERE oi.orderId = ?
  `,
        [order.id]
      );


      formattedOrders.push(
        formatOrder(order, items)
      );
    }

    return res.json({
      orders: formattedOrders,
    });

  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      message: "Unable to load orders.",
    });
  }
};

// =========================================
// ADMIN - GET ALL ORDERS
// =========================================

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await query(
      `
      SELECT
        orders.*,
        users.fullName,
        users.email
      FROM orders
      JOIN users
        ON orders.userId = users.id
      ORDER BY orders.createdAt DESC
      `
    );

    const formattedOrders = [];

    for (const order of orders) {
      const [items] = await query(
        `
  SELECT
    oi.id,
    oi.productId,

    COALESCE(p.name, 'Deleted Product') AS name,

    p.image,

    oi.quantity,
    oi.price,
    oi.subtotal

  FROM order_items oi

  LEFT JOIN products p
    ON oi.productId = p.id

  WHERE oi.orderId = ?
  `,
        [order.id]
      );


      formattedOrders.push({
        ...formatOrder(order, items),

        customerName: order.fullName,
        customerEmail: order.email,

        itemsCount: items.reduce(
          (total, item) =>
            total + item.quantity,
          0
        ),
      });
    }

    return res.json({
      orders: formattedOrders,
    });

  } catch (error) {
    console.error(
      "Get all orders error:",
      error
    );

    return res.status(500).json({
      message: "Unable to load orders.",
    });
  }
};

// =========================================
// ADMIN - GET SINGLE ORDER
// =========================================

export const getSingleOrderAdmin = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const [orders] = await query(
      `
      SELECT
        orders.*,
        users.fullName,
        users.email
      FROM orders
      JOIN users
        ON orders.userId = users.id
      WHERE orders.id = ?
      LIMIT 1
      `,
      [id]
    );

    const order = orders[0];

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const [items] = await query(
      `
  SELECT
    oi.id,
    oi.productId,

    COALESCE(p.name, 'Deleted Product') AS name,

    p.image,

    oi.quantity,
    oi.price,
    oi.subtotal

  FROM order_items oi

  LEFT JOIN products p
    ON oi.productId = p.id

  WHERE oi.orderId = ?
  `,
      [order.id]
    );


    return res.json({
      order: {
        ...formatOrder(order, items),

        fullName: order.fullName,
        email: order.email,
      },
    });

  } catch (error) {
    console.error(
      "Admin get single order error:",
      error
    );

    return res.status(500).json({
      message: "Unable to load order.",
    });
  }
};

// =========================================
// ADMIN - UPDATE ORDER STATUS
// =========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    // UPDATE STATUS
    await query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    // GET ORDER + USER
    const [orders] = await query(
      `
      SELECT
        orders.orderNumber,
        users.fullName,
        users.email
      FROM orders
      JOIN users ON orders.userId = users.id
      WHERE orders.id = ?
      LIMIT 1
      `,
      [id]
    );

    const order = orders[0];

    if (!order?.email) {
      return res.json({
        success: true,
        message: "Order updated successfully.",
      });
    }

    const { sendMail } = await import("../utils/email.js");

    // =========================
    // CONFIRMED EMAIL
    // =========================
    if (status === "confirmed") {
      const html = `
<div style="background:#f3f4f6;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background:#f97316;color:#fff;padding:28px;text-align:center;">
      <h1 style="margin:0;font-size:28px;">FoodieHub</h1>
      <p style="margin-top:8px;">Order Confirmed</p>
    </div>

    <div style="padding:32px;">
      <p style="font-size:18px;">Hi ${order.fullName},</p>

      <p style="color:#4b5563;">
        Great news! Your order is confirmed and is now being prepared.
      </p>

      <div style="background:#f9fafb;border:1px solid #e5e7eb;padding:20px;border-radius:12px;margin-top:20px;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Status:</strong> Confirmed</p>
        <p><strong>Estimated Delivery:</strong> 35 mins</p>
      </div>
    </div>

    <div style="padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
      © 2026 FoodieHub
    </div>

  </div>
</div>
      `;

      await sendMail({
        to: order.email,
        subject: `Your FoodieHub Order is Confirmed (${order.orderNumber})`,
        html,
      });
    }

    // =========================
    // DELIVERED EMAIL
    // =========================
    if (status === "delivered") {
      const html = `
<div style="background:#f3f4f6;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background:#16a34a;color:#fff;padding:28px;text-align:center;">
      <h1 style="margin:0;font-size:28px;">FoodieHub</h1>
      <p style="margin-top:8px;">Order Delivered 🎉</p>
    </div>

    <div style="padding:32px;">
      <p style="font-size:18px;">Hi ${order.fullName},</p>

      <p style="color:#4b5563;">
        Your order has been successfully delivered. We hope you enjoy your meal!
      </p>

      <div style="background:#f0fdf4;border:1px solid #86efac;padding:20px;border-radius:12px;margin-top:20px;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Status:</strong> Delivered</p>
      </div>
    </div>

    <div style="padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
      © 2026 FoodieHub
    </div>

  </div>
</div>
      `;

      await sendMail({
        to: order.email,
        subject: `Your Order Has Been Delivered (${order.orderNumber})`,
        html,
      });
    }

    // =========================
    // CANCELLED EMAIL + STOCK RESTORE
    // =========================
    if (status === "cancelled") {
      const html = `
<div style="background:#f3f4f6;padding:40px 20px;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.08);">

    <div style="background:#dc2626;color:#fff;padding:28px;text-align:center;">
      <h1 style="margin:0;font-size:28px;">FoodieHub</h1>
      <p style="margin-top:8px;">Order Cancelled</p>
    </div>

    <div style="padding:32px;">
      <p style="font-size:18px;">Hi ${order.fullName},</p>

      <p style="color:#4b5563;">
        Your order has been cancelled. If this was unexpected, please contact support.
      </p>

      <div style="background:#fef2f2;border:1px solid #fecaca;padding:20px;border-radius:12px;margin-top:20px;">
        <p><strong>Order Number:</strong> ${order.orderNumber}</p>
        <p><strong>Status:</strong> Cancelled</p>
      </div>
    </div>

    <div style="padding:16px;text-align:center;font-size:12px;color:#6b7280;border-top:1px solid #e5e7eb;">
      © 2026 FoodieHub
    </div>

  </div>
</div>
      `;

      await sendMail({
        to: order.email,
        subject: `Your Order Was Cancelled (${order.orderNumber})`,
        html,
      });

      // RESTORE STOCK
      const [items] = await query(
        `SELECT productId, quantity FROM order_items WHERE orderId = ?`,
        [id]
      );

      for (const item of items) {
        await query(
          `
          UPDATE products
          SET stockQuantity = stockQuantity + ?
          WHERE id = ?
          `,
          [item.quantity, item.productId]
        );
      }
    }

    return res.json({
      success: true,
      message: "Order status updated successfully.",
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Unable to update order status.",
    });
  }
};

// =========================================
// GET SINGLE ORDER
// =========================================

export const getOrderByOrderNumber = async (
  req,
  res
) => {
  try {
    const { orderNumber } = req.params;

    const [orders] = await query(
      `
      SELECT *
      FROM orders
      WHERE orderNumber = ?
      AND userId = ?
      LIMIT 1
      `,
      [orderNumber, req.auth.sub]
    );

    const order = orders[0];

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    const [items] = await query(
      `
  SELECT
    oi.id,
    oi.productId,

    COALESCE(p.name, 'Deleted Product') AS name,

    p.image,

    oi.quantity,
    oi.price,
    oi.subtotal

  FROM order_items oi

  LEFT JOIN products p
    ON oi.productId = p.id

  WHERE oi.orderId = ?
  `,
      [order.id]
    );


    return res.json({
      order: formatOrder(order, items),
    });

  } catch (error) {
    console.error("Get order error:", error);

    return res.status(500).json({
      message: "Unable to load order.",
    });
  }
};