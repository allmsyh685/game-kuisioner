'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Statistics } from '@/types';
import { getStatistics } from '@/lib/api';
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip } from 'recharts';
import { Users, FileText, BarChart3, Download, LogOut } from 'lucide-react';
import PasskeyAuth from '@/components/ui/PasskeyAuth';
import { BarChartComponent, BarChartLegend } from '@/components/charts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    const checkAuth = () => {
      const authStatus = sessionStorage.getItem('adminAuthenticated');
      if (authStatus === 'true') {
        setIsAuthenticated(true);
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for storage changes (when passkey is entered in another component)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminAuthenticated' && e.newValue === 'true') {
        setIsAuthenticated(true);
        setIsLoading(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also check periodically to catch sessionStorage changes
    const interval = setInterval(checkAuth, 100);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStatistics = async () => {
      try {
        const data = await getStatistics();
        setStatistics(data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, [isAuthenticated]);

  const handleAuthSuccess = () => {
    // Update local state immediately
    setIsAuthenticated(true);
    setIsLoading(false);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('adminAuthenticated');
    setIsAuthenticated(false);
    setStatistics(null);
    setLoading(true);
    // Redirect to admin main page
    window.location.href = '/admin';
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memverifikasi akses...</p>
        </div>
      </div>
    );
  }

  // Show passkey authentication if not authenticated
  if (!isAuthenticated) {
    return <PasskeyAuth onAuthSuccess={handleAuthSuccess} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data...</p>
        </div>
      </div>
    );
  }

  const PieLegend = (props: any) => {
    const { payload } = props || {};
    return (
      <ul className="mt-2 space-y-1">
        {(payload || []).map((entry: any, idx: number) => (
          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
            <span>{(entry && entry.payload && (entry.payload.name || entry.payload.label)) || entry.value}</span>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header with Logout Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Admin</h1>
            <p className="text-gray-600">Kelola survei dan lihat statistik respons</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Keluar
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Respons</p>
                <p className="text-2xl font-bold text-gray-900">{statistics?.total_responses || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pertanyaan</p>
                <p className="text-2xl font-bold text-gray-900">10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">10</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Download className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ekspor</p>
                <p className="text-2xl font-bold text-gray-900">CSV</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/admin/questions" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Kelola Pertanyaan</h3>
              </div>
              <p className="text-gray-600">Tambah, edit, atau hapus pertanyaan survey</p>
            </div>
          </Link>

          <Link href="/admin/responses" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Users className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Lihat Respons</h3>
              </div>
              <p className="text-gray-600">Lihat semua jawaban dari responden</p>
            </div>
          </Link>

          <Link href="/admin/export" className="block">
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Download className="w-5 h-5 text-orange-600" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Ekspor Data</h3>
              </div>
              <p className="text-gray-600">Unduh data dalam format CSV</p>
            </div>
          </Link>
        </div>

        {/* Charts - one per row for better label readability */}
        <div className="grid grid-cols-1 gap-8">
          {/* Education Level Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tingkat Pendidikan</h3>
            <ResponsiveContainer width="100%" height={340}>
              <PieChart margin={{ bottom: 24 }}>
                <Pie
                  data={statistics?.education_statistics || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => `${props?.payload?.education_level || ''} ${props?.percent ? (props.percent * 100).toFixed(0) : 0}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  nameKey="education_level"
                >
                  {statistics?.education_statistics.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" align="center" iconType="circle" content={<PieLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* AI Usage Frequency Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartComponent
              data={statistics?.ai_usage_statistics || []}
              dataKey="ai_usage_frequency"
              title="Frekuensi Pengisian Survey"
              colors={COLORS}
              height={300}
            />
            <BarChartLegend
              data={statistics?.ai_usage_statistics || []}
              dataKey="ai_usage_frequency"
              title="Detail Frekuensi Pengisian Survey"
              colors={COLORS}
            />
          </div>

          {/* AI Tool Usage Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarChartComponent
              data={statistics?.ai_tool_statistics || []}
              dataKey="ai_tool_used"
              title="Penerimaan terhadap integrasi unsur game (gamifikasi) dalam survei"
              colors={COLORS}
              height={300}
            />
            <BarChartLegend
              data={statistics?.ai_tool_statistics || []}
              dataKey="ai_tool_used"
              title="Detail Penerimaan Gamifikasi"
              colors={COLORS}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Survey baru diisi</p>
                  <p className="text-sm text-gray-600">2 menit yang lalu</p>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Data diexport</p>
                  <p className="text-sm text-gray-600">1 jam yang lalu</p>
                </div>
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Pertanyaan diupdate</p>
                  <p className="text-sm text-gray-600">3 jam yang lalu</p>
                </div>
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 