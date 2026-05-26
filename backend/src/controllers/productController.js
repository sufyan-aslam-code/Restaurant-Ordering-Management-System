import pool from "../config/db.js";

// SAFE JSON PARSER
const safeJSONParse = (value) => {
  try {
    // Already parsed array/object
    if (Array.isArray(value) || typeof value === "object") {
      return value;
    }
    // Empty/null fallback
    if (!value) {
      return [];
    }
    return JSON.parse(value);
  } catch (error) {
    return [];
  }
};

// =========================================
// GET ALL PRODUCTS
// =========================================

export const getProducts = async (req, res) => {
  try {
    // =========================================
    // QUERY PARAMS
    // =========================================
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "latest";

    // =========================================
    // BASE QUERY
    // =========================================
    let query = `
      SELECT
        products.*,
        categories.name AS categoryName
      FROM products
      LEFT JOIN categories
      ON products.categoryId = categories.id
      WHERE 1=1
    `;

    let countQuery = `
      SELECT COUNT(*) as total
      FROM products
      LEFT JOIN categories
      ON products.categoryId = categories.id
      WHERE 1=1
    `;

    const values = [];

    // =========================================
    // SEARCH
    // =========================================
    if (search) {
      query += `
        AND (
          products.name LIKE ?
          OR products.cuisine LIKE ?
        )
      `;
      countQuery += `
        AND (
          products.name LIKE ?
          OR products.cuisine LIKE ?
        )
      `;
      values.push(`%${search}%`, `%${search}%`);
    }

    // =========================================
    // CATEGORY FILTER
    // =========================================
    if (category) {
      query += ` AND categories.name = ? `;
      countQuery += ` AND categories.name = ? `;
      values.push(category);
    }

    // =========================================
    // SORTING
    // =========================================
    if (sort === "price_asc") {
      query += ` ORDER BY products.price ASC `;
    } else if (sort === "price_desc") {
      query += ` ORDER BY products.price DESC `;
    } else if (sort === "rating") {
      query += ` ORDER BY products.rating DESC `;
    } else {
      query += ` ORDER BY products.createdAt DESC `;
    }

    // =========================================
    // PAGINATION
    // =========================================
    query += ` LIMIT ? OFFSET ? `;
    const finalValues = [...values, limit, offset];

    // =========================================
    // GET PRODUCTS
    // =========================================
    const [products] = await pool.query(
      query,
      finalValues
    );

    // =========================================
    // GET TOTAL COUNT
    // =========================================
    const [totalResult] = await pool.query(
      countQuery,
      values
    );

    const totalProducts = totalResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    // =========================================
    // FORMAT PRODUCTS
    // =========================================
    const formattedProducts = products.map(product => ({
      ...product,
      ingredients: safeJSONParse(product.ingredients),
      instructions: safeJSONParse(product.instructions),
      tags: safeJSONParse(product.tags),
      mealType: safeJSONParse(product.mealType)
    }));

    // =========================================
    // RESPONSE
    // =========================================
    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts,
      count: formattedProducts.length,
      products: formattedProducts
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

// =========================================
// GET SINGLE PRODUCT
// =========================================

export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const [products] = await pool.query(
      `
      SELECT
        products.*,
        categories.name AS categoryName
      FROM products
      LEFT JOIN categories
      ON products.categoryId = categories.id
      WHERE products.id = ?
      `,
      [id]
    );

    if (products.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const product = {
      ...products[0],
      ingredients: safeJSONParse(products[0].ingredients),
      instructions: safeJSONParse(products[0].instructions),
      tags: safeJSONParse(products[0].tags),
      mealType: safeJSONParse(products[0].mealType)
    };

    res.status(200).json({
      success: true,
      product
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product"
    });
  }
};

// =========================================
// CREATE PRODUCT
// =========================================

export const createProduct = async (req, res) => {
  try {
    const {
      categoryId,
      name,
      slug,
      description,
      cuisine,
      calories,
      ingredients,
      tags,
      mealType,
      price,
      discountPrice,
      stockQuantity,
      rating,
    } = req.body;

    // =========================================
    // NEW CLOUDINARY IMAGE PATH LOGIC
    // =========================================
    const image = req.file
      ? req.file.path // <-- Grabs the full Cloudinary URL
      : "";

    // ARRAY FORMAT
    const ingredientsArray =
      ingredients
        ? ingredients
            .split(",")
            .map((item) => item.trim())
        : [];

    const tagsArray =
      tags
        ? tags
            .split(",")
            .map((item) => item.trim())
        : [];

    const mealTypeArray =
      mealType
        ? mealType
            .split(",")
            .map((item) => item.trim())
        : [];

    const [result] = await pool.query(
      `
      INSERT INTO products (
        categoryId,
        name,
        slug,
        description,
        image,
        cuisine,
        calories,
        ingredients,
        tags,
        mealType,
        price,
        discountPrice,
        stockQuantity,
        rating
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        categoryId,
        name,
        slug,
        description,
        image,
        cuisine,
        calories,
        JSON.stringify(ingredientsArray),
        JSON.stringify(tagsArray),
        JSON.stringify(mealTypeArray),
        price,
        discountPrice || null,
        stockQuantity || 0,
        rating || 0,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      productId: result.insertId,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
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
      categoryId,
      name,
      slug,
      description,
      cuisine,
      calories,
      ingredients,
      tags,
      mealType,
      price,
      discountPrice,
      stockQuantity,
      rating,
    } = req.body;

    // GET OLD PRODUCT
    const [existingProducts] =
      await pool.query(
        `
        SELECT image
        FROM products
        WHERE id = ?
        `,
        [id]
      );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // =========================================
    // NEW CLOUDINARY IMAGE PATH LOGIC
    // =========================================
    // KEEP OLD IMAGE IF NEW NOT UPLOADED
    const image = req.file
      ? req.file.path // <-- Grabs the full Cloudinary URL
      : existingProducts[0].image;

    // ARRAY FORMAT
    const ingredientsArray =
      ingredients
        ? ingredients
            .split(",")
            .map((item) => item.trim())
        : [];

    const tagsArray =
      tags
        ? tags
            .split(",")
            .map((item) => item.trim())
        : [];

    const mealTypeArray =
      mealType
        ? mealType
            .split(",")
            .map((item) => item.trim())
        : [];

    await pool.query(
      `
      UPDATE products
      SET
        categoryId = ?,
        name = ?,
        slug = ?,
        description = ?,
        image = ?,
        cuisine = ?,
        calories = ?,
        ingredients = ?,
        tags = ?,
        mealType = ?,
        price = ?,
        discountPrice = ?,
        stockQuantity = ?,
        rating = ?
      WHERE id = ?
      `,
      [
        categoryId,
        name,
        slug,
        description,
        image,
        cuisine,
        calories,
        JSON.stringify(ingredientsArray),
        JSON.stringify(tagsArray),
        JSON.stringify(mealTypeArray),
        price,
        discountPrice || null,
        stockQuantity || 0,
        rating || 0,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// =========================================
// DELETE PRODUCT
// =========================================

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM products
      WHERE id = ?
      `,
      [id]
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// =========================================
// UPDATE STOCK
// =========================================

export const updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    await pool.query(
      `
      UPDATE products
      SET stockQuantity = ?
      WHERE id = ?
      `,
      [stockQuantity, id]
    );

    res.status(200).json({
      success: true,
      message: "Stock updated successfully",
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update stock",
    });
  }
};