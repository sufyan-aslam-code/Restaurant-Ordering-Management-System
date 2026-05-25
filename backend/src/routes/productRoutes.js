import express from "express";

import {
  getProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
} from "../controllers/productController.js";

import {
  requireAuth,
  adminOnly,
} from "../middlewares/authMiddleware.js";

import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


// PUBLIC ROUTES
router.get("/", getProducts);

router.get("/:id", getSingleProduct);


// ADMIN ROUTES
router.post(
  "/",
  requireAuth,
  adminOnly,
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  requireAuth,
  adminOnly,
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  requireAuth,
  adminOnly,
  deleteProduct
);

router.patch(
  "/:id/stock",
  requireAuth,
  adminOnly,
  updateStock
);

export default router;