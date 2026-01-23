import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

const PowerBiModal = ({ isOpen, onClose }) => {
  const powerBiUrl = 'http://localhost:8000/api/reports/tickets/powerbi/';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(powerBiUrl);
    alert('URL copiada al portapapeles');
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
                  Conexión con Power BI
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-sm text-gray-500">
                    Utilice la siguiente URL como un origen de datos web en Power BI para obtener los datos de los tickets:
                  </p>
                  <div className="mt-2">
                    <input
                      type="text"
                      readOnly
                      value={powerBiUrl}
                      className="w-full bg-gray-100 border-gray-300 rounded-md shadow-sm"
                    />
                  </div>
                </div>

                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-900 hover:bg-indigo-200"
                    onClick={copyToClipboard}
                  >
                    Copiar URL
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-100 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-200"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PowerBiModal;
