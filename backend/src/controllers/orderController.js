import { query } from "../config/db.js";

const mapOrder = (order) => ({
  id: order.id,
  trackingId: order.trackingId,
  items:
    typeof order.items === "string"
      ? JSON.parse(order.items)
      : order.items,
  totalAmount: Number(order.totalAmount),
  paymentStatus: order.paymentStatus,
  status: order.status,
  deliveryAddress: order.deliveryAddress,
  city: order.city,
  estimatedDeliveryMinutes: order.estimatedDeliveryMinutes,
  createdAt: order.createdAt,
  updatedAt: order.updatedAt,
});

const randomDigits = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const generateTrackingId = () =>
  `FH${Date.now().toString().slice(-6)}${randomDigits()}`;

const resolveTrackingId = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const candidate = generateTrackingId();
    const [rows] = await query(
      "SELECT id FROM orders WHERE trackingId = ? LIMIT 1",
      [candidate]
    );

    if (!rows.length) {
      return candidate;
    }
  }

  return `${generateTrackingId()}${randomDigits()}`;
};

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      totalAmount,
      paymentStatus = "paid",
      deliveryAddress,
      city,
    } = req.body;

    if (!Array.isArray(items) || !items.length) {
      return res.status(400).json({ message: "Order items are required." });
    }

    if (!deliveryAddress || !city) {
      return res.status(400).json({
        message: "Delivery address and city are required.",
      });
    }

    const safeTotalAmount = Number(totalAmount);

    if (!Number.isFinite(safeTotalAmount) || safeTotalAmount <= 0) {
      return res.status(400).json({ message: "Total amount is invalid." });
    }

    const trackingId = await resolveTrackingId();

    const [result] = await query(
      `
        INSERT INTO orders (
          userId,
          trackingId,
          items,
          totalAmount,
          paymentStatus,
          status,
          deliveryAddress,
          city,
          estimatedDeliveryMinutes
        ) VALUES (?, ?, ?, ?, ?, 'placed', ?, ?, 35)
      `,
      [
        req.auth.sub,
        trackingId,
        JSON.stringify(items),
        safeTotalAmount,
        paymentStatus,
        deliveryAddress.trim(),
        city.trim(),
      ]
    );

    const [rows] = await query(
      "SELECT * FROM orders WHERE id = ? LIMIT 1",
      [result.insertId]
    );

    const createdOrder = mapOrder(rows[0]);

    // Send order confirmation email to the user (non-blocking)
    try {
      const userRows = await query("SELECT fullName, email FROM users WHERE id = ? LIMIT 1", [req.auth.sub]);
      const user = userRows[0];

      if (user && user.email) {
        const itemsHtml = createdOrder.items
          .map(
            (it) => `<li style="margin-bottom:6px;">${it.name} x ${it.quantity} — Rs. ${(
              it.price * it.quantity
            ).toFixed(2)}</li>`
          )
          .join("");

        const orderHtml = `
          <div style="font-family: Arial, sans-serif; color: #111827; line-height:1.6">
            <h2>Order Confirmation</h2>
            <p>Hi ${user.fullName || "Customer"},</p>
            <p>Thanks for your order. Here are the details:</p>
            <ul style="margin:12px 0 18px; padding-left:18px;">${itemsHtml}</ul>
            <p><strong>Tracking ID:</strong> ${createdOrder.trackingId}</p>
            <p><strong>Total:</strong> Rs. ${createdOrder.totalAmount.toFixed(2)}</p>
            <p>We will notify you when your order is out for delivery.</p>
          </div>
        `;

        // fire-and-forget
        import("../utils/email.js").then(({ sendMail }) =>
          sendMail({
            to: user.email,
            subject: `FoodieHub - Order Confirmation (${createdOrder.trackingId})`,
            html: orderHtml,
          }).catch((e) => console.error("Order email error:", e))
        );
      }
    } catch (e) {
      console.error("Order confirmation email flow error:", e);
    }

    return res.status(201).json({
      message: "Order placed successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);
    return res.status(500).json({
      message: "Unable to place order right now.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const [rows] = await query(
      `
        SELECT *
        FROM orders
        WHERE userId = ?
        ORDER BY createdAt DESC
      `,
      [req.auth.sub]
    );

    return res.json({ orders: rows.map(mapOrder) });
  } catch (error) {
    console.error("Get my orders error:", error);
    return res.status(500).json({
      message: "Unable to load your orders.",
    });
  }
};

export const getOrderByTrackingId = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const [rows] = await query(
      `
        SELECT *
        FROM orders
        WHERE userId = ? AND trackingId = ?
        LIMIT 1
      `,
      [req.auth.sub, trackingId]
    );

    const order = rows[0];

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    return res.json({ order: mapOrder(order) });
  } catch (error) {
    console.error("Get order by tracking id error:", error);
    return res.status(500).json({
      message: "Unable to load order details.",
    });
  }
};