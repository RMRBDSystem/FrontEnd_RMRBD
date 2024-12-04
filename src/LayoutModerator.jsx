import React from "react";
import { Outlet } from "react-router-dom";
import NavbarModerator from "./components/Navbar/NavbarModerator";
import SidebarModerator from "./components/Moderator/SidebarModerator";
import Footer from "./components/Footer/Footer";
import Breadcrumb from "./components/Breadcrumb/Breadcrumb";

function Layout() {
  return (
      <div className="flex flex-col">
        <NavbarModerator />
        <main>
          <div className="flex flex-1 overflow-y-auto bg-gray-100">
            {/* Sidebar */}
            <SidebarModerator />
            {/* Content area (Outlet) */}
            <div className="flex-1 flex justify-center items-center">
              <div className="w-full max-w-7xl p-4">
                <Outlet />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
  );
}

export default Layout;
