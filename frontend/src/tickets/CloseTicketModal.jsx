import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from "../api/axios";
import Spinner from '../components/Spinner';

const CloseTicketModal = ({ isOpen, onClose, ticket, onSave }) => {
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('evidences', files[i]);
    }

    try {
      await api.post(`/support/tickets/${ticket.id}/close/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      onSave();
      onClose();
    } catch (err) {
      console.error("Failed to close ticket", err.response?.data || err);
      setError(err.response?.data ? JSON.stringify(err.response.data) : "Failed to close ticket.");
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
                  Cerrar Ticket #{ticket?.id} y adjuntar evidencia
                </Dialog.Title>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                  
                  <div>
                    <label htmlFor="evidences" className="block text-sm font-medium text-gray-700">
                      Archivos de evidencia
                    </label>
                    <input
                      type="file"
                      name="evidences"
                      id="evidences"
                      onChange={handleFileChange}
                      multiple
                      className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button type="button" onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">
                      Cancelar
                    </button>
                    <button type="submit" disabled={submitting}
                            className="px-4 py-2 text-sm font-medium text-gray-800 bg-indigo-600 rounded-md hover:bg-indigo-700">
                      {submitting ? <Spinner /> : 'Cerrar Ticket'}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CloseTicketModal;
