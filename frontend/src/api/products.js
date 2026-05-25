import apiClient from "./client";


// =========================================
// GET ALL PRODUCTS
// =========================================

export const getAllProducts = (params = {}) =>
  apiClient.get("/products", {
    params,
  });


// =========================================
// GET SINGLE PRODUCT
// =========================================

export const getSingleProduct = (id) =>
  apiClient.get(`/products/${id}`);


// =========================================
// CREATE PRODUCT
// =========================================

export const createProduct = (data) =>
  apiClient.post("/products", data);


// =========================================
// UPDATE PRODUCT
// =========================================

export const updateProduct = (
  id,
  data
) =>
  apiClient.put(
    `/products/${id}`,
    data
  );


// =========================================
// DELETE PRODUCT
// =========================================

export const deleteProduct = (id) =>
  apiClient.delete(`/products/${id}`);


// =========================================
// UPDATE STOCK
// =========================================

export const updateStock = (
  id,
  stockQuantity
) =>
  apiClient.patch(
    `/products/${id}/stock`,
    {
      stockQuantity,
    }
  );