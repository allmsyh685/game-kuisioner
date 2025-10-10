import axios from 'axios';
import { Question, ApiResponse, Statistics, CreateQuestionData, UpdateQuestionData, SubmitResponsePayload, ResponseMaster, AdminQuestionView } from '@/types';

const PRIMARY_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://kuisioner-api-production.up.railway.app/api';
const FALLBACK_API_URL = 'https://quitionnaireapi-production.up.railway.app/api';
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || '';

// Create axios instances for both APIs
const createApiInstance = (baseURL: string) => axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
    ...(API_TOKEN ? { 'Authorization': `Bearer ${API_TOKEN}` } : {}),
  },
});

const primaryApi = createApiInstance(PRIMARY_API_URL);
const fallbackApi = createApiInstance(FALLBACK_API_URL);

// Helper function to make API calls with fallback
const apiCallWithFallback = async <T>(
  apiCall: (api: typeof primaryApi) => Promise<T>
): Promise<T> => {
  try {
    return await apiCall(primaryApi);
  } catch (error) {
    console.warn('Primary API failed, trying fallback API:', error);
    try {
      return await apiCall(fallbackApi);
    } catch (fallbackError) {
      console.error('Both primary and fallback APIs failed:', fallbackError);
      throw fallbackError;
    }
  }
};

// Log detailed server errors to aid debugging in development/production
const setupErrorInterceptor = (apiInstance: typeof primaryApi, apiName: string) => {
  apiInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      const data = error?.response?.data;
      const method = error?.config?.method?.toUpperCase();
      const path = error?.config?.url || '';
      const url = `${apiInstance.defaults.baseURL}${path}`;
      const message = error?.message || 'Unknown error';
      // eslint-disable-next-line no-console
      console.error(`${apiName} API request failed:`, {
        status,
        method,
        url,
        message,
        data: typeof data === 'object' ? JSON.stringify(data) : data,
      });
      return Promise.reject(error);
    }
  );
};

setupErrorInterceptor(primaryApi, 'Primary');
setupErrorInterceptor(fallbackApi, 'Fallback');

// Public API calls
export const getQuestions = async (): Promise<Question[]> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<Question[]>>('/questions');
    return response.data.data;
  });
};

export const submitResponse = async (data: SubmitResponsePayload): Promise<ResponseMaster> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.post<ApiResponse<ResponseMaster>>('/responses', data);
    return response.data.data;
  });
};

// Admin API calls
export const getAdminQuestions = async (): Promise<AdminQuestionView[]> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<AdminQuestionView[]>>('/admin/questions');
    return response.data.data;
  });
};

export const createQuestion = async (data: CreateQuestionData): Promise<Question> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.post<ApiResponse<Question>>('/admin/questions', data);
    return response.data.data;
  });
};

export const updateQuestion = async (id: number, data: UpdateQuestionData): Promise<Question> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.put<ApiResponse<Question>>(`/admin/questions/${id}`, data);
    return response.data.data;
  });
};

export const deleteQuestion = async (id: number): Promise<void> => {
  return apiCallWithFallback(async (api) => {
    await api.delete(`/admin/questions/${id}`);
  });
};

export const getResponses = async (): Promise<ResponseMaster[]> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<ResponseMaster[]>>('/admin/responses');
    return response.data.data;
  });
};

export const getResponse = async (id: number): Promise<ResponseMaster> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<ResponseMaster & { answers: Array<{question_id:number;question_text:string;answer:string}> }>>(`/admin/responses/${id}`);
    return response.data.data;
  });
};

export const getStatistics = async (): Promise<Statistics> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<Statistics>>('/admin/responses/statistics');
    return response.data.data;
  });
};

export const exportResponses = async (): Promise<unknown[][]> => {
  return apiCallWithFallback(async (api) => {
    const response = await api.get<ApiResponse<unknown[][]>>('/admin/responses/export');
    return response.data.data;
  });
}; 