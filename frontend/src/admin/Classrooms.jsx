import { useEffect, useState, useCallback } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ClassroomModal from "./ClassroomModal";
import { PencilIcon, TrashIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  // Options for filters (fetched)
  const [sites, setSites] = useState([]);

  // Fetch initial data for filters (sites)
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const sitesRes = await api.get("/organization/sites/");
        setSites(sitesRes.data);
      } catch (err) {
        console.error("Error fetching initial data for filters:", err);
      }
    };
    fetchInitialData();
  }, []);

  const fetchClassrooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (siteFilter) params.append("site", siteFilter);

      const response = await api.get(`/organization/classrooms/?${params.toString()}`);
      setClassrooms(response.data);
    } catch (err) {
      setError("Failed to fetch classrooms.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, siteFilter]);

  // Debounced fetch for classrooms
  useEffect(() => {
    const handler = setTimeout(() => {
      fetchClassrooms();
    }, 300); // Debounce for 300ms

    return () => {
      clearTimeout(handler);
    };
  }, [fetchClassrooms, searchTerm, siteFilter]);

  const handleAddClassroom = () => {
    setSelectedClassroom(null);
    setIsModalOpen(true);
  };

  const handleEditClassroom = (classroom) => {
    setSelectedClassroom(classroom);
    setIsModalOpen(true);
  };

  const handleDeleteClassroom = async (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      try {
        await api.delete(`/organization/classrooms/${id}/`);
        fetchClassrooms();
      } catch (err) {
        setError("Failed to delete classroom.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedClassroom(null);
  };

  const handleClassroomSaved = () => {
    fetchClassrooms();
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
          <h2 className="text-2xl font-semibold leading-tight text-gray-800">Aulas</h2>
          <button
            onClick={handleAddClassroom}
            className="bg-green-700 text-white px-4 py-2 rounded-md hover:bg-green-800"
          >
            Agregar Aula
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
              placeholder="Buscar por nombre, descripción..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

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
                    Sede
                  </th>
                   <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {classrooms.map((classroom) => (
                  <tr key={classroom.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{classroom.name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      {/* Assuming site is an object with a name property */}
                      <p className="text-gray-900 whitespace-no-wrap">{classroom.site_name}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{classroom.description}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditClassroom(classroom)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeleteClassroom(classroom.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <ClassroomModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        classroom={selectedClassroom}
        onSave={handleClassroomSaved}
      />
    </div>
  );
};

export default Classrooms;
