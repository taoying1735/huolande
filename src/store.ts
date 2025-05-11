import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Assessment, UserResponse, AssessmentResult, AssessmentType, QuestionResponse } from './types';

interface AssessmentStore {
  currentAssessment: {
    type: AssessmentType;
    title: string;
    description: string;
  } | null;
  responses: QuestionResponse[];
  results: AssessmentResult | null;
  setCurrentAssessment: (assessment: { type: AssessmentType; title: string; description: string }) => void;
  addResponse: (response: QuestionResponse) => void;
  setResults: (results: AssessmentResult) => void;
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      currentAssessment: null,
      responses: [],
      results: null,
      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
      addResponse: (response) =>
        set((state) => ({
          responses: [...state.responses, response],
        })),
      setResults: (results) => set({ results }),
      resetAssessment: () =>
        set({ currentAssessment: null, responses: [], results: null }),
    }),
    {
      name: 'assessment-store',
    }
  )
);