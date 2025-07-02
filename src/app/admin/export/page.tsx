'use client';

import { useState } from 'react';
import { exportResponses } from '@/lib/api';
import { Download, FileText, Users } from 'lucide-react';

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const data = await exportResponses();
      
      // Convert data to CSV format
      const csvContent = data.map(row => row.join(',')).join('\n');
      
      // Create and download file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `questionnaire_responses_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Data berhasil diexport!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Terjadi kesalahan saat mengexport data');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Export Data</h1>
          <p className="text-gray-600">Download semua data responses dalam format CSV</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Download className="w-8 h-8 text-blue-600" />
            </div>
            
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Export Responses Survey
            </h2>
            
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Klik tombol di bawah untuk mengunduh semua data responses dalam format CSV. 
              File akan berisi informasi lengkap dari semua responden termasuk data pribadi 
              dan jawaban survey mereka.
            </p>

            <button
              onClick={handleExport}
              disabled={exporting}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center mx-auto"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Mengexport...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </>
              )}
            </button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <FileText className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Format CSV</h3>
              <p className="text-sm text-gray-600">Data dalam format yang mudah dibaca</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Users className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Semua Data</h3>
              <p className="text-sm text-gray-600">Informasi lengkap responden</p>
            </div>
            
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <Download className="w-8 h-8 text-gray-600 mx-auto mb-2" />
              <h3 className="font-medium text-gray-900 mb-1">Download Cepat</h3>
              <p className="text-sm text-gray-600">Proses export yang cepat</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">Informasi File CSV</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• File akan berisi semua kolom data responses</li>
              <li>• Format tanggal: YYYY-MM-DD HH:MM:SS</li>
              <li>• Encoding: UTF-8</li>
              <li>• Nama file: questionnaire_responses_YYYY-MM-DD.csv</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 