import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const ProtectedRoute = () => {
  const { isAuthenticated, loadingProfile } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // Show a toast only when loading is done and they are not authenticated
    if (!loadingProfile && !isAuthenticated) {
      toast.error("Please login to access this page!");
    }
  }, [loadingProfile, isAuthenticated]);

  // While checking local storage / API for the user, show nothing or a spinner
  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login and save the attempted URL
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If authenticated, render the protected child routes
  return <Outlet />;
};

export default ProtectedRoute;