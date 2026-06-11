# EduTrack AI

Превращает YouTube-лекции в структурированные учебные материалы и автоматически генерирует тесты для закрепления знаний.

## Возможности

- Обработка видео по URL: литературный пересказ или саммари
- Настройка языка вывода (RU, EN, оригинал) и параметров теста
- Режим чтения и интерактивное прохождение квиза
- Личная библиотека материалов со статусами усвоения
- Гостевой доступ без регистрации

## Стек

| Слой | Технологии |
| :--- | :--- |
| Frontend | React, Vite, Module CSS, Yup, Lucide React, Zustand |
| Backend | NestJS, PostgreSQL, class-validator, Swagger |
| AI | Groq |
| Инфраструктура | Docker, Vitest, ESLint, Prettier |

Подробные конвенции кода — в [.cursor/rules/project-conventions.mdc](.cursor/rules/project-conventions.mdc).

## Документация

| Документ | Содержание |
| :--- | :--- |
| [docs/main-design.md](docs/main-design.md) | Идея, цели, User Stories, архитектура, API overview |
| [docs/ui-ux-design.md](docs/ui-ux-design.md) | UI/UX: палитра, экраны, механики |
| [docs/schemas-design.md](docs/schemas-design.md) | Схемы БД, API, AI-ответов, компонентов |

## Структура проекта

```
src/
├── common/          # Общие утилиты и компоненты
└── features/        # Бизнес-фичи (main-page, reader, quiz, profile, auth)
docs/                # Продуктовая и техническая документация
```

## Разработка

```bash
npm install
npm run build
npm run lint
npm run test
```

## Лицензия

[Apache License 2.0](LICENSE)
