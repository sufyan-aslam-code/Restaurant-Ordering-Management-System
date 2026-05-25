import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import "./index.css";

import ThemeProvider from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ChatWidget from "./components/chatbot/ChatWidget";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ChatWidgetWrapper() {
  const { user } = useAuth();

  return (
    <ChatWidget
      key={user?.id || user?.email || "guest"}
    />
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <>
            <RouterProvider router={AppRoutes} />

            <ChatWidgetWrapper />

            <ToastContainer
              position="top-right"
              autoClose={2500}
              hideProgressBar={true}
              newestOnTop={true}
              closeOnClick
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              toastClassName={(context) =>
                `relative flex p-4 mb-4 rounded-2xl justify-between overflow-hidden cursor-pointer shadow-xl border border-gray-100 bg-white text-gray-800 font-sans ${
                  context?.type === "error"
                    ? "border-l-4 border-l-red-500"
                    : context?.type === "success"
                    ? "border-l-4 border-l-green-500"
                    : "border-l-4 border-l-orange-500"
                }`
              }
              bodyClassName={() =>
                "text-sm font-semibold block p-1"
              }
            />
          </>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);