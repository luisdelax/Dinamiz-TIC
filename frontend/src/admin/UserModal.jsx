import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../api/axios';
import Spinner from '../components/Spinner';

// UserForm component
const UserForm = ({ user, onSubmit, onCancel, loading, sites }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: 'user',
    site: '',
    is_active: true,
    is_staff: false,
    is_superuser: false,
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        role: user.role || 'user',
        site: user.site || '',
        is_active: user.is_active || false,
        is_staff: user.is_staff || false,
        is_superuser: user.is_superuser || false,
        password: '', // Password is not pre-filled for security
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // Convert to uppercase for text fields, but not for email or password fields
    if (type === 'text') {
      newValue = value.toUpperCase();
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : newValue,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username || !formData.email || (!user && !formData.password)) {
      setFormError('Username, Email, and Password (for new users) are required.');
      return;
    }
    if (!formData.site && formData.role !== 'admin') {
      setFormError('Site is required for non-admin users.');
      return;
    }
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Usuario</label>
        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
        <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" />
      </div>

      {(!user || user.id === undefined) && ( // Only show password field for new users
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" name="password" id="password" value={formData.password} onChange={handleChange}
                 className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required={!user} />
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rol</label>
        <select name="role" id="role" value={formData.role} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="user">Usuario</option>
          <option value="technician">Técnico</option>
          <option value="admin">Administrador</option>
        </select>
      </div>

      <div>
        <label htmlFor="site" className="block text-sm font-medium text-gray-700">Sede</label>
        <select name="site" id="site" value={formData.site} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                required={formData.role !== 'admin'}> {/* Site is not required for admin */}
          <option value="">{formData.role === 'admin' ? 'No aplica para Admin' : 'Seleccione una sede'}</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      <div className="flex items-center">
        <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Activo</label>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="is_staff" id="is_staff" checked={formData.is_staff} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="is_staff" className="ml-2 block text-sm text-gray-900">Es Staff</label>
      </div>
      <div className="flex items-center">
        <input type="checkbox" name="is_superuser" id="is_superuser" checked={formData.is_superuser} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="is_superuser" className="ml-2 block text-sm text-gray-900">Es Superusuario</label>
      </div>


      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          {loading ? <Spinner /> : (user ? 'Guardar Cambios' : 'Crear Usuario')}
        </button>
      </div>
    </form>
  );
};


// UserModal component
const UserModal = ({ isOpen, onClose, user, onSave }) => {
  const [sites, setSites] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const sitesRes = await api.get('/organization/sites/');
          setSites(sitesRes.data);
        } catch (err) {
          console.error("Failed to fetch form data", err);
          setError("Failed to load necessary form data.");
        } finally {
          setLoadingForm(false);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      // Clean up empty strings for foreign keys
      const dataToSend = { ...formData };
      if (dataToSend.site === '') dataToSend.site = null;
      if (dataToSend.password === '') delete dataToSend.password; // Don't send empty password on update

      if (user) {
        await api.patch(`/users/${user.id}/`, dataToSend); // Use patch for partial updates
      } else {
        await api.post('/users/', dataToSend);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save user", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save user.");
    } finally {
      setSubmitting(false);
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
                  {user ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                </Dialog.Title>
                <div className="mt-4">
                  {loadingForm ? (
                    <Spinner />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <UserForm
                      user={user}
                      onSubmit={handleSubmit}
                      onCancel={onClose}
                      sites={sites}
                      loading={submitting}
                    />
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserModal;
