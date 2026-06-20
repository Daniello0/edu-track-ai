# EduTrack AI

Превращает YouTube-лекции в структурированные учебные материалы и автоматически генерирует тесты для закрепления знаний.

## Возможности

- Обработка видео по URL: литературный пересказ или саммари
- Настройка языка вывода (RU, EN, оригинал) и параметров теста
- Автоматическая классификация материалов по категориям (enum + AI structured output)
- Режим чтения и интерактивное прохождение квиза
- Личная библиотека материалов со статусами усвоения (только для авторизованных)
- Авторизация через Firebase (Google + email/пароль) с JWT-сессией
- Гостевой доступ без регистрации — результат доступен в текущей вкладке, без записи в БД

## Стек

| Слой | Технологии |
| :--- | :--- |
| Frontend | React, Vite, Module CSS, Yup, Lucide React, Zustand, Firebase Auth |
| Backend | NestJS, PostgreSQL, class-validator, Swagger, Firebase Admin SDK, JWT |
| AI | OpenRouter |
| Инфраструктура | Docker, Vitest, ESLint, Prettier |

Подробные конвенции кода — в [.cursor/rules/project-conventions.mdc](.cursor/rules/project-conventions.mdc).

## Документация

| Документ | Содержание |
| :--- | :--- |
| [docs/main-design.md](docs/main-design.md) | Идея, цели, User Stories, архитектура, API overview |
| [docs/ui-ux-design.md](docs/ui-ux-design.md) | UI/UX: палитра, экраны, механики |
| [docs/schemas-design.md](docs/schemas-design.md) | Схемы БД, API, auth flow, AI-ответов, компонентов |

## Структура проекта

```
backend/
└── src/
    ├── common/          # Guards, утилиты, constants
    └── features/        # auth, process, library, …
frontend/
└── src/
    ├── common/          # Header, Toast, ThemeToggle, …
    └── features/        # main-page, reader, quiz, profile, auth
docs/                    # Продуктовая и техническая документация
```

Организация кода внутри каждого приложения — feature-based (`src/features/`, `src/common/`), см. [project-conventions.mdc](.cursor/rules/project-conventions.mdc).

## Разработка

Каждое приложение — отдельный npm-пакет:

```bash
# Backend
cd backend
npm install
npm run build
npm run lint
npm run test

# Frontend
cd frontend
npm install
npm run build
npm run lint
npm run test
```

## Лицензия

[Apache License 2.0](LICENSE)
