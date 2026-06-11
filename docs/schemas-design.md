# Design Schemas: EduTrack AI

> **Источник истины по коду:** [.cursor/rules/project-conventions.mdc](../.cursor/rules/project-conventions.mdc)  
> **Продукт и архитектура:** [main-design.md](./main-design.md)  
> **UI/UX:** [ui-ux-design.md](./ui-ux-design.md)

Единый справочник структур данных: БД, API, AI-ответы, компоненты и состояние UI.

## 1. Enums

| Enum | Значения | Использование |
| :--- | :--- | :--- |
| `MaterialFormat` | `narrative`, `summary` | Формат обработанного текста |
| `SummaryLength` | `short`, `medium`, `long` | Объём саммари (только при `format: summary`) |
| `Language` | `ru`, `en`, `original` | Язык вывода контента |
| `MaterialStatus` | `read`, `retake`, `mastered` | Статус усвоения материала |
| `ProcessStep` | `idle`, `transcribing`, `ai_processing`, `completed` | Шаг pipeline на фронтенде |

**Соглашения по именованию:**
- PostgreSQL: `snake_case`
- JSON API и TypeScript: `camelCase`

---

## 2. Database Schema (PostgreSQL)

Идентификаторы — `uuid`, генерируются через `uuid_generate_v4()`.

### Table: `users`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` |
| `email` | `varchar(255)` | `UNIQUE, NOT NULL` |
| `password_hash` | `varchar(255)` | `NOT NULL` |
| `created_at` | `timestamptz` | `DEFAULT now()` |

### Table: `materials`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` |
| `user_id` | `uuid` | `FOREIGN KEY REFERENCES users(id) ON DELETE CASCADE, NOT NULL` |
| `video_id` | `varchar(50)` | `NOT NULL` |
| `title` | `varchar(255)` | `NOT NULL` |
| `content` | `text` | `NOT NULL` |
| `category` | `varchar(50)` | `NOT NULL` |
| `format` | `material_format` | `NOT NULL` |
| `summary_length` | `summary_length` | `NULLABLE` (только для `summary`) |
| `language` | `varchar(10)` | `NOT NULL` |
| `status` | `material_status` | `NOT NULL, DEFAULT 'read'` |
| `created_at` | `timestamptz` | `DEFAULT now()` |
| `last_viewed_at` | `timestamptz` | `DEFAULT now()` |

**Индекс:** `UNIQUE (user_id, video_id, format, summary_length, language)` — один материал на комбинацию настроек.

### Table: `quizzes`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` |
| `material_id` | `uuid` | `FOREIGN KEY REFERENCES materials(id) ON DELETE CASCADE, UNIQUE` |
| `questions` | `jsonb` | `NOT NULL` |
| `best_score` | `integer` | `DEFAULT 0, CHECK (best_score >= 0 AND best_score <= 100)` |

**Структура `questions` (JSONB):**

```json
[
  {
    "question": "string",
    "options": ["string"],
    "correctAnswerIndex": 0
  }
]
```

### Table: `quiz_attempts`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` |
| `quiz_id` | `uuid` | `FOREIGN KEY REFERENCES quizzes(id) ON DELETE CASCADE` |
| `score` | `integer` | `NOT NULL, CHECK (score >= 0 AND score <= 100)` |
| `answers` | `jsonb` | `NOT NULL` |
| `created_at` | `timestamptz` | `DEFAULT now()` |

**Структура `answers` (JSONB):**

```json
[
  {
    "questionIndex": 0,
    "selectedAnswerIndex": 1,
    "isCorrect": false
  }
]
```

### Table: `processing_cache`

| Column | Type | Constraints |
| :--- | :--- | :--- |
| `id` | `uuid` | `PRIMARY KEY, DEFAULT uuid_generate_v4()` |
| `video_id` | `varchar(50)` | `NOT NULL` |
| `settings_hash` | `varchar(64)` | `NOT NULL` |
| `title` | `varchar(255)` | `NOT NULL` |
| `content` | `text` | `NOT NULL` |
| `category` | `varchar(50)` | `NOT NULL` |
| `quiz` | `jsonb` | `NULLABLE` |
| `created_at` | `timestamptz` | `DEFAULT now()` |
| `expires_at` | `timestamptz` | `NOT NULL` |

**Индекс:** `UNIQUE (video_id, settings_hash)`.

`settings_hash` — SHA-256 от канонического JSON настроек обработки.

---

## 3. API JSON Schemas

### POST `/api/auth/register`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "string (min 8)"
}
```

**Response (201):**

```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

### POST `/api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "string"
}
```

**Response (200):**

```json
{
  "id": "uuid",
  "email": "user@example.com"
}
```

### POST `/api/process`

**Request:**

```json
{
  "videoUrl": "https://www.youtube.com/watch?v=VIDEO_ID",
  "settings": {
    "format": "narrative",
    "summaryLength": "medium",
    "language": "ru",
    "hasQuiz": true,
    "quizQuestionsCount": 5,
    "quizOptionsCount": 4
  }
}
```

| Поле | Тип | Правила |
| :--- | :--- | :--- |
| `format` | `MaterialFormat` | Обязательно |
| `summaryLength` | `SummaryLength` | Обязательно при `format: summary`, иначе `null` |
| `language` | `Language` | Обязательно |
| `hasQuiz` | `boolean` | Обязательно |
| `quizQuestionsCount` | `number` | 1–10, обязательно при `hasQuiz: true` |
| `quizOptionsCount` | `number` | 3–5, обязательно при `hasQuiz: true` |

**Response (200):**

```json
{
  "id": "uuid",
  "videoId": "VIDEO_ID",
  "title": "string",
  "content": "string (markdown)",
  "category": "string",
  "format": "narrative",
  "summaryLength": null,
  "language": "ru",
  "quiz": [
    {
      "question": "string",
      "options": ["string"],
      "correctAnswerIndex": 0
    }
  ]
}
```

`quiz` — `null`, если `hasQuiz: false`.

### GET `/api/library`

**Response (200):**

```json
{
  "items": [
    {
      "id": "uuid",
      "videoId": "VIDEO_ID",
      "title": "string",
      "category": "string",
      "format": "summary",
      "status": "read",
      "bestScore": 80,
      "createdAt": "2026-06-11T10:00:00Z",
      "lastViewedAt": "2026-06-11T12:00:00Z"
    }
  ]
}
```

### POST `/api/library`

**Request:**

```json
{
  "videoId": "VIDEO_ID",
  "title": "string",
  "content": "string",
  "category": "string",
  "format": "narrative",
  "summaryLength": null,
  "language": "ru",
  "quiz": [
    {
      "question": "string",
      "options": ["string"],
      "correctAnswerIndex": 0
    }
  ]
}
```

**Response (201):** объект материала с `id` и `status: "read"`.

### GET `/api/library/:id`

**Response (200):**

```json
{
  "id": "uuid",
  "videoId": "VIDEO_ID",
  "title": "string",
  "content": "string",
  "category": "string",
  "format": "narrative",
  "summaryLength": null,
  "language": "ru",
  "status": "read",
  "quiz": {
    "id": "uuid",
    "questions": [],
    "bestScore": 0,
    "attempts": [
      {
        "id": "uuid",
        "score": 60,
        "createdAt": "2026-06-11T10:00:00Z"
      }
    ]
  },
  "createdAt": "2026-06-11T10:00:00Z",
  "lastViewedAt": "2026-06-11T12:00:00Z"
}
```

### PATCH `/api/library/:id/status`

**Request:**

```json
{
  "status": "mastered"
}
```

**Response (200):** обновлённый объект материала (без `content` и `quiz`).

### DELETE `/api/library/:id`

**Response (204):** без тела.

### Error Response (все endpoints)

```json
{
  "statusCode": 400,
  "message": "Описание ошибки",
  "error": "Bad Request"
}
```

---

## 4. AI Structured Output (Groq)

AI возвращает строго валидный JSON. Бэкенд маппит `processedText` → `content`, `correctIndex` → `correctAnswerIndex`.

```json
{
  "title": "string",
  "category": "string",
  "processedText": "string (markdown)",
  "quiz": [
    {
      "question": "string",
      "options": ["string"],
      "correctIndex": 0
    }
  ]
}
```

`quiz` — пустой массив `[]`, если тест не запрошен.

---

## 5. UI Component Structure

Иерархия по фичам (см. [project-conventions.mdc](../.cursor/rules/project-conventions.mdc)).

### Feature: `main-page`

| Компонент | Ответственность |
| :--- | :--- |
| `UrlInput` | Ввод и валидация YouTube URL |
| `ProcessingSettings` | Segmented control, селекты, toggle, счётчики |
| `MainActionButton` | Кнопка «Читать» с состоянием загрузки |
| `BackgroundShape` | Анимированный декоративный элемент фона |

### Feature: `reader`

| Компонент | Ответственность |
| :--- | :--- |
| `ReaderHeader` | Заголовок, категория, дата |
| `ContentArea` | Markdown-контент, шрифт `Lora`, `line-height: 1.7` |
| `StickyActionBar` | «Сохранить», «Удалить», «Перейти к тестам» |

### Feature: `quiz`

| Компонент | Ответственность |
| :--- | :--- |
| `QuizCard` | Один вопрос с вариантами ответов |
| `QuizProgress` | «Вопрос X из Y» |
| `QuizResult` | Процент, разбор ошибок, кнопки финала |

### Feature: `profile`

| Компонент | Ответственность |
| :--- | :--- |
| `StatsOverview` | Плитки статистики |
| `MaterialGrid` | Сетка `MaterialCard` |
| `MaterialCard` | Превью, заголовок, бейдж статуса, «Продолжить» |

### Feature: `auth`

| Компонент | Ответственность |
| :--- | :--- |
| `AuthForm` | Единая форма входа и регистрации |
| `GuestCallout` | Модальное окно при сохранении гостем |

### Shared: `src/common/`

| Компонент | Ответственность |
| :--- | :--- |
| `Header` | Логотип, тема, авторизация |
| `ThemeToggle` | Переключатель light/dark |
| `Toast` | Уведомления об ошибках |
| `LoadingIndicator` | Пульсирующая иконка AI |

---

## 6. UI State Schema (Zustand)

```typescript
interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
}

interface AppState {
  currentProcess: {
    isLoading: boolean;
    step: 'idle' | 'transcribing' | 'ai_processing' | 'completed';
    error: string | null;
  };
  reader: {
    videoId: string | null;
    title: string | null;
    content: string | null;
    category: string | null;
    format: 'narrative' | 'summary' | null;
    language: 'ru' | 'en' | 'original' | null;
    quiz: QuizQuestion[] | null;
    isSaved: boolean;
  };
  theme: 'light' | 'dark';
  user: {
    id: string | null;
    email: string | null;
  };
}
```

### Guest Session (`sessionStorage`)

Ключ: `edutrack:pendingMaterial`

```typescript
interface PendingMaterial {
  videoId: string;
  title: string;
  content: string;
  category: string;
  format: 'narrative' | 'summary';
  summaryLength: 'short' | 'medium' | 'long' | null;
  language: 'ru' | 'en' | 'original';
  quiz: QuizQuestion[] | null;
}
```

---

## 7. Processing Settings Hash

Канонический JSON для вычисления `settings_hash`:

```json
{
  "format": "narrative",
  "summaryLength": null,
  "language": "ru",
  "hasQuiz": true,
  "quizQuestionsCount": 5,
  "quizOptionsCount": 5
}
```

Поля сортируются по ключу; `null` включается явно. Результат — SHA-256 hex-строка.
