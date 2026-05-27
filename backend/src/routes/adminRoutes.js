import express from "express";

import {
  requireAuth,
  adminOnly,
} from "../middlewares/authMiddleware.js";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllOrders,
  updateOrderStatus,
  createCategory,
  deleteCategory,
  getAllUsers, // <-- NEW IMPORT
  updateUserRole // <-- NEW IMPORT
} from "../controllers/adminController.js";

import { getSingleOrderAdmin } from "../controllers/orderController.js";

const router = express.Router();


// =========================================
// ALL ADMIN ROUTES ARE PROTECTED
// =========================================

router.use(requireAuth);
router.use(adminOnly);


// =========================================
// PRODUCT MANAGEMENT
// =========================================

// Create Product
router.post("/products", createProduct);

// Update Product
router.put("/products/:id", updateProduct);

// Delete Product
router.delete("/products/:id", deleteProduct);


// =========================================
// ORDER MANAGEMENT
// =========================================

// Get All Orders
router.get("/orders", getAllOrders);

router.get("/orders/:id", getSingleOrderAdmin); 

// Update Order Status
router.put("/orders/:id/status", updateOrderStatus);


// =========================================
// CATEGORY MANAGEMENT
// =========================================

// Create Category
router.post("/categories", createCategory);

// Delete Category
router.delete("/categories/:id", deleteCategory);


// =========================================
// USER MANAGEMENT
// =========================================

// Get All Users
router.get("/users", getAllUsers);

// Update User Role
router.put("/users/:id/role", updateUserRole);


export default router;