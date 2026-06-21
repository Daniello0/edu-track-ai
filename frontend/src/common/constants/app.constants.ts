/** Application display name. */
export const APP_NAME = 'EduTrack AI';

/** Default backend port when VITE_API_BASE_URL is not set. */
export const DEFAULT_API_PORT = 3001;

/** sessionStorage key for guest pending material. */
export const PENDING_MATERIAL_STORAGE_KEY = 'edutrack:pendingMaterial';

/** Lucide icon stroke width per UI spec. */
export const ICON_STROKE_WIDTH = 1.5;

/** Application route paths. */
export const APP_ROUTES = {
  HOME: '/',
  READER: '/reader',
  QUIZ: '/quiz',
  PROFILE: '/profile',
} as const;

/** Generic process failure message. */
export const PROCESS_FAILURE_MESSAGE =
  'Не удалось обработать видео. Попробуйте снова.';
