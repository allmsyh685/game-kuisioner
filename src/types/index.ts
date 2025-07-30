export interface Question {
  id: number;
  question_text: string;
  options: string[];
  order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Response {
  id: number;
  name: string;
  age: number;
  location: string;
  education_level: 'smp' | 'sma' | 'mahasiswa' | 'lainnya';
  ai_usage_frequency: 'Beberapa kali dalam sebulan' | 'Beberapa kali dalam seminggu' | 'belum pernah' | 'setiap hari';
  ai_purpose: 'Pendidikan' | 'pekerjaan' | 'hiburan' | 'Lainnya';
  ai_tool_used: 'chatgpt' | 'deepseek' | 'grok' | 'lainnya';
  difficulty_without_ai: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
  anxiety_without_ai: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
  ai_important_routine: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
  more_productive_with_ai: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
  rely_on_ai_decisions: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
  ai_better_than_humans: 'benar sekali' | 'benar' | 'tidak benar' | 'tidak benar sama sekali';
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