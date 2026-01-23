import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import RoleRoute from "./auth/RoleRoute";
import MainLayout from "./layouts/MainLayout";
import Dashboard from "./dashboard/Dashboard";
import AdminPanel from "./admin/AdminPanel";
import Sites from "./admin/Sites";
import Classrooms from "./admin/Classrooms";
import Persons from "./admin/Persons";
import Users from "./admin/Users";
import Inventory from "./inventory/Inventory";
import NetworkInventory from "./inventory/NetworkInventory";
import Peripherals from "./inventory/Peripherals";
import Tickets from "./Tickets";
import { useAuth } from "./auth/AuthContext";

function App() {
  const { isAuthenticated } = useAuth();

  return (

      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes with MainLayout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Inventory */}
          <Route path="inventory/computers" element={<Inventory />} />
          <Route path="inventory/network" element={<NetworkInventory />} />
          <Route path="inventory/peripherals" element={<Peripherals />} />

          {/* Tickets */}
          <Route path="tickets" element={<Tickets />} />
          
          {/* Admin Routes */}
          <Route path="admin" element={<RoleRoute allowedRoles={['admin']}><AdminPanel /></RoleRoute>} />
          <Route path="admin/sites" element={<RoleRoute allowedRoles={['admin']}><Sites /></RoleRoute>} />
          <Route path="admin/classrooms" element={<RoleRoute allowedRoles={['admin']}><Classrooms /></RoleRoute>} />
          <Route path="admin/persons" element={<RoleRoute allowedRoles={['admin']}><Persons /></RoleRoute>} />
          <Route path="admin/users" element={<RoleRoute allowedRoles={['admin']}><Users /></RoleRoute>} />

          {/* Redirect from / to /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
        </Route>

        <Route 
          path="*" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} 
        />
      </Routes>

  );
}

export default App;