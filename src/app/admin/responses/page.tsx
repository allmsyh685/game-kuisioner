'use client';

import { useState, useEffect } from 'react';
import { ResponseMaster } from '@/types';
import { getResponses, getResponse } from '@/lib/api';
import { Eye } from 'lucide-react';
import AdminProtected from '@/components/ui/AdminProtected';

export default function ResponsesPage() {
  const [responses, setResponses] = useState<ResponseMaster[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<ResponseMaster | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Accent styles used to visually separate each Q&A item in the modal
  const ACCENTS = [
    { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-800', chipBorder: 'border-blue-200' },
    { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-800', chipBorder: 'border-green-200' },
    { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-800', chipBorder: 'border-purple-200' },
    { border: 'border-amber-500', bg: 'bg-amber-50', text: 'text-amber-800', chipBorder: 'border-amber-200' },
    { border: 'border-rose-500', bg: 'bg-rose-50', text: 'text-rose-800', chipBorder: 'border-rose-200' },
  ];

  useEffect(() => {
    fetchResponses();
  }, []);

  const fetchResponses = async () => {
    try {
      const data = await getResponses();
      setResponses(data);
    } catch (error) {
      console.error('Error fetching responses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResponse = async (response: ResponseMaster) => {
    try {
      const full = await getResponse(response.id);
      setSelectedResponse(full);
      setShowModal(true);
    } catch (e) {
      console.error('Failed to load response detail', e);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminProtected title="Responses Survey" description="Lihat semua jawaban dari responden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat responses...</p>
        </div>
      </AdminProtected>
    );
  }

  return (
    <AdminProtected title="Responses Survey" description="Lihat semua jawaban dari responden">
      <div className="space-y-6">
        {/* Header with Total Count */}
        <div className="flex justify-between items-center">
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
          </div>
        </div>

        {/* Responses Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nama
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Usia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Lokasi
                  </th>
                  
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response, index) => (
                  <tr key={response.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {response.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.age} tahun
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.location}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(response.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleViewResponse(response)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Response Detail Modal */}
        {showModal && selectedResponse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Detail Response - {selectedResponse.name}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Pribadi</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Nama</label>
                      <p className="text-gray-900">{selectedResponse.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Usia</label>
                      <p className="text-gray-900">{selectedResponse.age} tahun</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lokasi</label>
                      <p className="text-gray-900">{selectedResponse.location}</p>
                    </div>
                  </div>
                </div>
                {/* Answers List */}
                <div className="md:col-span-2 bg-white rounded-lg p-4 border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Jawaban</h3>
                  <div className="space-y-4">
                    {(selectedResponse as any).answers?.map((a: any, idx: number) => {
                      const accent = ACCENTS[idx % ACCENTS.length];
                      return (
                        <div
                          key={idx}
                          className={`rounded-xl p-4 border-l-4 ${accent.border} ${accent.bg}`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1 pr-4">
                              <p className="text-xs uppercase tracking-wide text-gray-500">Pertanyaan</p>
                              <p className="text-gray-900 font-medium leading-relaxed">{a.question_text}</p>
                            </div>
                            <span
                              className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-white ${accent.text} ${accent.chipBorder} border`}
                            >
                              Jawaban
                            </span>
                          </div>
                          <div className="mt-3">
                            <p className="text-gray-900">{a.answer || '-'}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Timestamp */}
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-500">
                    <p>Dikirim pada: {formatDate(selectedResponse.created_at)}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminProtected>
  );
} 