import { Link } from "react-router-dom";
import { getRole } from "../auth/auth";

const Sidebar = () => {
  const role = getRole();

  return (
    <aside className="w-64 bg-white shadow-lg">
      <div className="p-6 text-xl font-bold border-b">
        IT Management
      </div>

      <nav className="p-4 space-y-2">
        <Link className="block p-2 rounded hover:bg-gray-100" to="/dashboard">
          Dashboard
        </Link>

        <Link className="block p-2 rounded hover:bg-gray-100" to="/inventory">
          Inventario
        </Link>

        <Link className="block p-2 rounded hover:bg-gray-100" to="/tickets">
          Tickets
        </Link>

        {role === "admin" && (
          <Link className="block p-2 rounded hover:bg-gray-100" to="/admin">
            Administración
          </Link>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
