import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const AdminRoute = () => {
  const { user, isAuthenticated, loadingProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show toasts only when loading is complete
    if (!loadingProfile) {
      if (!isAuthenticated) {
        toast.error("Please login to access the admin panel!");
      } else if (user?.role !== "admin") {
        toast.error("Unauthorized! Admin access required.");
      }
    }
  }, [loadingProfile, isAuthenticated, user]);

  // Show a loading spinner while checking the user's token
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // 1. If not logged in at all, send to login page
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. If logged in but NOT an admin, bounce them to the home page
  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 3. If authenticated AND is admin, render the requested admin page
  return <Outlet />;
};

export default AdminRoute;