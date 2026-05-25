import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      
      {/* NAVBAR */}
      <Navbar />

      {/* PAGE CONTENT */}
      <main className="p-8">
        <Outlet />
      </main>

    </div>
  );
};

export default AdminLayout;