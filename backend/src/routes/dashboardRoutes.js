import express from "express";

import {
  getDashboardStats,
} from "../controllers/dashboardController.js";

import {
  requireAuth,
  adminOnly,
} from "../middlewares/authMiddleware.js";

const router = express.Router();


// ADMIN DASHBOARD
router.get(
  "/stats",
  requireAuth,
  adminOnly,
  getDashboardStats
);

export default router;