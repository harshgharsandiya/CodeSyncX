{
"name": "codesyncx-backend",
"private": true,
"workspaces": [
"backend/*-service"
],
"scripts": {
"dev": "concurrently \"npm:dev:\*\"",
"dev:auth-service": "cd backend/auth-service && npm run dev",
"dev:project-service": "cd backend/project-service && npm run dev",
"dev:collab-service": "cd backend/collab-service && npm run dev",
"dev:chat-service": "cd backend/chat-service && npm run dev",
"dev:media-service": "cd backend/media-service && npm run dev",
"dev:runtime-service": "cd backend/runtime-service && npm run dev",
"dev:worker-service": "cd backend/worker-service && npm run dev"
},
"devDependencies": {
"concurrently": "^8.2.0"
}
}
