import React from 'react';
import api from '../api/axios'; // Assuming you have an axios instance

const AdminPanel = () => {

  const handleDownloadExcel = async () => {
    try {
      const response = await api.get('/reports/inventory/excel/', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory_report.xlsx');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Excel report:', error);
      alert('Error al descargar el informe de Excel.');
    }
  };

  const handleDownloadComputerPdf = async () => {
    try {
      const response = await api.get('/reports/inventory/pdf/', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'computer_inventory_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Computer PDF report:', error);
      alert('Error al descargar el informe PDF de computadoras.');
    }
  };

    const handleDownloadTicketsPdf = async () => {
    try {
      const response = await api.get('/reports/tickets/pdf/', {
        responseType: 'blob', // Important for downloading files
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'tickets_report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading Tickets PDF report:', error);
      alert('Error al descargar el informe PDF de tickets.');
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Panel de Administración</h1>

      {/* Report Generation Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Generación de Informes</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Excel Report */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Inventario en Excel</h3>
            <p className="text-gray-600">Descargar un informe completo del inventario (computadoras y equipos de red) en formato Excel.</p>
            <button
              onClick={handleDownloadExcel}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200"
            >
              Descargar Excel
            </button>
          </div>

          {/* Computer Inventory PDF */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Inventario de Computadoras en PDF</h3>
            <p className="text-gray-600">Obtener un informe detallado del inventario de computadoras en formato PDF.</p>
            <button
              onClick={handleDownloadComputerPdf}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Descargar PDF (Computadoras)
            </button>
          </div>

          {/* Tickets PDF */}
          <div className="flex flex-col space-y-3">
            <h3 className="text-lg font-medium text-gray-700">Informes de Tickets en PDF</h3>
            <p className="text-gray-600">Descargar un informe de todos los tickets de soporte en formato PDF.</p>
            <button
              onClick={handleDownloadTicketsPdf}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200"
            >
              Descargar PDF (Tickets)
            </button>
          </div>
        </div>
      </div>

      {/* Power BI Integration Section */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Integración con Power BI</h2>
        <p className="text-gray-600 mb-4">
          Para conectar Power BI a los datos de inventario, utilice la siguiente URL de API.
          Esta API devolverá los datos en formato JSON, que puede ser importado y transformado en Power BI.
        </p>
        <div className="bg-gray-50 p-4 rounded-md font-mono text-sm text-gray-800 break-all">
          <code>http://127.0.0.1:8000/api/reports/inventory/powerbi/</code>
        </div>
        <p className="text-gray-600 mt-4">
          Asegúrese de configurar la autenticación adecuada (Token Web JSON) en Power BI para acceder a este endpoint.
        </p>
      </div>

    </div>
  );
};

export default AdminPanel;