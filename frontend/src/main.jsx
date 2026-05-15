import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import AppRoutes from "./routes/AppRoutes";

import "./index.css";

import ThemeProvider from "./context/ThemeContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <ThemeProvider>

      <RouterProvider router={AppRoutes} />

    </ThemeProvider>

  </React.StrictMode>
);