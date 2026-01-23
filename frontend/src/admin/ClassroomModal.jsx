import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';

// ClassroomForm component
const ClassroomForm = ({ classroom, onSubmit, onCancel, sites, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    site: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (classroom) {
      setFormData({
        name: classroom.name || '',
        description: classroom.description || '',
        site: classroom.site || '', // Assuming site is an ID here
      });
    }
  }, [classroom]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.name || !formData.site) {
      setFormError('Name and Site are required.');
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
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange}
                  rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
      </div>

      <div>
        <label htmlFor="site" className="block text-sm font-medium text-gray-700">Sede</label>
        <select name="site" id="site" value={formData.site} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required>
          <option value="">Seleccione una sede</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          {loading ? <Spinner /> : (classroom ? 'Guardar Cambios' : 'Crear Aula')}
        </button>
      </div>
    </form>
  );
};


// ClassroomModal component
const ClassroomModal = ({ isOpen, onClose, classroom, onSave }) => {
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
      if (classroom) {
        await api.put(`/organization/classrooms/${classroom.id}/`, formData);
      } else {
        await api.post('/organization/classrooms/', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save classroom", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save classroom.");
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
                  {classroom ? 'Editar Aula' : 'Crear Nueva Aula'}
                </Dialog.Title>
                <div className="mt-4">
                  {loadingForm ? (
                    <Spinner />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <ClassroomForm
                      classroom={classroom}
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

export default ClassroomModal;
