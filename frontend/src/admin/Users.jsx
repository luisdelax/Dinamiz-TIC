import { useEffect, useState } from "react";
import api from "../api/axios";
import Spinner from "../components/Spinner";
import UserModal from "./UserModal"; // Import the new modal component
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'; // Import icons

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // To pass to modal for editing

  const fetchUsers = async () => {
    try {
      const response = await api.get("/users/");
      setUsers(response.data);
    } catch (err) {
      setError("Failed to fetch users.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null); // Clear selected user for "add" mode
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user); // Set selected user for "edit" mode
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/users/${id}/`);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError("Failed to delete user.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    fetchUsers(); // Refresh list after save
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
          <h2 className="text-2xl font-semibold leading-tight">Usuarios</h2>
          <button
            onClick={handleAddUser}
            className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Agregar Usuario
          </button>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Usuario
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Rol
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Sede
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Activo
                  </th>
                  <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.username}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.role}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{user.site_name || 'N/A'}</p>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.is_active ? 'text-green-900 bg-green-200' : 'text-red-900 bg-red-200'}`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${user.is_active ? 'bg-green-200' : 'bg-red-200'}`}></span>
                        <span className="relative">{user.is_active ? 'Sí' : 'No'}</span>
                      </span>
                    </td>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditUser(user)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        onSave={handleUserSaved}
      />
    </div>
  );
};

export default Users;
