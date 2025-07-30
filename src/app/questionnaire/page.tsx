'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Question } from '@/types';
import { getQuestions, submitResponse } from '@/lib/api';

const responseSchema = z.object({
  name: z.string().min(1, 'Nama harus diisi'),
  age: z.number().min(1, 'Usia harus diisi').max(120, 'Usia tidak valid'),
  location: z.string().min(1, 'Lokasi harus diisi'),
  education_level: z.enum(['smp', 'sma', 'mahasiswa', 'lainnya']),
  ai_usage_frequency: z.enum(['Beberapa kali dalam sebulan', 'Beberapa kali dalam seminggu', 'belum pernah', 'setiap hari']),
  ai_purpose: z.enum(['Pendidikan', 'pekerjaan', 'hiburan', 'Lainnya']),
  ai_tool_used: z.enum(['chatgpt', 'deepseek', 'grok', 'lainnya']),
  difficulty_without_ai: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
  anxiety_without_ai: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
  ai_important_routine: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
  more_productive_with_ai: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
  rely_on_ai_decisions: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
  ai_better_than_humans: z.enum(['benar sekali', 'benar', 'tidak benar', 'tidak benar sama sekali']),
});

type ResponseFormData = z.infer<typeof responseSchema>;

export default function QuestionnairePage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ResponseFormData>({
    resolver: zodResolver(responseSchema),
  });

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const onSubmit = async (data: ResponseFormData) => {
    setSubmitting(true);
    try {
      await submitResponse(data);
      setSubmitted(true);
      reset();
    } catch (error) {
      console.error('Error submitting response:', error);
      alert('Terjadi kesalahan saat mengirim jawaban. Silakan coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat pertanyaan...</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Terima Kasih!</h2>
          <p className="text-gray-600 mb-6">
            Jawaban Anda telah berhasil dikirim. Data Anda akan digunakan untuk penelitian tentang penggunaan AI.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Isi Survey Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Survey Penggunaan Teknologi AI
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Survey ini bertujuan untuk memahami bagaimana teknologi AI digunakan dalam kehidupan sehari-hari. 
              Data yang Anda berikan akan dijaga kerahasiaannya dan hanya digunakan untuk tujuan penelitian.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Personal Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Informasi Pribadi</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan nama lengkap"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Usia *
                  </label>
                  <input
                    type="number"
                    {...register('age', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Masukkan usia"
                  />
                  {errors.age && (
                    <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lokasi *
                  </label>
                  <input
                    type="text"
                    {...register('location')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Kota/Provinsi"
                  />
                  {errors.location && (
                    <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Questions */}
            {questions.map((question, index) => (
              <div key={question.id} className="bg-white border border-gray-200 rounded-xl p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {index + 1}. {question.question_text}
                </h3>
                <div className="space-y-3">
                  {question.options.map((option) => (
                    <label key={option} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        {...register(getFieldName(index))}
                        value={option}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
                {errors[getFieldName(index) as keyof typeof errors] && (
                  <p className="text-red-500 text-sm mt-2">
                    {errors[getFieldName(index) as keyof typeof errors]?.message}
                  </p>
                )}
              </div>
            ))}

            <div className="text-center">
              <button
                type="submit"
                disabled={submitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {submitting ? 'Mengirim...' : 'Kirim Jawaban'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function getFieldName(index: number): keyof ResponseFormData {
  const fieldNames: (keyof ResponseFormData)[] = [
    'education_level',
    'ai_usage_frequency',
    'ai_purpose',
    'ai_tool_used',
    'difficulty_without_ai',
    'anxiety_without_ai',
    'ai_important_routine',
    'more_productive_with_ai',
    'rely_on_ai_decisions',
    'ai_better_than_humans',
  ];
  return fieldNames[index];
} 