import { useContext } from "react";

import { NavLink } from "react-router-dom";

import {
  Moon,
  Sun,
  ShoppingCart,
} from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";

import Button from "../common/Button";
import Container from "../common/Container";

const navLinks = [
  {
    id: 1,
    label: "Home",
    path: "/",
  },

  {
    id: 2,
    label: "Menu",
    path: "/menu",
  },

  {
    id: 3,
    label: "About",
    path: "/about",
  },

  {
    id: 4,
    label: "Contact",
    path: "/contact",
  },
];

const Navbar = () => {
  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  return (
    <nav
      className="
        w-full
        bg-white
        border-b
        border-gray-200
        shadow-sm
        transition
      "
    >
      <Container>

        <div className="flex items-center justify-between py-4">

          {/* Logo */}
          <NavLink to="/">

            <h1 className="text-3xl font-bold text-orange-500 cursor-pointer">
              FoodieHub
            </h1>

          </NavLink>

          {/* Navigation Links */}
          <ul className="hidden md:flex items-center gap-8">

            {navLinks.map((link) => (
              <li key={link.id}>

                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `
                      font-medium
                      transition
                      ${
                        isActive
                          ? "text-orange-500"
                          : "text-gray-700 hover:text-orange-500"
                      }
                    `
                  }
                >
                  {link.label}
                </NavLink>

              </li>
            ))}

          </ul>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="
                p-2
                rounded-full
                border
                border-gray-300
                text-gray-700
                hover:border-orange-500
                hover:text-orange-500
                transition
              "
            >
              {darkMode ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>

            {/* Cart */}
            <NavLink
              to="/cart"
              className="
                relative
                p-2
                rounded-full
                border
                border-gray-300
                text-gray-700
                hover:border-orange-500
                hover:text-orange-500
                transition
              "
            >

              <ShoppingCart size={20} />

              {/* Cart Count */}
              <span
                className="
                  absolute
                  -top-2
                  -right-2
                  bg-orange-500
                  text-white
                  text-xs
                  w-5
                  h-5
                  flex
                  items-center
                  justify-center
                  rounded-full
                "
              >
                0
              </span>

            </NavLink>

            {/* Login */}
            <NavLink
              to="/login"
              className="
                text-gray-700
                hover:text-orange-500
                font-medium
                transition
              "
            >
              Login
            </NavLink>

            {/* Register */}
            <NavLink to="/register">

              <Button>
                Sign Up
              </Button>

            </NavLink>

          </div>

        </div>

      </Container>
    </nav>
  );
};

export default Navbar;