import OpenAI from "openai";
import { query } from "../config/db.js";

const client = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: "https://api.x.ai/v1",
});

export const generateAIResponse = async (userMessage, history = []) => {
  try {
    // 1. Fetch products that are in stock using your exact schema columns
    const [products] = await query(`
      SELECT 
        name, 
        description, 
        price, 
        discountPrice, 
        cuisine, 
        calories, 
        ingredients, 
        tags, 
        stockQuantity 
      FROM products 
      WHERE stockQuantity > 0
    `);

    // 2. Format the menu so the AI understands all the rich details
    const formattedMenu = products
      .map((p) => {
        // Handle JSON arrays safely (mysql2 usually parses them automatically)
        const safeTags = Array.isArray(p.tags) ? p.tags.join(", ") : p.tags || "None";
        const safeIngredients = Array.isArray(p.ingredients) ? p.ingredients.join(", ") : p.ingredients || "Not specified";
        
        // Determine the active price
        const currentPrice = p.discountPrice && p.discountPrice < p.price 
          ? `Rs. ${p.discountPrice} (Discounted from Rs. ${p.price})` 
          : `Rs. ${p.price}`;

        return `
Item: ${p.name}
Price: ${currentPrice}
Description: ${p.description || "No description"}
Cuisine: ${p.cuisine || "General"}
Calories: ${p.calories || "Unknown"} kcal
Tags: ${safeTags}
Ingredients: ${safeIngredients}
---`;
      })
      .join("\n");

    // 3. Define the strict System Prompt
    // 3. Define the strict System Prompt
    const systemPrompt = `
You are the official FoodieHub AI assistant. You are polite, helpful, and concise.

CURRENT MENU (ONLY items listed here are available):
${formattedMenu}

STRICT RULES:
1. ONLY recommend or discuss foods from the CURRENT MENU provided above.
2. If a user asks for something not on the menu, politely apologize and say we do not serve it. Do NOT make up items.
3. Use the Tags, Ingredients, and Calories data to answer specific dietary or health questions. Only claim an item is "spicy", "vegan", etc., if the tags or ingredients justify it.
4. Always quote prices exactly as provided.
5. If the user asks a question unrelated to FoodieHub, food, or ordering, politely refuse to answer and redirect them to the menu.

FORMATTING RULES:
- ALWAYS use clean, structured Markdown for your responses.
- When listing items, use bullet points and put EVERY item on a new line.
- If listing more than 4 items, organize them under categorized headers (e.g., by Cuisine).
- Bold the item names.
    `;
    
    // 4. Format the frontend history for the OpenAI/Grok SDK
    const formattedHistory = history.map((msg) => ({
      role: msg.role === "ai" ? "assistant" : "user",
      content: msg.content,
    }));

    // 5. Build the final message array
    const messages = [
      { role: "system", content: systemPrompt },
      ...formattedHistory,
      { role: "user", content: userMessage },
    ];

    // 6. Send to Grok
    const completion = await client.chat.completions.create({
      model: "grok-4-fast-non-reasoning", // Replace if you change models later
      messages: messages,
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("AI Service Error:", error.response?.data || error.message);
    return "FoodieHub AI is temporarily unavailable. Please try again later.";
  }
};