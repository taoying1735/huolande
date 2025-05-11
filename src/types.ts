export type HollandCode = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface Question {
  id: number;
  text: string;
  type: HollandCode;
}

export interface Assessment {
  id: string;
  type: 'simple' | 'standard' | 'professional';
  questions: Question[];
  duration: string;
  description: string;
  title: string;
}

export interface UserResponse {
  questionId: number;
  answer: boolean;
}

export type AssessmentType = 'simple' | 'standard' | 'professional';

export interface AssessmentResult {
  id: string;
  userId: string;
  assessmentType: AssessmentType;
  responses: UserResponse[];
  hollandCode: string;
  timestamp: string;
  scores: Record<HollandCode, number>;
}

export interface HollandAnalysis {
  description: string;
  suggestion: {
    fields: string[];
    careers: string[];
    development: string[];
  };
  strengths?: string[];
  environments?: string[];
  teamworkStyle?: string;
  careerPath?: {
    entry: string;
    growth: string;
    established: string;
  };
}

export type QuestionResponse = {
  questionId: number;
  answer: boolean;
  questionType?: HollandCode;
};