import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ComputerModal from "./ComputerModal"; // Import the new modal component
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons

const Inventory = () => {
  const [computers, setComputers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedComputer, setSelectedComputer] = useState(null); // To pass to modal for editing

  const fetchComputers = async () => {
    try {
      const response = await api.get("/assets/computers/");
      setComputers(response.data);
    } catch (err) {
      setError("Failed to fetch computers.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComputers();
  }, []);

  const handleAddComputer = () => {
    setSelectedComputer(null); // Clear selected computer for "add" mode
    setIsModalOpen(true);
  };

  const handleEditComputer = (computer) => {
    setSelectedComputer(computer); // Set selected computer for "edit" mode
    setIsModalOpen(true);
  };

  const handleDeleteComputer = async (id) => {
    if (window.confirm("Are you sure you want to delete this computer?")) {
      try {
        await api.delete(`/assets/computers/${id}/`);
        fetchComputers(); // Refresh the list
      } catch (err) {
        setError("Failed to delete computer.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedComputer(null);
  };

  const handleComputerSaved = () => {
    fetchComputers(); // Refresh list after save
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
          <h2 className="text-2xl font-semibold leading-tight">Inventario de Computadoras</h2>
          <button
            onClick={handleAddComputer}
            className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Computadora
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
                    N/S
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {computers.map((computer) => (
                  <tr key={computer.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{computer.asset_tag}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{computer.equipment_type}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{computer.brand} {computer.model}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                        <p className="text-gray-900 whitespace-no-wrap">{computer.serial_number}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight ${computer.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${computer.status === 'active' ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{computer.status}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditComputer(computer)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeleteComputer(computer.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <ComputerModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        computer={selectedComputer}
        onSave={handleComputerSaved}
      />
    </div>
  );
};

export default Inventory;
