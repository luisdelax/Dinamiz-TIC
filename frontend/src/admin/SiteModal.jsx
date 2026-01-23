import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';

// SiteForm component
const SiteForm = ({ site, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    is_active: true,
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (site) {
      setFormData({
        name: site.name || '',
        address: site.address || '',
        city: site.city || '',
        is_active: site.is_active || false,
      });
    }
  }, [site]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name) {
      setFormError('Name is required.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">Dirección</label>
        <input type="text" name="address" id="address" value={formData.address} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ciudad</label>
        <input type="text" name="city" id="city" value={formData.city} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" />
      </div>

      <div className="flex items-center">
        <input type="checkbox" name="is_active" id="is_active" checked={formData.is_active} onChange={handleChange}
               className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
        <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">Activa</label>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          {loading ? <Spinner /> : (site ? 'Guardar Cambios' : 'Crear Sede')}
        </button>
      </div>
    </form>
  );
};


// SiteModal component
const SiteModal = ({ isOpen, onClose, site, onSave }) => {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError('');
    try {
      if (site) {
        await api.put(`/organization/sites/${site.id}/`, formData);
      } else {
        await api.post('/organization/sites/', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save site", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save site.");
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
                  {site ? 'Editar Sede' : 'Crear Nueva Sede'}
                </Dialog.Title>
                <div className="mt-4">
                  {error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <SiteForm
                      site={site}
                      onSubmit={handleSubmit}
                      onCancel={onClose}
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

export default SiteModal;
