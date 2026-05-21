import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useCart } from "../../context/CartContext";

import { NavLink, useNavigate } from "react-router-dom";

import {
  Moon,
  Sun,
  ShoppingCart,
  UserCircle,
  LogOut,
  Settings,
} from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";

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
  const navigate = useNavigate();

  const { darkMode, toggleTheme } =
    useContext(ThemeContext);

  const { totalQuantity } = useCart();

  const {
    user,
    isAuthenticated,
    logout,
  } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const userInitials = useMemo(() => {
    const name = user?.fullName || "";

    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() || "")
      .join("");
  }, [user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        bg-white/90 theme-surface
        backdrop-blur-md
        border-b
        border-gray-200 dark:border-gray-700
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
                                  : "text-gray-700 dark:text-gray-200 hover:text-orange-500"
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
                border-gray-300 dark:border-gray-700
                text-gray-700 dark:text-gray-200
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
                border-gray-300 dark:border-gray-700
                text-gray-700 dark:text-gray-200
                hover:border-orange-500
                hover:text-orange-500
                transition
              "
            >

              <ShoppingCart size={20} />

              {/* Cart Count */}
              {
                totalQuantity > 0 && (
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
                    {totalQuantity}
                  </span>
                )
              }

            </NavLink>

            {isAuthenticated ? (
              <div className="relative" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((currentValue) => !currentValue)}
                  className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white theme-surface dark:border-gray-700 px-3 py-2 transition hover:border-orange-300"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={`http://localhost:5000${user.profileImageUrl}`}
                      alt={user?.fullName}
                      className="h-10 w-10 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-semibold text-orange-600">
                      {userInitials || "U"}
                    </div>
                  )}

                  <span className="hidden text-sm font-semibold text-gray-800 md:inline">
                    {user?.fullName || "Profile"}
                  </span>
                </button>

                  {menuOpen ? (
                  <div className="absolute right-0 z-20 mt-3 w-64 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white theme-surface p-3 shadow-xl">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <Settings size={16} />
                      Profile Settings
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile#orders");
                      }}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-gray-700 transition hover:bg-orange-50 hover:text-orange-600"
                    >
                      <UserCircle size={16} />
                      My Orders
                    </button>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <NavLink to="/login">
                <Button className="px-5 py-2 rounded-xl">
                  Login
                </Button>
              </NavLink>
            )}

          </div>

        </div>

      </Container>
    </nav>
  );
};

export default Navbar;