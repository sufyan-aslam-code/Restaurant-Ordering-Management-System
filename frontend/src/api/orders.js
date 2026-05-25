import apiClient from "./client";

// =========================================
// USER ROUTES
// =========================================

// Create a new order (Fixes the Checkout.jsx error)
export const createOrder = (orderData) =>
  apiClient.post("/orders", orderData);

// Get logged-in user's orders
export const getMyOrders = () =>
  apiClient.get("/orders");

// Track a single order by its order number
export const getOrderByOrderNumber = (orderNumber) =>
  apiClient.get(`/orders/track/${orderNumber}`);

// =========================================
// ADMIN ROUTES
// =========================================

// Get all orders
export const getAllOrders = () =>
  apiClient.get("/orders/admin/all");

// Get single order
export const getSingleOrder = (id) =>
  apiClient.get(`/orders/admin/${id}`);

// Update order status
export const updateOrderStatus = (id, status) =>
  apiClient.patch(`/orders/admin/${id}/status`, { status });