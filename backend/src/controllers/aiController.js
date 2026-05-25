// Change the import to point to the new aiService.js
import { generateAIResponse } from "../services/aiService.js";

export const chatWithAI = async (req, res) => {
  try {
    // Accept history from the frontend
    const { message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    // Pass BOTH message and history
    const reply = await generateAIResponse(message, history);

    res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "AI request failed",
    });
  }
};