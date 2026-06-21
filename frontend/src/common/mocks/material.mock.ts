import { Language } from '../enums/language.enum';
import { MaterialCategory } from '../enums/material-category.enum';
import { MaterialFormat } from '../enums/material-format.enum';
import { MaterialStatus } from '../enums/material-status.enum';
import type { ReaderState } from '../types/app.types';

/** Mock reader content for UI prototyping. */
export const MOCK_READER_STATE: ReaderState = {
  materialId: '00000000-0000-4000-8000-000000000001',
  pendingId: null,
  videoId: 'dQw4w9WgXcQ',
  title: 'Введение в алгоритмы и структуры данных',
  content: `## Основные понятия

Алгоритм — это последовательность шагов для решения задачи. Структура данных определяет, как информация организована в памяти.

### Сложность алгоритмов

- **O(1)** — константное время
- **O(log n)** — логарифмическое время
- **O(n)** — линейное время

> Понимание сложности помогает выбирать оптимальные решения при работе с большими объёмами данных.

### Структуры данных

1. **Массивы** — непрерывное хранение элементов
2. **Связные списки** — динамическое связывание узлов
3. **Хеш-таблицы** — быстрый доступ по ключу

Эти концепции лежат в основе большинства современных приложений.`,
  category: MaterialCategory.PROGRAMMING,
  format: MaterialFormat.NARRATIVE,
  summaryLength: null,
  language: Language.RU,
  quiz: [
    {
      question: 'Что описывает нотация O(n)?',
      options: [
        'Константное время',
        'Линейное время',
        'Экспоненциальное время',
      ],
    },
    {
      question: 'Какая структура обеспечивает O(1) доступ по ключу?',
      options: ['Связный список', 'Хеш-таблица', 'Очередь'],
    },
  ],
  isPersisted: true,
};

/** Mock library item for profile page cards. */
export interface MockLibraryItem {
  id: string;
  videoId: string;
  title: string;
  category: MaterialCategory;
  status: MaterialStatus;
  lastViewedAt: string;
}

/** Mock library list for profile UI. */
export const MOCK_LIBRARY_ITEMS: MockLibraryItem[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    videoId: 'dQw4w9WgXcQ',
    title: 'Введение в алгоритмы и структуры данных',
    category: MaterialCategory.PROGRAMMING,
    status: MaterialStatus.READ,
    lastViewedAt: '2026-06-20T14:30:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    videoId: 'abc123xyz',
    title: 'Основы линейной алгебры',
    category: MaterialCategory.MATHEMATICS,
    status: MaterialStatus.MASTERED,
    lastViewedAt: '2026-06-18T09:15:00Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000003',
    videoId: 'xyz789abc',
    title: 'Квантовая физика для начинающих',
    category: MaterialCategory.SCIENCE,
    status: MaterialStatus.RETAKE,
    lastViewedAt: '2026-06-15T18:45:00Z',
  },
];

/** Mock dashboard stats for profile page. */
export const MOCK_PROFILE_STATS = {
  minutesStudied: 247,
  quizzesCompleted: 12,
  favoriteCategory: MaterialCategory.PROGRAMMING,
} as const;
