import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../api/axios';
import Spinner from './Spinner'; // Reusing the Spinner component
import { useAuth } from '../auth/AuthContext';


const ChangePasswordModal = ({ isOpen, onClose }) => {
  const { user } = useAuth(); // Get current user info
  const [formData, setFormData] = useState({
    old_password: '',
    new_password1: '',
    new_password2: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setError(''); // Clear errors on input change
    setSuccess(''); // Clear success message on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    if (formData.new_password1 !== formData.new_password2) {
      setError('Las nuevas contraseñas no coinciden.');
      setLoading(false);
      return;
    }
    if (!formData.old_password || !formData.new_password1 || !formData.new_password2) {
      setError('Todos los campos son obligatorios.');
      setLoading(false);
      return;
    }
    
    try {
      // Assuming an endpoint like /users/{id}/change_password/
      await api.post(`/users/${user.user_id}/change_password/`, {
        old_password: formData.old_password,
        new_password: formData.new_password1,
      });
      setSuccess('Contraseña cambiada exitosamente.');
      setFormData({ old_password: '', new_password1: '', new_password2: '' }); // Clear form
      // onClose(); // Optionally close modal on success, or let user see success message
    } catch (err) {
      console.error("Error changing password:", err.response?.data || err);
      setError(err.response?.data?.old_password?.[0] || err.response?.data?.new_password?.[0] || 'Error al cambiar la contraseña.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-full sm:max-w-md transform overflow-hidden rounded-2xl bg-white p-4 sm:p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Cambiar Contraseña
                </Dialog.Title>
                <div className="mt-4">
                  {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
                  {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="old_password" className="block text-sm font-medium text-gray-700">Contraseña Actual</label>
                      <input type="password" name="old_password" id="old_password" value={formData.old_password} onChange={handleChange}
                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                    </div>
                    <div>
                      <label htmlFor="new_password1" className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                      <input type="password" name="new_password1" id="new_password1" value={formData.new_password1} onChange={handleChange}
                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                    </div>
                    <div>
                      <label htmlFor="new_password2" className="block text-sm font-medium text-gray-700">Confirmar Nueva Contraseña</label>
                      <input type="password" name="new_password2" id="new_password2" value={formData.new_password2} onChange={handleChange}
                             className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button type="button" onClick={onClose}
                              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
                        Cancelar
                      </button>
                      <button type="submit" disabled={loading}
                              className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
                        {loading ? <Spinner /> : 'Guardar'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ChangePasswordModal;
