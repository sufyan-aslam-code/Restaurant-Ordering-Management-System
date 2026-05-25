import axios from "axios";
import pool from "../config/db.js";

// ==========================================
// CREATE SLUG
// ==========================================
const generateSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
};

// ==========================================
// RANDOM PRICE
// ==========================================
const generatePrice = () => {
  return Math.floor(Math.random() * 2000) + 500;
};

// ==========================================
// SMART CATEGORY MAPPER
// ==========================================
const mapCategory = async (recipe) => {
  // Default fallback if nothing matches
  let categoryName = "Main Course";

  const cuisine = recipe.cuisine?.toLowerCase() || "";
  const tags = recipe.tags?.map((t) => t.toLowerCase()) || [];
  const mealType = recipe.mealType?.map((m) => m.toLowerCase()) || [];

  // 1. Drinks
  if (mealType.includes("beverage")) {
    categoryName = "Drinks";
  }
  // 2. Desi (Pakistani/Indian)
  else if (
    cuisine === "pakistani" ||
    cuisine === "indian" ||
    tags.includes("biryani") ||
    tags.includes("karahi")
  ) {
    categoryName = "Desi";
  }
  // 3. Asian Cuisine
  else if (
    cuisine === "asian" ||
    cuisine === "thai" ||
    cuisine === "korean" ||
    cuisine === "vietnamese" ||
    cuisine === "chinese" ||
    cuisine === "japanese"
  ) {
    categoryName = "Asian Cuisine";
  }
  // 4. Italian & Pizza
  else if (
    cuisine === "italian" ||
    tags.includes("pizza") ||
    tags.includes("pasta")
  ) {
    categoryName = "Italian";
  }
  // 5. Mexican & Grill
  else if (cuisine === "mexican" || cuisine === "brazilian") {
    categoryName = "Mexican";
  }
  // 6. Healthy & Vegan
  else if (
    tags.includes("vegan") ||
    tags.includes("vegetarian") ||
    tags.includes("salad")
  ) {
    categoryName = "Healthy";
  }
  // 7. Fast Food / Burgers
  else if (
    tags.includes("burger") ||
    tags.includes("fries") ||
    tags.includes("fast food")
  ) {
    categoryName = "Fast Food";
  }
  // 8. Desserts
  else if (tags.includes("dessert") || mealType.includes("dessert")) {
    categoryName = "Desserts";
  }

  // GET CATEGORY ID FROM DATABASE
  const [rows] = await pool.query("SELECT id FROM categories WHERE name = ?", [
    categoryName,
  ]);

  if (!rows[0]) {
    console.warn(`Warning: Category '${categoryName}' not found in DB!`);
  }

  return rows[0]?.id || null;
};

// ==========================================
// SEED PRODUCTS
// ==========================================
const seedProducts = async () => {
  try {
    console.log("Fetching DummyJSON Recipes...");

    const response = await axios.get("https://dummyjson.com/recipes?limit=100");
    const recipes = response.data.recipes;

    console.log(`Found ${recipes.length} recipes`);

    for (const recipe of recipes) {
      const slug = generateSlug(recipe.name);

      // CHECK IF PRODUCT ALREADY EXISTS
      const [existing] = await pool.query(
        "SELECT id FROM products WHERE slug = ?",
        [slug]
      );

      if (existing.length > 0) {
        console.log(`Skipping existing product: ${recipe.name}`);
        continue;
      }

      const price = generatePrice();
      const categoryId = await mapCategory(recipe);

      const description = `${recipe.name} is a delicious ${
        recipe.cuisine
      } dish perfect for ${recipe.mealType?.join(", ") || "any time"}.`;

      await pool.query(
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
          rating,
          reviewCount
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          categoryId,
          recipe.name,
          slug,
          description,
          recipe.image,
          recipe.cuisine,
          recipe.caloriesPerServing,
          JSON.stringify(recipe.ingredients),
          JSON.stringify(recipe.tags),
          JSON.stringify(recipe.mealType),
          price,
          price > 200 ? price - 200 : price, // Safety check to prevent negative discounts
          Math.floor(Math.random() * 40) + 10,
          recipe.rating,
          recipe.reviewCount,
        ]
      );

      console.log(`Inserted: ${recipe.name}`);
    }

    console.log("\n✅ Products Seeded Successfully");
    process.exit();
  } catch (error) {
    console.error("❌ Error Seeding Products:", error);
    process.exit(1);
  }
};

seedProducts();