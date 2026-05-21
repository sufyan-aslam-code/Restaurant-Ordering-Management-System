import { Router } from "express";

import { requireAuth } from "../middleware/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getOrderByTrackingId,
} from "../controllers/orderController.js";

const router = Router();

router.use(requireAuth);

router.post("/", createOrder);
router.get("/", getMyOrders);
router.get("/tracking/:trackingId", getOrderByTrackingId);

export default router;