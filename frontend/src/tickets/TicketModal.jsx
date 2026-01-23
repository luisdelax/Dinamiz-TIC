import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';
import { useAuth } from '../auth/AuthContext';


// TicketForm component
const TicketForm = ({ ticket, onSubmit, onCancel, computers, networkDevices, sites, loading }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ticket_type: 'incident',
    status: 'open',
    priority: 'medium',
    computer: '',
    network_device: '',
    site: '',
    created_by: user ? user.user_id : '',
    assigned_to: '',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title || '',
        description: ticket.description || '',
        ticket_type: ticket.ticket_type || 'incident',
        status: ticket.status || 'open',
        priority: ticket.priority || 'medium',
        computer: ticket.computer || '',
        network_device: ticket.network_device || '',
        site: ticket.site || '',
        created_by: ticket.created_by || (user ? user.user_id : ''),
        assigned_to: ticket.assigned_to || '',
      });
    }
  }, [ticket, user]);

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

    if (!formData.title || !formData.description || !formData.site) {
      setFormError('Title, Description, and Site are required.');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formError && <p className="text-red-500 text-sm">{formError}</p>}
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Título</label>
        <input type="text" name="title" id="title" value={formData.title} onChange={handleChange}
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descripción</label>
        <textarea name="description" id="description" value={formData.description} onChange={handleChange}
                  rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50" required></textarea>
      </div>

      <div>
        <label htmlFor="ticket_type" className="block text-sm font-medium text-gray-700">Tipo de Ticket</label>
        <select name="ticket_type" id="ticket_type" value={formData.ticket_type} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="incident">Incidencia</option>
          <option value="request">Requerimiento</option>
        </select>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Prioridad</label>
        <select name="priority" id="priority" value={formData.priority} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="low">Baja</option>
          <option value="medium">Media</option>
          <option value="high">Alta</option>
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

      <div>
        <label htmlFor="computer" className="block text-sm font-medium text-gray-700">Computadora Asociada</label>
        <select name="computer" id="computer" value={formData.computer} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">Ninguna</option>
          {computers.map(comp => (
            <option key={comp.id} value={comp.id}>{comp.asset_tag} - {comp.brand} {comp.model}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="network_device" className="block text-sm font-medium text-gray-700">Dispositivo de Red Asociado</label>
        <select name="network_device" id="network_device" value={formData.network_device} onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
          <option value="">Ninguno</option>
          {networkDevices.map(nd => (
            <option key={nd.id} value={nd.id}>{nd.asset_tag} - {nd.brand} {nd.model}</option>
          ))}
        </select>
      </div>

      {/* Only admins/technicians can change status or assigned_to */}
      {user && (user.role === 'admin' || user.role === 'technician') && (
        <>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Estado</label>
            <select name="status" id="status" value={formData.status} onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
              <option value="open">Abierto</option>
              <option value="in_progress">En Progreso</option>
              <option value="waiting">En Espera</option>
              <option value="closed">Cerrado</option>
            </select>
          </div>
          {/* Assigned to will be handled by a specific 'assign' action */}
        </>
      )}

      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onCancel}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-gray-500">
          Cancelar
        </button>
        <button type="submit" disabled={loading}
                className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-indigo-500">
          {loading ? <Spinner /> : (ticket ? 'Guardar Cambios' : 'Crear Ticket')}
        </button>
      </div>
    </form>
  );
};


// TicketModal component
const TicketModal = ({ isOpen, onClose, ticket, onSave }) => {
  const [computers, setComputers] = useState([]);
  const [networkDevices, setNetworkDevices] = useState([]);
  const [sites, setSites] = useState([]);
  const [loadingForm, setLoadingForm] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const [computersRes, networkDevicesRes, sitesRes] = await Promise.all([
            api.get('/assets/computers/'),
            api.get('/assets/network-devices/'),
            api.get('/organization/sites/'),
          ]);
          setComputers(computersRes.data);
          setNetworkDevices(networkDevicesRes.data);
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
      if (dataToSend.computer === '') dataToSend.computer = null;
      if (dataToSend.network_device === '') dataToSend.network_device = null;
      if (dataToSend.assigned_to === '') dataToSend.assigned_to = null;

      if (ticket) {
        await api.put(`/support/tickets/${ticket.id}/`, dataToSend);
      } else {
        await api.post('/support/tickets/', dataToSend);
      }
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to save ticket", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to save ticket.");
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
                  {ticket ? 'Editar Ticket' : 'Crear Nuevo Ticket'}
                </Dialog.Title>
                <div className="mt-4">
                  {loadingForm ? (
                    <Spinner />
                  ) : error ? (
                    <p className="text-red-500">{error}</p>
                  ) : (
                    <TicketForm
                      ticket={ticket}
                      onSubmit={handleSubmit}
                      onCancel={onClose}
                      computers={computers}
                      networkDevices={networkDevices}
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

export default TicketModal;
