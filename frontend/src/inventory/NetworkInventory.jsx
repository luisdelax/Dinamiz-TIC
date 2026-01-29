import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import NetworkDeviceModal from "./NetworkDeviceModal";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const NetworkInventory = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deviceTypeFilter, setDeviceTypeFilter] = useState("");
  const [siteFilter, setSiteFilter] = useState("");
  const [personFilter, setPersonFilter] = useState("");
  const [classroomFilter, setClassroomFilter] = useState("");

  // Options for filters (fetched or hardcoded)
  const [sites, setSites] = useState([]);
  const [persons, setPersons] = useState([]);
  const [classrooms, setClassrooms] = useState([]);

  const DEVICE_TYPE_OPTIONS = [
    { value: "", label: "Todos los Tipos" },
    { value: "router", label: "Router" },
    { value: "switch", label: "Switch" },
    { value: "ap", label: "Access Point" },
    { value: "patchpanel", label: "Patch Panel" },
    { value: "firewall", label: "Firewall" },
  ];

  const STATUS_OPTIONS = [
    { value: "", label: "Todos los Estados" },
    { value: "active", label: "Activo" },
    { value: "maintenance", label: "En mantenimiento" },
    { value: "down", label: "Fuera de servicio" },
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

  const fetchDevices = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (statusFilter) params.append("status", statusFilter);
      if (deviceTypeFilter) params.append("device_type", deviceTypeFilter);
      if (siteFilter) params.append("site", siteFilter);
      if (personFilter) params.append("assigned_to_person", personFilter);
      if (classroomFilter) params.append("assigned_to_classroom", classroomFilter);

      const response = await api.get(`/assets/network-devices/?${params.toString()}`);
      setDevices(response.data);
    } catch (err) {
      setError("Failed to fetch network devices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter, deviceTypeFilter, siteFilter, personFilter, classroomFilter]);

  // Debounced fetch for network devices
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchDevices();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchDevices, searchTerm, statusFilter, deviceTypeFilter, siteFilter, personFilter, classroomFilter]);

  const handleAddDevice = () => {
    setSelectedDevice(null);
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this network device?")) {
      try {
        await api.delete(`/assets/network-devices/${id}/`);
        fetchDevices();
      } catch (err) {
        setError("Failed to delete network device.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedDevice(null);
  };

  const handleDeviceSaved = () => {
    fetchDevices();
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
          <h2 className="text-2xl font-semibold leading-tight text-gray-800">Inventario de Equipos de Red</h2>
          <button
            onClick={handleAddDevice}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
          >
            Agregar Equipo de Red
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
              placeholder="Buscar por tag, marca, modelo, IP, MAC, ubicación..."
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
            value={deviceTypeFilter}
            onChange={(e) => setDeviceTypeFilter(e.target.value)}
          >
            {DEVICE_TYPE_OPTIONS.map(option => (
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
                    IP
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{device.asset_tag}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{device.device_type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{device.brand} {device.model}</p>
                    </td>
                     <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{device.ip_address}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight ${device.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${device.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{device.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditDevice(device)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeleteDevice(device.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <NetworkDeviceModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        device={selectedDevice}
        onSave={handleDeviceSaved}
      />
    </div>
  );
};

export default NetworkInventory;
