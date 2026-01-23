import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import ClassroomModal from "./ClassroomModal"; // Import the new modal component
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons

const Classrooms = () => {
  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedClassroom, setSelectedClassroom] = useState(null); // To pass to modal for editing

  const fetchClassrooms = async () => {
    try {
      const response = await api.get("/organization/classrooms/");
      setClassrooms(response.data);
    } catch (err) {
      setError("Failed to fetch classrooms.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const handleAddClassroom = () => {
    setSelectedClassroom(null); // Clear selected classroom for "add" mode
    setIsModalOpen(true);
  };

  const handleEditClassroom = (classroom) => {
    setSelectedClassroom(classroom); // Set selected classroom for "edit" mode
    setIsModalOpen(true);
  };

  const handleDeleteClassroom = async (id) => {
    if (window.confirm("Are you sure you want to delete this classroom?")) {
      try {
        await api.delete(`/organization/classrooms/${id}/`);
        fetchClassrooms(); // Refresh the list
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
    fetchClassrooms(); // Refresh list after save
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
          <h2 className="text-2xl font-semibold leading-tight">Aulas</h2>
          <button
            onClick={handleAddClassroom}
            className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Aula
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
