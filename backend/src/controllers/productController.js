import pool from "../config/db.js";
import { v2 as cloudinary } from "cloudinary";

// =========================================
// CLOUDINARY CONFIGURATION
// =========================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// =========================================
// HELPER: EXTRACT PUBLIC ID FROM URL
// =========================================
const extractPublicId = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;

  try {
    const parts = url.split("/upload/");
    const pathAfterUpload = parts[1];

    let pathParts = pathAfterUpload.split("/");

    if (/^v\d+$/.test(pathParts[0])) {
      pathParts.shift();
    }

    const publicIdWithExt = pathParts.join("/");

    return publicIdWithExt.replace(/\.[^/.]+$/, "");
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

// SAFE JSON PARSER
const safeJSONParse = (value) => {
  try {
    if (Array.isArray(value) || typeof value === "object") {
      return value;
    }
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
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || "";
    const category = req.query.category || "";
    const sort = req.query.sort || "latest";

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

    if (category) {
      query += ` AND categories.name = ? `;
      countQuery += ` AND categories.name = ? `;
      values.push(category);
    }

    if (sort === "price_asc") {
      query += ` ORDER BY products.price ASC `;
    } else if (sort === "price_desc") {
      query += ` ORDER BY products.price DESC `;
    } else if (sort === "rating") {
      query += ` ORDER BY products.rating DESC `;
    } else {
      query += ` ORDER BY products.createdAt DESC `;
    }

    query += ` LIMIT ? OFFSET ? `;
    const finalValues = [...values, limit, offset];

    const [products] = await pool.query(query, finalValues);
    const [totalResult] = await pool.query(countQuery, values);

    const totalProducts = totalResult[0].total;
    const totalPages = Math.ceil(totalProducts / limit);

    const formattedProducts = products.map((product) => ({
      ...product,
      ingredients: safeJSONParse(product.ingredients),
      instructions: safeJSONParse(product.instructions),
      tags: safeJSONParse(product.tags),
      mealType: safeJSONParse(product.mealType),
    }));

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts,
      count: formattedProducts.length,
      products: formattedProducts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
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
        message: "Product not found",
      });
    }

    const product = {
      ...products[0],
      ingredients: safeJSONParse(products[0].ingredients),
      instructions: safeJSONParse(products[0].instructions),
      tags: safeJSONParse(products[0].tags),
      mealType: safeJSONParse(products[0].mealType),
    };

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
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

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const image = req.file.path;

    const ingredientsArray = ingredients ? ingredients.split(",").map((item) => item.trim()) : [];
    const tagsArray = tags ? tags.split(",").map((item) => item.trim()) : [];
    const mealTypeArray = mealType ? mealType.split(",").map((item) => item.trim()) : [];

    const [result] = await pool.query(
      `
      INSERT INTO products (
        categoryId, name, slug, description, image, cuisine, calories,
        ingredients, tags, mealType, price, discountPrice, stockQuantity, rating
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        Number(categoryId),
        name,
        slug,
        description,
        image,
        cuisine,
        Number(calories),
        JSON.stringify(ingredientsArray),
        JSON.stringify(tagsArray),
        JSON.stringify(mealTypeArray),
        Number(price),
        discountPrice ? Number(discountPrice) : null,
        Number(stockQuantity || 0),
        Number(rating || 0),
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

    const [existingProducts] = await pool.query(
      `SELECT image FROM products WHERE id = ?`,
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    let image = existingProducts[0].image;

    // If a new image is uploaded, handle the replacement logic
    if (req.file) {
      image = req.file.path; // Set new Cloudinary URL

      // Delete the old image from Cloudinary
      const oldImageUrl = existingProducts[0].image;
      if (oldImageUrl) {
        const publicId = extractPublicId(oldImageUrl);
        if (publicId) {
          try {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted old image from Cloudinary: ${publicId}`);
          } catch (cloudinaryError) {
            console.error("Failed to delete old image from Cloudinary:", cloudinaryError);
          }
        }
      }
    }

    const ingredientsArray = ingredients ? ingredients.split(",").map((item) => item.trim()) : [];
    const tagsArray = tags ? tags.split(",").map((item) => item.trim()) : [];
    const mealTypeArray = mealType ? mealType.split(",").map((item) => item.trim()) : [];

    await pool.query(
      `
      UPDATE products
      SET
        categoryId = ?, name = ?, slug = ?, description = ?, image = ?,
        cuisine = ?, calories = ?, ingredients = ?, tags = ?, mealType = ?,
        price = ?, discountPrice = ?, stockQuantity = ?, rating = ?
      WHERE id = ?
      `,
      [
        Number(categoryId),
        name,
        slug,
        description,
        image,
        cuisine,
        Number(calories),
        JSON.stringify(ingredientsArray),
        JSON.stringify(tagsArray),
        JSON.stringify(mealTypeArray),
        Number(price),
        discountPrice ? Number(discountPrice) : null,
        Number(stockQuantity || 0),
        Number(rating || 0),
        Number(id),
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

    // 1. Get the image URL before deleting the product
    const [existingProducts] = await pool.query(
      `SELECT image FROM products WHERE id = ?`,
      [id]
    );

    if (existingProducts.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // 2. Delete the record from the database
    await pool.query(`DELETE FROM products WHERE id = ?`, [id]);

    // 3. Delete the image from Cloudinary
    const imageUrl = existingProducts[0].image;
    if (imageUrl) {
      const publicId = extractPublicId(imageUrl);
      if (publicId) {
        try {
          await cloudinary.uploader.destroy(publicId);
          console.log(`Deleted image from Cloudinary: ${publicId}`);
        } catch (cloudinaryError) {
          console.error("Failed to delete image from Cloudinary:", cloudinaryError);
        }
      }
    }

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
      `UPDATE products SET stockQuantity = ? WHERE id = ?`,
      [Number(stockQuantity), Number(id)]
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