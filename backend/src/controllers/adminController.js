import { query } from "../config/db.js";


// =========================================
// CREATE PRODUCT
// =========================================

export const createProduct = async (req, res) => {
  try {
    const {
      category_id,
      name,
      slug,
      description,
      image,
      cuisine,
      difficulty,
      prep_time,
      cook_time,
      servings,
      calories,
      ingredients,
      instructions,
      tags,
      meal_type,
      price,
      discount_price,
      stock_quantity,
      is_available,
      is_featured,
    } = req.body;

    if (!name || !slug || !price) {
      return res.status(400).json({
        message: "Name, slug, and price are required.",
      });
    }

    const [existingProducts] = await query(
      "SELECT id FROM products WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (existingProducts.length > 0) {
      return res.status(409).json({
        message: "Product slug already exists.",
      });
    }

    const [result] = await query(
      `
      INSERT INTO products (
        category_id,
        name,
        slug,
        description,
        image,
        cuisine,
        difficulty,
        prep_time,
        cook_time,
        servings,
        calories,
        ingredients,
        instructions,
        tags,
        meal_type,
        price,
        discount_price,
        stock_quantity,
        is_available,
        is_featured
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        category_id || null,
        name,
        slug,
        description || null,
        image || null,
        cuisine || null,
        difficulty || null,
        prep_time || 0,
        cook_time || 0,
        servings || 0,
        calories || 0,
        JSON.stringify(ingredients || []),
        JSON.stringify(instructions || []),
        JSON.stringify(tags || []),
        JSON.stringify(meal_type || []),
        price,
        discount_price || null,
        stock_quantity || 0,
        is_available ?? true,
        is_featured ?? false,
      ]
    );

    return res.status(201).json({
      message: "Product created successfully.",
      productId: result.insertId,
    });
  } catch (error) {
    console.error("Create product error:", error);

    return res.status(500).json({
      message: "Unable to create product.",
    });
  }
};


// =========================================
// UPDATE PRODUCT
// =========================================

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      category_id,
      name,
      slug,
      description,
      image,
      cuisine,
      difficulty,
      prep_time,
      cook_time,
      servings,
      calories,
      ingredients,
      instructions,
      tags,
      meal_type,
      price,
      discount_price,
      stock_quantity,
      is_available,
      is_featured,
    } = req.body;

    const [products] = await query(
      "SELECT * FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await query(
      `
      UPDATE products
      SET
        category_id = ?,
        name = ?,
        slug = ?,
        description = ?,
        image = ?,
        cuisine = ?,
        difficulty = ?,
        prep_time = ?,
        cook_time = ?,
        servings = ?,
        calories = ?,
        ingredients = ?,
        instructions = ?,
        tags = ?,
        meal_type = ?,
        price = ?,
        discount_price = ?,
        stock_quantity = ?,
        is_available = ?,
        is_featured = ?
      WHERE id = ?
      `,
      [
        category_id || null,
        name,
        slug,
        description || null,
        image || null,
        cuisine || null,
        difficulty || null,
        prep_time || 0,
        cook_time || 0,
        servings || 0,
        calories || 0,
        JSON.stringify(ingredients || []),
        JSON.stringify(instructions || []),
        JSON.stringify(tags || []),
        JSON.stringify(meal_type || []),
        price,
        discount_price || null,
        stock_quantity || 0,
        is_available ?? true,
        is_featured ?? false,
        id,
      ]
    );

    return res.json({
      message: "Product updated successfully.",
    });
  } catch (error) {
    console.error("Update product error:", error);

    return res.status(500).json({
      message: "Unable to update product.",
    });
  }
};


// =========================================
// DELETE PRODUCT
// =========================================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await query(
      "SELECT id FROM products WHERE id = ? LIMIT 1",
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        message: "Product not found.",
      });
    }

    await query(
      "DELETE FROM products WHERE id = ?",
      [id]
    );

    return res.json({
      message: "Product deleted successfully.",
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return res.status(500).json({
      message: "Unable to delete product.",
    });
  }
};


// =========================================
// GET ALL ORDERS
// =========================================

export const getAllOrders = async (req, res) => {
  try {
    const [orders] = await query(
      `
      SELECT
        o.*,
        u.fullName,
        u.email
      FROM orders o
      JOIN users u
      ON o.userId = u.id
      ORDER BY o.createdAt DESC
      `
    );

    return res.json({
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      message: "Unable to load orders.",
    });
  }
};


// =========================================
// UPDATE ORDER STATUS
// =========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const [orders] = await query(
      "SELECT id FROM orders WHERE id = ? LIMIT 1",
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    await query(
      `
      UPDATE orders
      SET status = ?
      WHERE id = ?
      `,
      [status, id]
    );

    return res.json({
      message: "Order status updated successfully.",
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Unable to update order status.",
    });
  }
};


// =========================================
// CREATE CATEGORY
// =========================================

export const createCategory = async (req, res) => {
  try {
    const { name, slug, image } = req.body;

    if (!name || !slug) {
      return res.status(400).json({
        message: "Name and slug are required.",
      });
    }

    const [existingCategories] = await query(
      "SELECT id FROM categories WHERE slug = ? LIMIT 1",
      [slug]
    );

    if (existingCategories.length > 0) {
      return res.status(409).json({
        message: "Category slug already exists.",
      });
    }

    const [result] = await query(
      `
      INSERT INTO categories (
        name,
        slug,
        image
      )
      VALUES (?, ?, ?)
      `,
      [
        name,
        slug,
        image || null,
      ]
    );

    return res.status(201).json({
      message: "Category created successfully.",
      categoryId: result.insertId,
    });
  } catch (error) {
    console.error("Create category error:", error);

    return res.status(500).json({
      message: "Unable to create category.",
    });
  }
};


// =========================================
// DELETE CATEGORY
// =========================================

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const [categories] = await query(
      "SELECT id FROM categories WHERE id = ? LIMIT 1",
      [id]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        message: "Category not found.",
      });
    }

    await query(
      "DELETE FROM categories WHERE id = ?",
      [id]
    );

    return res.json({
      message: "Category deleted successfully.",
    });
  } catch (error) {
    console.error("Delete category error:", error);

    return res.status(500).json({
      message: "Unable to delete category.",
    });
  }
};


// =========================================
// GET ALL USERS
// =========================================

export const getAllUsers = async (req, res) => {
  try {
    const [users] = await query(
      `
      SELECT 
        id, 
        fullName, 
        email, 
        role, 
        createdAt 
      FROM users 
      ORDER BY createdAt DESC
      `
    );

    // Returning the array directly to match the React frontend logic
    return res.json(users);
  } catch (error) {
    console.error("Get all users error:", error);

    return res.status(500).json({
      message: "Unable to load users.",
    });
  }
};


// =========================================
// UPDATE USER ROLE
// =========================================

export const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const allowedRoles = ["user", "admin"];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified.",
      });
    }

    const [users] = await query(
      "SELECT id FROM users WHERE id = ? LIMIT 1",
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    await query(
      `
      UPDATE users 
      SET role = ? 
      WHERE id = ?
      `,
      [role, id]
    );

    return res.json({
      message: "User role updated successfully.",
    });
  } catch (error) {
    console.error("Update user role error:", error);

    return res.status(500).json({
      message: "Unable to update user role.",
    });
  }
};