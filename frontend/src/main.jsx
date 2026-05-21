import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import "./index.css";

import ThemeProvider from "./context/ThemeContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <RouterProvider router={AppRoutes} />
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);