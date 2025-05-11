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
  assessmentHistory: AssessmentResult[]; // Changed from results to assessmentHistory to store multiple results
  latestResult: AssessmentResult | null; // To store the most recent single result if needed elsewhere
  setCurrentAssessment: (assessment: { type: AssessmentType; title: string; description: string }) => void;
  addResponse: (response: QuestionResponse) => void;
  addResultToHistory: (result: AssessmentResult) => void; // New action to add to history
  setLatestResult: (result: AssessmentResult | null) => void; // Action to set the latest single result
  resetAssessment: () => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      currentAssessment: null,
      responses: [],
      assessmentHistory: [], // Initialize as an empty array
      latestResult: null,    // Initialize as null
      setCurrentAssessment: (assessment) => set({ currentAssessment: assessment }),
      addResponse: (response) =>
        set((state) => ({
          responses: [...state.responses, response],
        })),
      addResultToHistory: (result) => // Implementation for the new action
        set((state) => ({
          assessmentHistory: [...state.assessmentHistory, result],
          latestResult: result, // Also update the latest result
        })),
      setLatestResult: (result) => set({ latestResult: result }), // Setter for latestResult
      resetAssessment: () =>
        set({ currentAssessment: null, responses: [], latestResult: null }), // Reset latestResult, keep history
    }),
    {
      name: 'assessment-store',
    }
  )
);