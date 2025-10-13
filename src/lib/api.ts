import axios from 'axios';
import { Question, ApiResponse, Statistics, CreateQuestionData, UpdateQuestionData, SubmitResponsePayload, ResponseMaster, AdminQuestionView } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kuisioner-api-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
  },
});

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
export const getAdminQuestions = async (): Promise<AdminQuestionView[]> => {
  const response = await api.get<ApiResponse<Question[]>>('/admin/questions');
  // Map backend Question (with structured options) to AdminQuestionView (options as strings)
  return response.data.data.map((q) => ({
    id: q.id,
    question_text: q.question_text,
    options: q.options.map((o) => o.text),
    order: q.order,
    is_active: q.is_active,
    created_at: q.created_at,
    updated_at: q.updated_at,
  }));
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