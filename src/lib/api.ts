import axios from 'axios';
import { Question, Response, ApiResponse, Statistics, CreateQuestionData, UpdateQuestionData } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Public API calls
export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/questions');
  return response.data.data;
};

export const submitResponse = async (data: Omit<Response, 'id' | 'created_at' | 'updated_at'>): Promise<Response> => {
  const response = await api.post<ApiResponse<Response>>('/responses', data);
  return response.data.data;
};

// Admin API calls
export const getAdminQuestions = async (): Promise<Question[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/admin/questions');
  return response.data.data;
};

export const createQuestion = async (data: CreateQuestionData): Promise<Question> => {
  const response = await api.post<ApiResponse<Question>>('/admin/questions', data);
  return response.data.data;
};

export const updateQuestion = async (id: number, data: UpdateQuestionData): Promise<Question> => {
  const response = await api.put<ApiResponse<Question>>(`/admin/questions/${id}`, data);
  return response.data.data;
};

export const deleteQuestion = async (id: number): Promise<void> => {
  await api.delete(`/admin/questions/${id}`);
};

export const getResponses = async (): Promise<Response[]> => {
  const response = await api.get<ApiResponse<Response[]>>('/admin/responses');
  return response.data.data;
};

export const getResponse = async (id: number): Promise<Response> => {
  const response = await api.get<ApiResponse<Response>>(`/admin/responses/${id}`);
  return response.data.data;
};

export const getStatistics = async (): Promise<Statistics> => {
  const response = await api.get<ApiResponse<Statistics>>('/admin/responses/statistics');
  return response.data.data;
};

export const exportResponses = async (): Promise<any[][]> => {
  const response = await api.get<ApiResponse<any[][]>>('/admin/responses/export');
  return response.data.data;
}; 