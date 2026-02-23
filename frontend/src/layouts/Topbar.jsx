import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow px-6 py-4 flex justify-between">
      <span className="text-gray-600">Panel de control</span>

      <button
        onClick={logout}
        className="text-sm text-red-600 hover:underline"
      >
        Cerrar sesión
      </button>
    </header>
  );
};

export default Topbar;
