import { useEffect, useState } from "react";
import api from "./api/axios";
import Spinner from "./components/Spinner";
import TicketModal from "./tickets/TicketModal";
import CloseTicketModal from "./tickets/CloseTicketModal";
import PowerBiModal from "./tickets/PowerBiModal";
import { PencilIcon, TrashIcon, XCircleIcon, PaperClipIcon } from '@heroicons/react/24/outline';

const Tickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
  const [isPowerBiModalOpen, setIsPowerBiModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketToClose, setTicketToClose] = useState(null);

  const fetchTickets = async () => {
    try {
      const response = await api.get("/support/tickets/");
      setTickets(response.data);
    } catch (err) {
      setError("Failed to fetch tickets.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleAddTicket = () => {
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleEditTicket = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleCloseTicket = (ticket) => {
    setTicketToClose(ticket);
    setIsCloseModalOpen(true);
  };

  const handleDeleteTicket = async (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      try {
        await api.delete(`/support/tickets/${id}/`);
        fetchTickets();
      } catch (err) {
        setError("Failed to delete ticket.");
        console.error(err);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const handleCloseModalClose = () => {
    setIsCloseModalOpen(false);
    setTicketToClose(null);
  };

  const handlePowerBiModalOpen = () => {
    setIsPowerBiModalOpen(true);
  };

  const handlePowerBiModalClose = () => {
    setIsPowerBiModalOpen(false);
  };

  const handleTicketSaved = () => {
    fetchTickets();
  };

  const handleExport = async (format) => {
    try {
      const extension = format === 'excel' ? 'xlsx' : format;
      const response = await api.get(`http://localhost:8000/api/reports/tickets/${format}/`, {
        responseType: 'blob', // Important for downloading files
      });

      const contentDisposition = response.headers['content-disposition'];
      let filename = `tickets_report.${extension}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(`Failed to export ${format} report:`, err);
      setError(`Failed to export ${format} report.`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 sm:p-4 md:p-6">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold leading-tight">Tickets de Soporte</h2>
          <div className="flex space-x-2 flex-wrap justify-end">
            <button
              onClick={() => handleExport('pdf')}
              className="bg-red-500 text-gray-800 px-4 py-2 rounded-md hover:bg-red-600 mb-2 sm:mb-0"
            >
              Exportar a PDF
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="bg-green-500 text-gray-800 px-4 py-2 rounded-md hover:bg-green-600 mb-2 sm:mb-0"
            >
              Exportar a Excel
            </button>
            <button
              onClick={handlePowerBiModalOpen}
              className="bg-yellow-500 text-gray-800 px-4 py-2 rounded-md hover:bg-yellow-600 mb-2 sm:mb-0"
            >
              Power BI
            </button>
            <button
              onClick={handleAddTicket}
              className="bg-indigo-600 text-gray-800 px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Nuevo Ticket
            </button>
          </div>
        </div>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                    Título
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                    Estado
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[100px]">
                    Prioridad
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                    Creado por
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[120px]">
                    Evidencias
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
                    Creado el
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-sm font-semibold text-gray-600 uppercase tracking-wider min-w-[150px]">
                    Cerrado el
                  </th>
                  <th className="px-4 py-3 sm:px-5 sm:py-3 border-b-2 border-gray-200 bg-gray-100 min-w-[150px]"></th> {/* Actions */}
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{ticket.title}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                       <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${
                            ticket.status === 'open' ? 'text-blue-900 bg-blue-200' :
                            ticket.status === 'in_progress' ? 'text-yellow-900 bg-yellow-200' :
                            ticket.status === 'closed' ? 'text-gray-900 bg-gray-200' :
                            'text-red-900 bg-red-200'
                        }`}>
                        <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${
                            ticket.status === 'open' ? 'bg-blue-200' :
                            ticket.status === 'in_progress' ? 'bg-yellow-200' :
                            ticket.status === 'closed' ? 'bg-gray-200' :
                            'bg-red-200'
                        }`}></span>
                        <span className="relative">{ticket.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{ticket.priority}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{ticket.created_by}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      {ticket.evidences && ticket.evidences.length > 0 ? (
                        <div className="flex flex-col">
                          {ticket.evidences.map(evidence => (
                            <a key={evidence.id} href={evidence.file} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900 flex items-center">
                              <PaperClipIcon className="w-4 h-4 mr-1" />
                              {evidence.file.split('/').pop()}
                            </a>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 whitespace-no-wrap">N/A</p>
                      )}
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{formatDate(ticket.created_at)}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">{formatDate(ticket.closed_at)}</p>
                    </td>
                    <td className="px-4 py-3 sm:px-5 sm:py-3 border-b border-gray-200 bg-white text-sm text-right">
                      <div className="flex justify-end items-center">
                        <button onClick={() => handleEditTicket(ticket)} className="text-indigo-600 hover:text-indigo-900 mr-3 flex items-center">
                          <PencilIcon className="w-5 h-5 mr-1" /> Editar
                        </button>
                        {ticket.status !== 'closed' && (
                            <button onClick={() => handleCloseTicket(ticket)} className="text-gray-600 hover:text-gray-900 mr-3 flex items-center">
                                <XCircleIcon className="w-5 h-5 mr-1" /> Cerrar
                            </button>
                        )}
                        <button onClick={() => handleDeleteTicket(ticket.id)} className="text-red-600 hover:text-red-900 flex items-center">
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

      <TicketModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        ticket={selectedTicket}
        onSave={handleTicketSaved}
      />
      
      {ticketToClose && (
        <CloseTicketModal
          isOpen={isCloseModalOpen}
          onClose={handleCloseModalClose}
          ticket={ticketToClose}
          onSave={() => {
            handleTicketSaved();
            handleCloseModalClose();
          }}
        />
      )}

      <PowerBiModal
        isOpen={isPowerBiModalOpen}
        onClose={handlePowerBiModalClose}
      />
    </div>
  );
};

export default Tickets;
