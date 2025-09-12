export interface QuestionOptionView {
  id: number;
  text: string;
  order: number;
}

export interface Question {
  id: number;
  question_text: string;
  options: QuestionOptionView[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SubmitResponsePayload {
  name: string;
  age: number;
  location: string;
  answers: Array<{
    question_id: number;
    option_id?: number;
    answer_text?: string;
  }>;
}

export interface ResponseMaster {
  id: number;
  name: string;
  age: number;
  location: string;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface Statistics {
  total_responses: number;
  education_statistics: Array<{
    education_level: string;
    count: number;
  }>;
  ai_usage_statistics: Array<{
    ai_usage_frequency: string;
    count: number;
  }>;
  ai_tool_statistics: Array<{
    ai_tool_used: string;
    count: number;
  }>;
}

export interface CreateQuestionData {
  question_text: string;
  options: string[];
  order: number;
  is_active?: boolean;
}

export interface UpdateQuestionData extends Partial<CreateQuestionData> {
  // Extends all properties from CreateQuestionData as optional
} 