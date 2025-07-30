'use client';

import { useState, useEffect } from 'react';
import { Response } from '@/types';
import { getResponses } from '@/lib/api';
import { Eye } from 'lucide-react';

export default function ResponsesPage() {
  const [responses, setResponses] = useState<Response[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleViewResponse = (response: Response) => {
    setSelectedResponse(response);
    setShowModal(true);
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat responses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Responses Survey</h1>
            <p className="text-gray-600">Lihat semua jawaban dari responden</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Responses</p>
            <p className="text-2xl font-bold text-gray-900">{responses.length}</p>
          </div>
        </div>

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
                    Pendidikan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    AI Tool
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {response.education_level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {response.ai_tool_used}
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
                    <div>
                      <label className="text-sm font-medium text-gray-600">Pendidikan</label>
                      <p className="text-gray-900">{selectedResponse.education_level}</p>
                    </div>
                  </div>
                </div>

                {/* AI Usage Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Penggunaan AI</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Frekuensi Penggunaan</label>
                      <p className="text-gray-900">{selectedResponse.ai_usage_frequency}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Tujuan Penggunaan</label>
                      <p className="text-gray-900">{selectedResponse.ai_purpose}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">AI Tool yang Digunakan</label>
                      <p className="text-gray-900">{selectedResponse.ai_tool_used}</p>
                    </div>
                  </div>
                </div>

                {/* Survey Responses */}
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Jawaban Survey</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600">Kesulitan tanpa AI</label>
                      <p className="text-gray-900">{selectedResponse.difficulty_without_ai}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Kecemasan tanpa AI</label>
                      <p className="text-gray-900">{selectedResponse.anxiety_without_ai}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">AI penting dalam rutinitas</label>
                      <p className="text-gray-900">{selectedResponse.ai_important_routine}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Lebih produktif dengan AI</label>
                      <p className="text-gray-900">{selectedResponse.more_productive_with_ai}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">Mengandalkan AI untuk keputusan</label>
                      <p className="text-gray-900">{selectedResponse.rely_on_ai_decisions}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600">AI lebih baik dari manusia</label>
                      <p className="text-gray-900">{selectedResponse.ai_better_than_humans}</p>
                    </div>
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
    </div>
  );
} 