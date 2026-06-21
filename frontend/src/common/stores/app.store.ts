import { create } from 'zustand';
import { AuthModalVariant } from '../enums/auth-modal-variant.enum';
import { ProcessStep } from '../enums/process-step.enum';
import { Theme } from '../enums/theme.enum';
import { THEME_STORAGE_KEY } from '../constants/ui.constants';
import type { AuthSessionResponse } from '../../features/auth/auth.types';
import {
  clearPersistedAuthSession,
  mapSessionResponseToStorePayload,
  persistAuthSession,
  readPersistedAuthSession,
} from '../../features/auth/auth.utils';
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
  authModal: {
    isOpen: boolean;
    variant: AuthModalVariant;
  };
  setProcessLoading: (isLoading: boolean, step?: ProcessStep) => void;
  setProcessError: (error: string | null) => void;
  setReaderMaterial: (reader: ReaderState) => void;
  resetReader: () => void;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  setAuthSession: (session: AuthSessionResponse) => void;
  clearAuth: () => void;
  hydrateAuthFromStorage: () => void;
  openAuthModal: (variant: AuthModalVariant) => void;
  closeAuthModal: () => void;
  markReaderPersisted: (materialId: string) => void;
}

const readStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return stored === Theme.DARK ? Theme.DARK : Theme.LIGHT;
};

const emptyAuthUser = () => ({
  id: null as string | null,
  email: null as string | null,
});

const emptyAuthTokens = () => ({
  accessToken: null as string | null,
  refreshToken: null as string | null,
});

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
  theme: readStoredTheme(),
  user: emptyAuthUser(),
  auth: emptyAuthTokens(),
  authModal: {
    isOpen: false,
    variant: AuthModalVariant.LOGIN,
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
  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.dataset.theme = theme;
    set({ theme });
  },
  toggleTheme: () =>
    set((state) => {
      const nextTheme = state.theme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT;
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      return { theme: nextTheme };
    }),
  setAuthSession: (session) => {
    const payload = mapSessionResponseToStorePayload(session);
    persistAuthSession({
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      user: session.user,
    });
    set(payload);
  },
  clearAuth: () => {
    clearPersistedAuthSession();
    set({
      user: emptyAuthUser(),
      auth: emptyAuthTokens(),
    });
  },
  hydrateAuthFromStorage: () => {
    const stored = readPersistedAuthSession();
    if (stored === null) {
      return;
    }

    set({
      user: {
        id: stored.user.id,
        email: stored.user.email,
      },
      auth: {
        accessToken: stored.accessToken,
        refreshToken: stored.refreshToken,
      },
    });
  },
  openAuthModal: (variant) =>
    set({
      authModal: {
        isOpen: true,
        variant,
      },
    }),
  closeAuthModal: () =>
    set((state) => ({
      authModal: {
        ...state.authModal,
        isOpen: false,
      },
    })),
  markReaderPersisted: (materialId) =>
    set((state) => ({
      reader: {
        ...state.reader,
        materialId,
        pendingId: null,
        isPersisted: true,
      },
    })),
}));
