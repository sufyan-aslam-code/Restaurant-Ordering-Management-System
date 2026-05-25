import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

// 1. Add history as the second parameter (defaulting to an empty array)
export const sendMessageToAI = async (message, history = []) => {
  const response = await axios.post(
    `${API_BASE_URL}/ai/chat`,
    {
      message,
      history, // 2. Send the history array in the request body
    }
  );

  return response.data;
};