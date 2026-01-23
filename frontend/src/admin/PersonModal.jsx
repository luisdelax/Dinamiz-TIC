import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';

// PersonForm component
const PersonForm = ({ person, onSubmit, onCancel, sites, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    person_type: 'student',
    site: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (person) {
      setFormData({
        first_name: person.first_name || '',
        last_name: person.last_name || '',
        email: person.email || '',
        person_type: person.person_type || 'student',
        site: person.site || '', // Assuming site is an ID here
      });
    }
  }, [person]);

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

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.site) {
      setFormError('First Name, Last Name, Email, and Site are required.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      
      <div>
        <label htmlFor="first_name" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input type="text" name="first_name" id="first_name" value={formData.first_name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
        <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="person_type" className="block text-sm font-medium text-gray-700">Tipo de Persona</label>
        <select name="person_type" id="person_type" value={formData.person_type} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="student">Estudiante</option>
          <option value="employee">Funcionario</option>
        </select>
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
          {loading ? <Spinner /> : (person ? 'Guardar Cambios' : 'Crear Persona')}
        </button>
      </div>
    </form>
  );
};


// PersonModal component
const PersonModal = ({ isOpen, onClose, person, onSave }) => {
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
      if (person) {
        await api.put(`/organization/persons/${person.id}/`, formData);
      } else {
        await api.post('/organization/persons/', formData);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save person", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save person.");
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
                  {person ? 'Editar Persona' : 'Crear Nueva Persona'}
                </Dialog.Title>
                <div className="mt-4">
                  {loadingForm ? (
                    <Spinner />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <PersonForm
                      person={person}
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

export default PersonModal;
