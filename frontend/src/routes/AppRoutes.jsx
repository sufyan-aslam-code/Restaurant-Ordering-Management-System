import { createBrowserRouter } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

import Home from "../pages/user/Home";
import Menu from "../pages/user/Menu";
import Login from "../pages/user/Login";
import Register from "../pages/user/Register";
import About from "../pages/user/About";
import Contact from "../pages/user/Contact";
import ForgotPassword from "../pages/user/ForgotPassword";
import VerifyPin from "../pages/user/VerifyPin";
import VerifyEmail from "../pages/user/VerifyEmail";
import Cart from "../pages/user/Cart";
import Checkout from "../pages/user/Checkout";
import OrderSuccess from "../pages/user/OrderSuccess";

import Dashboard from "../pages/admin/Dashboard";
import Orders from "../pages/admin/Orders";
import AddFood from "../pages/admin/AddFood";

const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "menu",
                element: <Menu />,
            },
            {
                path: "login",
                element: <Login />,
            },
            {
                path: "register",
                element: <Register />,
            },
            {
                path: "cart",
                element: <Cart />,
            },
            {
                path: "about",
                element: <About />,
            },

            {
                path: "contact",
                element: <Contact />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },

            {
                path: "verify-pin",
                element: <VerifyPin />,
            },
            {
                path: "verify-email",
                element: <VerifyEmail />,
            },
            {
                path: "/cart",
                element: <Cart />,
            },
            {
                path: "/checkout",
                element: <Checkout />,
            },
            {
                path: "/order-success",
                element: <OrderSuccess />,
            },
        ],
    },

    {
        path: "/admin",
        element: <AdminLayout />,
        children: [
            {
                index: true,
                element: <Dashboard />,
            },
            {
                path: "orders",
                element: <Orders />,
            },
            {
                path: "add-food",
                element: <AddFood />,
            },
        ],
    },
]);

export default router;