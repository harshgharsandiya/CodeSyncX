# CodeSyncX

-   Real-Time Collaborative Code Editor with AI and Communication Features

## Project Overview

-   CodeSyncX is a web-based platform that allows developers, students, and teams to collaboratively write, edit, and run code in real-time. It combines the power of live code collaboration with video/voice chat, screen sharing, and AI-powered code assistance.

-   Think of it as Google Docs for coding, where multiple users can interact, code, and communicate simultaneously.

## Features

1. Multiple users co-edit code in real time (CRDT-based), with presence & cursors.
2. Run code in isolated sandboxes (per-project ephemeral containers).
3. Text chat + voice/video (basic SFU)
4. Screen Sharing
5. Auth (email/OAuth) + role-based authorization per project/file.
6. Share specific file ranges / grant edit/read/delete granular permissions.
7. Get a live preview URL for running projects.

## Tech Stack

1. **Frontend**: Next.js 14+ (app router), React, Monaco Editor, TailwindCSS
2. _Real-time CRDT_: **Yjs** (CRDT; robust, used widely) + **y-websocket** or **WebRTC** provider for peer sync
3. Presence/locking/awareness: **Redis** (pub/sub + ephemeral presence)
4. Real-time transport / signaling: **WebSocket** for CRDT and events; WebTransport optional later.
5. Video/voice & screen-share: WebRTC with an SFU (MediaSoup or Janus) — Mediasoup recommended.
6. Backend (microservices): Node.js (**Express** / Fastify) or NestJS for structure.
7. Message broker: **NATS or Redis Streams** for event distribution between services. (NATS recommended for scale)
8. DB: **MongoDB** (document store for projects/files) + **Postgres** optional for relational needs (billing, analytics).
9. Sandboxed code runner: **Docker-in-Docker** with strict resource limits OR Firecracker / gVisor for stronger isolation. Use ephemeral containers launched via a Runner service.
10. Storage: **S3**-compatible for project artifacts, build outputs, recordings.
11. Orchestration: Kubernetes (production); **docker-compose** for local dev.
12. CI/CD: **GitHub** Actions → build & push images → deploy to **K8s** (Helm charts).
13. Observability: **Prometheus** + **Grafana**, Loki for logs, Sentry for errors.
14. **Auth**: JWT + refresh tokens + OAuth (Google/GitHub). Use OpenID Connect flows.
15. Secrets: **Vault** or **K8s** Secrets

## High level microservice architecture

1. API Gateway (edge) — Next.js app (SSR) + reverse-proxy (NGINX/Traefik) + JWT verification.

2. Auth Service — sign up, login, OAuth, sessions, user DB. Issues JWT.

3. Project Service — CRUD for projects, files, permissions; stores metadata in MongoDB.

4. Collab Service (Yjs WebSocket server) — hosts Yjs rooms, persistence to DB (optional). Uses WebSocket or WebRTC.

5. Runtime / Runner Service — runs user code in sandboxed containers; provides live preview URL + logs.

6. Media Service (SFU) — handles WebRTC media; uses Mediasoup.

7. Notification / Chat Service — stores chat messages, push notifications.

8. Gateway / PubSub Broker — NATS cluster for events (presence, user-join/leave, build events).

9. Worker(s) — build, lint, test jobs queued (use RabbitMQ/Redis/NATS).

10. Admin / Billing Service — optional.

## Video / Voice / Screen-share design

Use WebRTC for peer streaming. For multi-user, use SFU (Mediasoup or Janus).

-   Flow:

1. Client obtains room token from Media Service.

2. Client joins signaling channel (WS) and exchanges SDP/ICE with Mediasoup via the media service.

3. MediaService handles routing/mixing as needed.

4. For recording, have MediaService produce HLS or upload recordings to S3.

## Runner / Sandbox design

-   Runner service receives build/run job with project snapshot or Git ref.

-   It spins up ephemeral container (Docker) with:

    -   CPU & memory quota

    -   Timeout (e.g., 30s / configurable)

    -   Network policies (e.g., outbound restricted or via proxy)

-   Expose a temporary preview URL (ingress -> Ingress controller -> service that routes to container).

-   Optionally use Prefect or Kubernetes Jobs to supervise runs.

-   For stronger isolation at scale consider Firecracker microVMs.

## Security & Multi-tenant considerations

-   JWT + refresh tokens; short-lived access tokens.

-   Per-project ACL checks on every API call and runtime operation.

-   SANDBOX network sandboxing: restrict outbound by default; use allowlist for dependencies if needed.

-   Escape threats: run untrusted code in isolated envs, no host mounts.

-   Rate limit socket connections and runner creation.
