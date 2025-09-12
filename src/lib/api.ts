import axios from 'axios';
import { Question, ApiResponse, Statistics, CreateQuestionData, UpdateQuestionData, SubmitResponsePayload, ResponseMaster } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kuisioner-api-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
  },
});

// Log detailed server errors to aid debugging in development/production
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const data = error?.response?.data;
    const method = error?.config?.method?.toUpperCase();
    const path = error?.config?.url || '';
    const url = `${API_BASE_URL}${path}`;
    const message = error?.message || 'Unknown error';
    // eslint-disable-next-line no-console
    console.error('API request failed:', {
      status,
      method,
      url,
      message,
      data: typeof data === 'object' ? JSON.stringify(data) : data,
    });
    return Promise.reject(error);
  }
);

// Public API calls
export const getQuestions = async (): Promise<Question[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/questions');
  return response.data.data;
};

export const submitResponse = async (data: SubmitResponsePayload): Promise<ResponseMaster> => {
  const response = await api.post<ApiResponse<ResponseMaster>>('/responses', data);
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

export const getResponses = async (): Promise<ResponseMaster[]> => {
  const response = await api.get<ApiResponse<ResponseMaster[]>>('/admin/responses');
  return response.data.data;
};

export const getResponse = async (id: number): Promise<ResponseMaster> => {
  const response = await api.get<ApiResponse<ResponseMaster & { answers: Array<{question_id:number;question_text:string;answer:string}> }>>(`/admin/responses/${id}`);
  return response.data.data;
};

export const getStatistics = async (): Promise<Statistics> => {
  const response = await api.get<ApiResponse<Statistics>>('/admin/responses/statistics');
  return response.data.data;
};

export const exportResponses = async (): Promise<unknown[][]> => {
  const response = await api.get<ApiResponse<unknown[][]>>('/admin/responses/export');
  return response.data.data;
}; 