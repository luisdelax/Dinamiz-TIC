import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';

// Hierarchical list of dependencies
const subdireccionFormList = [
  {
    id: "subdireccion",
    label: "Subdirección",
    children: [
      {
        id: "dependencias-directas",
        label: "Dependencias Directas",
        children: [
          { id: "secretaria", label: "Secretaría" },
          {
            id: "sistema-integrado",
            label: "Sistema Integrado de Autogestión y Control (Calidad, MIPG, SG-SST, SGPI)"
          },
          { id: "planeacion", label: "Planeación" },
          {
            id: "grupo-apoyo",
            label: "Grupo de Apoyo Administrativo – Intercentro Complejo Sur"
          }
        ]
      },
      {
        id: "area-administrativa",
        label: "Área Administrativa",
        children: [
          {
            id: "dinamizador-administrativo",
            label: "Dinamizador Administrativo",
            children: [
              { id: "talento-humano", label: "Apoyo de Gestión de Talento Humano" },
              { id: "recursos-financieros", label: "Gestión de Recursos Financieros" },
              { id: "gestion-contractual", label: "Gestión Contractual" },
              { id: "gestion-documental", label: "Gestión Documental" },
              { id: "infraestructura-logistica", label: "Gestión de Infraestructura y Logística" },
              { id: "comunicaciones", label: "Gestión de Comunicaciones" },
              {
                id: "relacionamiento-empresarial",
                label: "Relacionamiento Empresarial y Servicio al Ciudadano"
              }
            ]
          }
        ]
      },
      {
        id: "area-formacion",
        label: "Área de Formación",
        children: [
          {
            id: "coordinacion-formacion",
            label: "Coordinación de Formación Integral",
            children: [
              { id: "administracion-educativa", label: "Administración Educativa" },
              {
                id: "formacion-titulada",
                label: "Coordinación Académica Formación Titulada"
              },
              {
                id: "formacion-virtual",
                label: "Coordinación Académica Virtual y Complementaria"
              },
              {
                id: "educacion-media",
                label: "Articulación con la Educación Media"
              },
              {
                id: "bienestar-aprendiz",
                label: "Bienestar al Aprendiz y Relacionamiento al Egresado"
              },
              {
                id: "gestion-pedagogica",
                label: "Gestión Pedagógica y Cultural"
              },
              { id: "aseguramiento-calidad", label: "Aseguramiento de la Calidad" }
            ]
          }
        ]
      },
      {
        id: "otras-dependencias",
        label: "Otras Dependencias Misionales",
        children: [
          {
            id: "certificacion-competencias",
            label: "Evaluación y Certificación de Competencias Laborales"
          },
          {
            id: "i-d-i",
            label: "Gestión de la Investigación, el Desarrollo y la Innovación Tecnológica y Formativa",
            children: [
              { id: "servicios-tecnologicos", label: "Servicios Tecnológicos" }
            ]
          },
          {
            id: "emprendimiento",
            label: "Gestión de Emprendimiento y Empresarismo"
          },
          { id: "instructor", label: "Instructor" } // New item
        ]
      }
    ]
  }
];

// Helper function to flatten the hierarchical list
const flattenDependencies = (nodes, prefix = '') => {
  let options = [];
  nodes.forEach(node => {
    const currentLabel = prefix ? `${prefix} > ${node.label}` : node.label;
    options.push({ value: node.id, label: currentLabel });
    if (node.children) {
      options = options.concat(flattenDependencies(node.children, currentLabel));
    }
  });
  return options;
};

const allDependencyOptions = flattenDependencies(subdireccionFormList);

// PersonForm component
const PersonForm = ({ person, onSubmit, onCancel, sites, loading }) => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    person_type: 'student',
    site: '',
    dependencia: '', // New field
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
        dependencia: person.dependencia || '', // New field
      });
    }
  }, [person]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let newValue = value;

    // Convert to uppercase for text fields, but not for email fields
    if (type === 'text') {
      newValue = value.toUpperCase();
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
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
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" required />
      </div>

      <div>
        <label htmlFor="last_name" className="block text-sm font-medium text-gray-700">Apellido</label>
        <input type="text" name="last_name" id="last_name" value={formData.last_name} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" required />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="person_type" className="block text-sm font-medium text-gray-700">Tipo de Persona</label>
        <select name="person_type" id="person_type" value={formData.person_type} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase">
          <option value="student">Estudiante</option>
          <option value="employee">Funcionario</option>
        </select>
      </div>

      <div>
        <label htmlFor="site" className="block text-sm font-medium text-gray-700">Sede</label>
        <select name="site" id="site" value={formData.site} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase" required>
          <option value="">Seleccione una sede</option>
          {sites.map(site => (
            <option key={site.id} value={site.id}>{site.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dependencia" className="block text-sm font-medium text-gray-700">Dependencia</label>
        <select name="dependencia" id="dependencia" value={formData.dependencia} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 uppercase">
          <option value="">Seleccione una dependencia</option>
          {allDependencyOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
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
      // Clean up empty strings for foreign keys and optional fields
      const dataToSend = { ...formData };
      if (dataToSend.site === '') dataToSend.site = null;
      if (dataToSend.dependencia === '') dataToSend.dependencia = null; // Convert empty string to null

      if (person) {
        await api.put(`/organization/persons/${person.id}/`, dataToSend);
      } else {
        await api.post('/organization/persons/', dataToSend);
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
