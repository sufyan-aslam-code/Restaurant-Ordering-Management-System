import apiClient from "./client";

export const createOrder = (payload) =>
  apiClient.post("/orders", payload);

export const getMyOrders = () =>
  apiClient.get("/orders");

export const getOrderByTrackingId = (trackingId) =>
  apiClient.get(`/orders/tracking/${encodeURIComponent(trackingId)}`);
