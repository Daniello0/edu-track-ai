# EduTrack AI — Frontend

React + Vite SPA для EduTrack AI. Организация кода — feature-based (`src/features/`, `src/common/`).

## Features

| Feature | UI | Service |
| :--- | :--- | :--- |
| `main-page` | ✓ | `main.service.ts` → `POST /api/process` |
| `auth` | ✓ | `auth.service.ts`, `firebase-auth.service.ts` |
| `library` | — | `library.service.ts` → `POST /api/library/claim-pending` |
| `reader` | ✓ | `reader.service.ts` → `GET /api/library/:id`; удаление — `DELETE /library/:id` |
| `quiz` | ✓ | `quiz.service.ts` → `POST /api/library/:id/quiz/attempts` |
| `profile` | ✓ | `profile.service.ts` → library list; «Продолжить» → reader |

## Scripts

```bash
npm install
npm run dev      # Vite dev server
npm run build
npm run lint
npm run test
```

## Документация

См. [docs/main-design.md](../docs/main-design.md) и [docs/schemas-design.md](../docs/schemas-design.md).
