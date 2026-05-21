import { query } from "../config/db.js";
import { sendMail } from "../utils/email.js";

export const subscribe = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ message: "A valid email is required." });
    }

    // insert if not exists
    try {
      await query("INSERT INTO subscribers (email) VALUES (?)", [email.trim().toLowerCase()]);
    } catch (err) {
      if (err && err.code === "ER_DUP_ENTRY") {
        // already subscribed
      } else {
        console.error("Subscribe DB error:", err);
        return res.status(500).json({ message: "Unable to save subscription." });
      }
    }

    // send welcome email (non-blocking)
    const html = `
      <div style="font-family: Arial, sans-serif; color: #111827">
        <h2>Thanks for subscribing!</h2>
        <p>You are now subscribed to FoodieHub updates and exclusive offers.</p>
      </div>
    `;

    sendMail({ to: email, subject: "Welcome to FoodieHub Newsletter", html }).catch((e) =>
      console.error("Newsletter welcome email error:", e)
    );

    return res.json({ message: "Subscription successful." });
  } catch (error) {
    console.error("Subscribe error:", error);
    return res.status(500).json({ message: "Unable to subscribe right now." });
  }
};
