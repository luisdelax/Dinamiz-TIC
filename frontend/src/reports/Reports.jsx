import { useState, useEffect } from "react";
import api from "../api/axios";
import MainLayout from "../layouts/MainLayout";
import Spinner from "../components/Spinner";

export default function Reports() {
  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [computerFilters, setComputerFilters] = useState({
    site: "",
    status: "",
    equipment_type: "",
    assigned_to: "",
  });

  const [ticketFilters, setTicketFilters] = useState({
    status: "",
    start_date: "",
    end_date: "",
  });

  const fetchInitialData = async () => {
    try {
      const [sitesRes, personsRes, classroomsRes] = await Promise.all([
        api.get("/organization/sites/"),
        api.get("/organization/persons/"),
        api.get("/organization/classrooms/"),
      ]);
      setSites(sitesRes.data);
      setPersons(personsRes.data);
      setClassrooms(classroomsRes.data);
    } catch (err) {
      setError("Error al cargar datos iniciales para reportes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleComputerFilterChange = (e) => {
    setComputerFilters({ ...computerFilters, [e.target.name]: e.target.value });
  };

  const handleTicketFilterChange = (e) => {
    setTicketFilters({ ...ticketFilters, [e.target.name]: e.target.value });
  };

  const generateComputerReport = () => {
    const params = new URLSearchParams();
    for (const key in computerFilters) {
      if (computerFilters[key]) {
        params.append(key, computerFilters[key]);
      }
    }
    window.open(`/api/reports/inventory/pdf/?${params.toString()}`, "_blank");
  };

  const generateTicketReport = () => {
    const params = new URLSearchParams();
    for (const key in ticketFilters) {
      if (ticketFilters[key]) {
        params.append(key, ticketFilters[key]);
      }
    }
    window.open(`/api/reports/tickets/pdf/?${params.toString()}`, "_blank");
  };

  if (loading) {
    return (
      <MainLayout>
        <Spinner />
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <p className="p-6 text-red-500">{error}</p>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Generar Reportes</h1>

        {/* Reporte de Inventario de Computadoras */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Reporte de Inventario de Computadoras (PDF)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Sede:</label>
              <select
                name="site"
                value={computerFilters.site}
                onChange={handleComputerFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="">Todas</option>
                {sites.map((site) => (
                  <option key={site.id} value={site.id}>
                    {site.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
              <select
                name="status"
                value={computerFilters.status}
                onChange={handleComputerFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="">Todos</option>
                <option value="active">Activo</option>
                <option value="maintenance">En Mantenimiento</option>
                <option value="retired">Retirado</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Equipo:</label>
              <select
                name="equipment_type"
                value={computerFilters.equipment_type}
                onChange={handleComputerFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="">Todos</option>
                <option value="desktop">PC Escritorio</option>
                <option value="laptop">Laptop</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Asignado a Persona:</label>
              <select
                name="assigned_to"
                value={computerFilters.assigned_to}
                onChange={handleComputerFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="">Cualquiera</option>
                {persons.map((person) => (
                  <option key={person.id} value={person.id}>
                    {person.first_name} {person.last_name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={generateComputerReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Generar Reporte de Inventario (PDF)
          </button>
        </div>

        {/* Reporte de Tickets */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Reporte de Tickets (PDF)</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Estado:</label>
              <select
                name="status"
                value={ticketFilters.status}
                onChange={handleTicketFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              >
                <option value="">Todos</option>
                <option value="open">Abierto</option>
                <option value="in_progress">En Progreso</option>
                <option value="closed">Cerrado</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Inicio:</label>
              <input
                type="date"
                name="start_date"
                value={ticketFilters.start_date}
                onChange={handleTicketFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Fecha Fin:</label>
              <input
                type="date"
                name="end_date"
                value={ticketFilters.end_date}
                onChange={handleTicketFilterChange}
                className="shadow border rounded w-full py-2 px-3 text-gray-700"
              />
            </div>
          </div>
          <button
            onClick={generateTicketReport}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Generar Reporte de Tickets (PDF)
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
