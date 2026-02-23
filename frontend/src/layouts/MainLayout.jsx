import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Sidebar open by default on larger screens

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'md:ml-64' : 'md:ml-0'}`}>
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          <Outlet />
        </main>
        <footer className="bg-gray-200 p-4 text-center text-sm text-gray-500 border-t">
          © 2026 LUIS E. DE LA CRUZ F. All rights reserved.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;