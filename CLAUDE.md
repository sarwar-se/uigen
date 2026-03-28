# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Setup & Commands

```bash
npm run setup        # Install deps + Prisma generate + migrate (first-time setup)
npm run dev          # Dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run test         # Vitest (all tests)
npm run db:reset     # Reset SQLite database
```

Run a single test file:
```bash
npx vitest run src/components/chat/__tests__/ChatInterface.test.tsx
```

Set `ANTHROPIC_API_KEY` in `.env` to enable real AI generation; omit it to use the mock fallback provider.

## Architecture

UIGen is a Next.js 15 (App Router) app that lets users generate React components via Claude AI and preview them live in the browser.

### Core Data Flow

1. User sends a chat message → `ChatContext` → `POST /api/chat`
2. `/api/chat/route.ts` calls Claude (Anthropic) via Vercel AI SDK with two tools:
   - `str_replace_editor` (`src/lib/tools/str-replace.ts`) — modify file content
   - `file_manager` (`src/lib/tools/file-manager.ts`) — create/delete files/dirs
3. Tool calls mutate the **VirtualFileSystem** (`src/lib/file-system.ts`) — an in-memory structure, nothing written to disk
4. `FileSystemContext` propagates FS changes to the UI
5. `PreviewFrame` transpiles files with **Babel standalone** in the browser for live preview

### Layout (3-panel)

`main-content.tsx` renders a `ResizablePanelGroup`:
- **Left** — `ChatInterface`: message history + input
- **Middle** — `FileTree` + `CodeEditor` (Monaco)
- **Right** — `PreviewFrame` with Preview/Code tabs

### Auth & Sessions

- JWT sessions stored in httpOnly cookies (7-day expiry)
- `src/lib/auth.ts` — JWT sign/verify via `jose`
- `src/actions/index.ts` — sign up, sign in, sign out, getUser server actions
- `src/middleware.ts` — protects `/api/projects` and `/api/filesystem` routes (returns 401)
- Anonymous users can use the app; registered users get project persistence

### Database (SQLite + Prisma)

Schema in `prisma/schema.prisma`. Two models:
- **User**: id, email, hashed password, timestamps, projects
- **Project**: id, name, userId, messages (JSON), data (JSON), timestamps

Prisma client generated to `src/generated/prisma`.

### AI Provider

`src/lib/provider.ts` — returns the Anthropic provider with `claude-haiku-4-5` by default, or a `MockLanguageModelV1` when `ANTHROPIC_API_KEY` is absent. The system prompt lives in `src/lib/prompts/generation.tsx`.

### Path Aliases

`@/*` maps to `src/*` (configured in `tsconfig.json` and `components.json`).

### UI Components

shadcn/ui components live in `src/components/ui/`. Style: new-york, Tailwind CSS v4, neutral color base.
