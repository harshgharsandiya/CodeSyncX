# **Project structure**

```
CodeSyncX Folder Structure

This structure is based on your microservice architecture, with a Next.js App Router frontend and a backend directory containing all individual Node.js services.

/CodeSyncX
├── .github/
│   └── workflows/
│       └── ci-cd.yml         # GitHub Actions for CI/CD
├── .gitignore
├── docker-compose.yml        # Orchestrates all services for local dev
├── README.md                 # Project setup and architecture overview
│
├── packages/
│   └── types/                # Shared TypeScript types for frontend/backend
│       ├── src/
│       │   ├── index.ts
│       │   ├── user.types.ts
│       │   ├── project.types.ts
│       │   └── events.types.ts # NATS/PubSub event payloads
│       ├── package.json
│       └── tsconfig.json
│
├── frontend/                 # Next.js 14+ Frontend
│   ├── .env.local
│   ├── .eslintrc.json
│   ├── next-env.d.ts
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   ├── public/
│   │   └── (static assets)
│   └── src/
│       ├── app/              # App Router
│       │   ├── (auth)/       # Route group for auth pages
│       │   │   ├── login/
│       │   │   │   └── page.tsx
│       │   │   └── register/
│       │   │       └── page.tsx
│       │   ├── (dashboard)/  # Main authenticated app layout
│       │   │   ├── dashboard/
│       │   │   │   └── page.tsx      # List user's projects
│       │   │   └── layout.tsx
│       │   ├── (editor)/       # The main IDE experience
│       │   │   ├── project/
│       │   │   │   └── [projectId]/
│       │   │   │       └── page.tsx  # The main editor UI
│       │   │   └── layout.tsx
│       │   ├── api/          # Next.js API Routes (BFF/Gateway)
│       │   │   └── (your gateway routes)
│       │   ├── layout.tsx    # Root layout
│       │   ├── page.tsx      # Landing page
│       │   └── globals.css
│       │
│       ├── components/       # Reusable React components
│       │   ├── ui/           # Shadcn/ui style components (Button, Input, etc)
│       │   ├── editor/
│       │   │   ├── CodeEditor.tsx  # Monaco Editor + Yjs wrapper
│       │   │   ├── FileExplorer.tsx
│       │   │   └── EditorHeader.tsx
│       │   ├── chat/
│       │   │   └── ChatPanel.tsx
│       │   ├── video/
│       │   │   ├── VideoPanel.tsx
│       │   │   └── VideoTile.tsx
│       │   └── dashboard/
│       │       ├── ProjectCard.tsx
│       │       └── NewProjectModal.tsx
│       │
│       ├── lib/              # Utility functions, API clients
│       │   ├── api.ts        # Central client for all microservices
│       │   ├── auth.ts       # Auth provider, hooks (useAuth)
│       │   ├── webrtc.ts     # WebRTC signaling logic
│       │   └── yjs.ts        # Yjs connection management
│       │
│       ├── hooks/            # Custom React hooks
│       │   ├── useProject.ts
│       │   ├── useCollab.ts  # Handles Yjs/Monaco binding
│       │   ├── useMedia.ts   # Handles WebRTC/Mediasoup connection
│       │   └── useAwareness.ts # For real-time cursors/presence
│       │
│       └── store/            # State management (Zustand/Jotai)
│           ├── editor.store.ts
│           └── user.store.ts
|       
│
└── backend/                  # Monorepo for all backend services
    │
    ├── auth-service/         # Handles Auth (Node.js/Express/NestJS)
    │   ├── src/
    │   │   ├── index.ts      # Entry point
    │   │   ├── app.ts
    │   │   ├── config.ts
    │   │   ├── routes/
    │   │   ├── controllers/
    │   │   ├── services/
    │   │   └── models/       # User model
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── project-service/      # CRUD for Projects, Files, Permissions
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── ... (similar structure to auth-service)
    │   │   └── models/       # Project, File, Permission models
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── collab-service/       # Yjs WebSocket server
    │   ├── src/
    │   │   └── index.ts      # Sets up y-websocket server + persistence
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── runtime-service/      # Runs user code in sandboxes
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── services/
    │   │   │   └── docker.service.ts # Logic to spawn/manage containers
    │   │   └── ...
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── media-service/        # WebRTC SFU (Mediasoup)
    │   ├── src/
    │   │   ├── index.ts      # Entry point, sets up Mediasoup worker/router
    │   │   └── signaling.ts  # WebSocket logic for signaling
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    ├── chat-service/         # Real-time chat (WebSocket)
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── models/       # ChatMessage model
    │   │   └── ...
    │   ├── Dockerfile
    │   ├── package.json
    │   └── tsconfig.json
    │
    └── worker-service/       # Listens to NATS jobs (builds, etc)
        ├── src/
        │   ├── index.ts      # Connects to NATS, subscribes to topics
        │   └── jobs/
        │       └── build.job.ts
        ├── Dockerfile
        ├── package.json
        └── tsconfig.json

```
