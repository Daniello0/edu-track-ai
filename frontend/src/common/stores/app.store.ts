import { create } from 'zustand';
import { ProcessStep } from '../enums/process-step.enum';
import { Theme } from '../enums/theme.enum';
import type { ReaderState } from '../types/app.types';

interface AppState {
  currentProcess: {
    isLoading: boolean;
    step: ProcessStep;
    error: string | null;
  };
  reader: ReaderState;
  theme: Theme;
  user: {
    id: string | null;
    email: string | null;
  };
  auth: {
    accessToken: string | null;
    refreshToken: string | null;
  };
  setProcessLoading: (isLoading: boolean, step?: ProcessStep) => void;
  setProcessError: (error: string | null) => void;
  setReaderMaterial: (reader: ReaderState) => void;
  resetReader: () => void;
}

const emptyReader = (): ReaderState => ({
  materialId: null,
  pendingId: null,
  videoId: null,
  title: null,
  content: null,
  category: null,
  format: null,
  summaryLength: null,
  language: null,
  quiz: null,
  isPersisted: false,
});

/**
 * Global UI state store (process pipeline, reader, auth, theme).
 */
export const useAppStore = create<AppState>((set) => ({
  currentProcess: {
    isLoading: false,
    step: ProcessStep.IDLE,
    error: null,
  },
  reader: emptyReader(),
  theme: Theme.LIGHT,
  user: {
    id: null,
    email: null,
  },
  auth: {
    accessToken: null,
    refreshToken: null,
  },
  setProcessLoading: (isLoading, step = ProcessStep.IDLE) =>
    set((state) => ({
      currentProcess: {
        ...state.currentProcess,
        isLoading,
        step,
        error: isLoading ? null : state.currentProcess.error,
      },
    })),
  setProcessError: (error) =>
    set((state) => ({
      currentProcess: {
        ...state.currentProcess,
        isLoading: false,
        step: ProcessStep.IDLE,
        error,
      },
    })),
  setReaderMaterial: (reader) =>
    set((state) => ({
      reader,
      currentProcess: {
        ...state.currentProcess,
        isLoading: false,
        step: ProcessStep.COMPLETED,
        error: null,
      },
    })),
  resetReader: () =>
    set((state) => ({
      reader: emptyReader(),
      currentProcess: {
        ...state.currentProcess,
        step: ProcessStep.IDLE,
      },
    })),
}));
