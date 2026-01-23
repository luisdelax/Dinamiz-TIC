import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import NetworkDeviceModal from "./NetworkDeviceModal"; // Import the new modal component
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons

const NetworkInventory = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null); // To pass to modal for editing

  const fetchDevices = async () => {
    try {
      const response = await api.get("/assets/network-devices/");
      setDevices(response.data);
    } catch (err) {
      setError("Failed to fetch network devices.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAddDevice = () => {
    setSelectedDevice(null); // Clear selected device for "add" mode
    setIsModalOpen(true);
  };

  const handleEditDevice = (device) => {
    setSelectedDevice(device); // Set selected device for "edit" mode
    setIsModalOpen(true);
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this network device?")) {
      try {
        await api.delete(`/assets/network-devices/${id}/`);
        fetchDevices(); // Refresh the list
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
    fetchDevices(); // Refresh list after save
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold leading-tight">Inventario de Equipos de Red</h2>
          <button
            onClick={handleAddDevice}
            className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Equipo de Red
          </button>
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
