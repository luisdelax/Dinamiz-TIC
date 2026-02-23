import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import SiteModal from "./SiteModal"; // Import the new modal component
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons

const Sites = () => {
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null); // To pass to modal for editing

  const fetchSites = async () => {
    try {
      const response = await api.get("/organization/sites/");
      setSites(response.data);
    } catch (err) {
      setError("Failed to fetch sites.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  const handleAddSite = () => {
    setSelectedSite(null); // Clear selected site for "add" mode
    setIsModalOpen(true);
  };

  const handleEditSite = (site) => {
    setSelectedSite(site); // Set selected site for "edit" mode
    setIsModalOpen(true);
  };

  const handleDeleteSite = async (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      try {
        await api.delete(`/organization/sites/${id}/`);
        fetchSites(); // Refresh the list
      } catch (err) {
        setError("Failed to delete site.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedSite(null);
  };

  const handleSiteSaved = () => {
    fetchSites(); // Refresh list after save
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
          <h2 className="text-2xl font-semibold leading-tight">Sedes</h2>
          <button
            onClick={handleAddSite}
            className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Sede
          </button>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Ciudad
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {sites.map((site) => (
                  <tr key={site.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{site.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{site.address}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{site.city}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${site.is_active ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${site.is_active ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{site.is_active ? 'Activa' : 'Inactiva'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditSite(site)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeleteSite(site.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <SiteModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        site={selectedSite}
        onSave={handleSiteSaved}
      />
    </div>
  );
};

export default Sites;
