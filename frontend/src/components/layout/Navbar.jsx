import {
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Moon,
  Sun,
  ShoppingCart,
  UserCircle,
  LogOut,
  Settings,
  Menu,
  X,
  Store
} from "lucide-react";

import { ThemeContext } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";

import Button from "../common/Button";
import Container from "../common/Container";

const publicLinks = [
  { id: 1, label: "Home", path: "/" },
  { id: 2, label: "Menu", path: "/menu" },
  { id: 3, label: "About", path: "/about" },
  { id: 4, label: "Contact", path: "/contact" },
];

const adminLinks = [
  { id: 5, label: "Dashboard", path: "/admin/dashboard" },
  { id: 6, label: "Manage Foods", path: "/admin/manage-foods" },
  { id: 7, label: "Orders", path: "/admin/orders" },
  { id: 8, label: "View Store", path: "/menu", icon: Store },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useContext(ThemeContext);
  const { totalQuantity } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);

  const navigationLinks = user?.role === "admin" ? adminLinks : publicLinks;
  
  // =========================================
  // DYNAMIC DEFAULT PATH BASED ON ROLE
  // =========================================
  const defaultPath = user?.role === "admin" ? "/admin/dashboard" : "/";

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
    setMobileMenuOpen(false);
    navigate("/");
  };

  const handleCartClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      toast.error("Please login to view your cart!");
      navigate("/login");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <Container>
        <div className="flex items-center justify-between py-3 sm:py-4">
          
          {/* Logo */}
          <NavLink to={defaultPath} onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-400 cursor-pointer tracking-tight">
              FoodieHub
            </h1>
          </NavLink>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <li key={link.id}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 font-semibold transition-all duration-200 ${
                      isActive
                        ? "text-orange-500"
                        : "text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
                    }`
                  }
                >
                  {link.icon && <link.icon size={16} className="mb-0.5" />}
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart Button (Always visible on mobile next to hamburger) */}
            {user?.role !== "admin" && (
              <NavLink
                to="/cart"
                onClick={handleCartClick}
                className="relative p-2.5 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-800 transition-colors"
              >
                <ShoppingCart size={20} />
                {isAuthenticated && totalQuantity > 0 && (
                  <span className="absolute 0 top-1 right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white dark:border-slate-950 transform translate-x-1/4 -translate-y-1/4">
                    {totalQuantity}
                  </span>
                )}
              </NavLink>
            )}

            {/* DESKTOP ONLY: User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative hidden md:block" ref={profileMenuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2.5 rounded-full border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 pr-3 pl-1 py-1 transition-all hover:border-orange-300 dark:hover:border-orange-500/50 hover:shadow-sm"
                >
                  {user?.profileImageUrl ? (
                    <img
                      src={user.profileImageUrl}
                      alt={user?.fullName}
                      className="h-8 w-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/10 font-bold text-orange-600 dark:text-orange-500 text-sm">
                      {userInitials || "U"}
                    </div>
                  )}

                  <span className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {user?.fullName?.split(" ")[0] || "Profile"}
                  </span>
                </button>

                {/* Desktop Profile Dropdown */}
                {menuOpen && (
                  <div className="absolute right-0 z-50 mt-3 w-56 rounded-2xl border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-2 shadow-2xl dark:shadow-none animate-in slide-in-from-top-2 fade-in duration-200">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        navigate("/profile");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700/50"
                    >
                      <Settings size={18} />
                      Profile Settings
                    </button>

                    {user?.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          navigate("/my-orders");
                        }}
                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 transition-colors hover:bg-orange-50 hover:text-orange-600 dark:hover:bg-slate-700/50"
                      >
                        <UserCircle size={18} />
                        My Orders
                      </button>
                    )}

                    <div className="my-1 h-px bg-gray-100 dark:bg-slate-700"></div>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink to="/login" className="hidden md:block">
                <Button className="px-6 py-2 rounded-xl font-semibold shadow-md shadow-orange-500/20">
                  Login
                </Button>
              </NavLink>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl border border-gray-200 dark:border-slate-700 text-gray-700 dark:text-gray-300 hover:border-orange-500 hover:text-orange-500 transition-colors ml-1"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

          </div>
        </div>
      </Container>

      {/* MOBILE NAVIGATION DROPDOWN */}
      {/* Increased max-h to 600px to accommodate the added profile section smoothly */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out border-t border-gray-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl ${
          mobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0 border-none"
        }`}
      >
        {/* Mobile Authenticated User Info Header */}
        {isAuthenticated && (
          <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3">
            {user?.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user?.fullName}
                className="h-10 w-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-500/10 font-bold text-orange-600 dark:text-orange-500">
                {userInitials || "U"}
              </div>
            )}
            <div className="flex flex-col">
              <span className="font-bold text-gray-800 dark:text-gray-200 leading-tight">
                {user?.fullName}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {user?.email}
              </span>
            </div>
          </div>
        )}

        {/* Mobile Navigation Links */}
        <ul className="flex flex-col px-6 py-4 space-y-2">
          {navigationLinks.map((link) => (
            <li key={link.id}>
              <NavLink
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
                    isActive
                      ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                  }`
                }
              >
                {link.icon && <link.icon size={18} />}
                {link.label}
              </NavLink>
            </li>
          ))}

          {/* Mobile Profile Actions (If Logged In) */}
          {isAuthenticated && (
            <>
              <div className="my-2 h-px bg-gray-100 dark:bg-slate-800"></div>
              <li>
                <NavLink
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
                      isActive
                        ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                    }`
                  }
                >
                  <Settings size={18} />
                  Profile Settings
                </NavLink>
              </li>

              {user?.role !== "admin" && (
                <li>
                  <NavLink
                    to="/my-orders"
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-colors ${
                        isActive
                          ? "bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-500"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800"
                      }`
                    }
                  >
                    <UserCircle size={18} />
                    My Orders
                  </NavLink>
                </li>
              )}
              
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </li>
            </>
          )}
          
          {/* Mobile Login Button (If Logged Out) */}
          {!isAuthenticated && (
            <li className="pt-2">
              <NavLink to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full py-3 rounded-xl font-semibold">
                  Login to Account
                </Button>
              </NavLink>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;