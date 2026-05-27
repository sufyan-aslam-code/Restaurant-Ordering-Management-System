import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";  

// User Pages
import Home from "../pages/user/Home";
import Menu from "../pages/user/Menu";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import OrderSuccess from "../pages/user/OrderSuccess";
import ProductDetails from "../pages/user/ProductDetails";
import Profile from "../pages/user/Profile";
import MyOrders from "../pages/user/MyOrders";

// Auth Pages
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyEmail from "../pages/user/VerifyEmail";
import ResetPassword from "../pages/user/ResetPassword";

// Admin Pages
import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import ManageFoods from "../pages/admin/ManageFoods";
import ManageUsers from "../pages/admin/ManageUsers"; // <-- 1. THIS WAS MISSING

// Support Pages
import FAQ from "../pages/user/FAQ";
import HelpCenter from "../pages/user/HelpCenter";
import TrackOrder from "../pages/user/TrackOrder";
import Feedback from "../pages/user/Feedback";

// Policy Pages
import PrivacyPolicy from "../pages/user/PrivacyPolicy";
import TermsOfService from "../pages/user/TermsOfService";
import CookiePolicy from "../pages/user/CookiePolicy";

const router = createBrowserRouter([
  // Main Website
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // ----------------------------------
      // PUBLIC ROUTES (Anyone can view)
      // ----------------------------------
      { index: true, element: <Home /> },
      { path: "menu", element: <Menu /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "product/:id", element: <ProductDetails /> },
      { path: "faq", element: <FAQ /> },
      { path: "help-center", element: <HelpCenter /> },
      { path: "feedback", element: <Feedback /> },
      { path: "privacy-policy", element: <PrivacyPolicy /> },
      { path: "terms-of-service", element: <TermsOfService /> },
      { path: "cookie-policy", element: <CookiePolicy /> },

      // ----------------------------------
      // PROTECTED ROUTES (Requires Login)
      // ----------------------------------
      {
        element: <ProtectedRoute />,
        children: [
          { path: "cart", element: <Cart /> },
          { path: "checkout", element: <Checkout /> },
          { path: "order-success", element: <OrderSuccess /> },
          { path: "profile", element: <Profile /> },
          { path: "my-orders", element: <MyOrders /> },
          { path: "track-order", element: <TrackOrder /> },
        ],
      },
    ],
  },

  // Auth Pages
  {
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-pin", element: <ResetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "verify-email", element: <VerifyEmail /> },
    ],
  },

  // Admin Panel
  {
    path: "/admin",
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Dashboard /> },
          { path: "dashboard", element: <Dashboard /> },
          { path: "orders", element: <Orders /> },
          { path: "manage-foods", element: <ManageFoods /> },
          { path: "users", element: <ManageUsers /> }, // <-- 2. THIS WAS MISSING
        ],
      },
    ],
  },
]);

export default router;