import { Router } from "express";

import {
  requireAuth,
  adminOnly, // Updated from requireAdmin
} from "../middlewares/authMiddleware.js";

import {
  createOrder,
  getMyOrders,
  getOrderByOrderNumber,
  getAllOrders,
  getSingleOrderAdmin,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = Router();

// =========================================
// USER PROTECTED ROUTES
// =========================================

router.use(requireAuth);

// Create Order
router.post("/", createOrder);

// Get Logged-in User Orders
router.get("/", getMyOrders);

// Get Single Order by Order Number
router.get(
  "/track/:orderNumber",
  getOrderByOrderNumber
);

// =========================================
// ADMIN ROUTES
// =========================================

// Get All Orders
router.get(
  "/admin/all",
  adminOnly, // Updated from requireAdmin
  getAllOrders
);

// Get Single Order
router.get(
  "/admin/:id",
  adminOnly, // Updated from requireAdmin
  getSingleOrderAdmin
);

// Update Order Status
router.patch(
  "/admin/:id/status",
  adminOnly, // Updated from requireAdmin
  updateOrderStatus
);

export default router;