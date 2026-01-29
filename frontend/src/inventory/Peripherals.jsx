import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import PeripheralModal from "./PeripheralModal";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Peripherals = () => {
  const [peripherals, setPeripherals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPeripheral, setSelectedPeripheral] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [peripheralTypeFilter, setPeripheralTypeFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [personFilter, setPersonFilter] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("");

  // Options for filters (fetched or hardcoded)
  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const PERIPHERAL_TYPE_OPTIONS = [
    { value: "", label: "Todos los Tipos" },
    { value: "keyboard", label: "Teclado" },
    { value: "mouse", label: "Ratón" },
    { value: "monitor", label: "Monitor" },
    { value: "printer", label: "Impresora" },
    { value: "scanner", label: "Escáner" },
    { value: "webcam", label: "Webcam" },
    { value: "headset", label: "Auriculares" },
    { value: "ups", label: "UPS" },
    { value: "other", label: "Otro" },
  ];

  const STATUS_OPTIONS = [
    { value: "", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "retired", label: "Retirado" },
  ];

  // Fetch initial data for filters (sites, persons, classrooms)
  useEffect(() => {
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
        console.error("Error fetching initial data for filters:", err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchPeripherals = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (peripheralTypeFilter) params.append("peripheral_type", peripheralTypeFilter);
      if (siteFilter) params.append("site", siteFilter);
      if (personFilter) params.append("assigned_to_person", personFilter);
      if (classroomFilter) params.append("assigned_to_classroom", classroomFilter);

      const response = await api.get(`/assets/peripherals/?${params.toString()}`);
      setPeripherals(response.data);
    } catch (err) {
      setError("Failed to fetch peripherals.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, peripheralTypeFilter, siteFilter, personFilter, classroomFilter]);

  // Debounced fetch for peripherals
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchPeripherals();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchPeripherals, searchTerm, statusFilter, peripheralTypeFilter, siteFilter, personFilter, classroomFilter]);

  const handleAddPeripheral = () => {
    setSelectedPeripheral(null);
    setIsModalOpen(true);
  };

  const handleEditPeripheral = (peripheral) => {
    setSelectedPeripheral(peripheral);
    setIsModalOpen(true);
  };

  const handleDeletePeripheral = async (id) => {
    if (window.confirm("Are you sure you want to delete this peripheral?")) {
      try {
        await api.delete(`/assets/peripherals/${id}/`);
        fetchPeripherals();
      } catch (err) {
        setError("Failed to delete peripheral.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedPeripheral(null);
  };

  const handlePeripheralSaved = () => {
    fetchPeripherals();
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-4 md:p-6">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold leading-tight text-gray-800">Inventario de Periféricos</h2>
          <button
            onClick={handleAddPeripheral}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
          >
            Agregar Periférico
          </button>
        </div>

        {/* Search and Filter Section */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por tag, marca, modelo..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="block w-full pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {STATUS_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            className="block w-full pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={peripheralTypeFilter}
            onChange={(e) => setPeripheralTypeFilter(e.target.value)}
          >
            {PERIPHERAL_TYPE_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>

          <select
            className="block w-full pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={siteFilter}
            onChange={(e) => setSiteFilter(e.target.value)}
          >
            <option value="">Todas las Sedes</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.name}
              </option>
            ))}
          </select>

          <select
            className="block w-full pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={personFilter}
            onChange={(e) => setPersonFilter(e.target.value)}
          >
            <option value="">Todas las Personas</option>
            {persons.map((person) => (
              <option key={person.id} value={person.id}>
                {person.first_name} {person.last_name}
              </option>
            ))}
          </select>

          <select
            className="block w-full pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={classroomFilter}
            onChange={(e) => setClassroomFilter(e.target.value)}
          >
            <option value="">Todas las Aulas</option>
            {classrooms.map((classroom) => (
              <option key={classroom.id} value={classroom.id}>
                {classroom.name}
              </option>
            ))}
          </select>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Activo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Marca / Modelo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    N/S
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {peripherals.map((peripheral) => (
                  <tr key={peripheral.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{peripheral.asset_tag}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{peripheral.peripheral_type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{peripheral.brand} {peripheral.model}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{peripheral.serial_number}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${peripheral.status === 'active' ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${peripheral.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{peripheral.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditPeripheral(peripheral)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeletePeripheral(peripheral.id)} className="text-red-600 hover:text-red-900 flex items-center">
                          <TrashIcon className="w-5 h-5 mr-1" /> Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PeripheralModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        peripheral={selectedPeripheral}
        onSave={handlePeripheralSaved}
      />
    </div>
  );
};

export default Peripherals;
