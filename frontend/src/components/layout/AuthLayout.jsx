import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";

const AuthLayout = () => {

  return (
    <>
      <Navbar />

      <main
        className="
          min-h-screen
          bg-gray-50 dark:bg-slate-950
        "
      >
        <Outlet />
      </main>
    </>
  );
};

export default AuthLayout;