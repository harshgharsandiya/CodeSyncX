# This file orchestrates all your microservices for local development.

# Run `docker-compose up --build`

version: '3.8'

services:

# 1. Database

mongo:
image: mongo:latest
ports: - "27017:27017"
volumes: - mongo-data:/data/db
environment: - MONGO_INITDB_DATABASE=codesyncx

# 2. Frontend

frontend:
build:
context: ./frontend-nextjs
ports: - "3000:3000"
environment: - NEXT_PUBLIC_AUTH_API=http://auth-service:8001 - NEXT_PUBLIC_PROJECT_API=http://project-service:8002 - NEXT_PUBLIC_COLLAB_WS=ws://collaboration-service:8003 - NEXT_PUBLIC_COMM_WS=ws://communication-service:8004 # ...and so on
depends_on: - auth-service - project-service

# 3. Auth Service

auth-service:
build:
context: ./auth-service
ports: - "8001:8001"
environment: - MONGO_URI=mongodb://mongo:27017/codesyncx-auth - JWT_SECRET=YOUR_SUPER_SECRET_KEY
depends_on: - mongo

# 4. Project Service

project-service:
build:
context: ./project-service
ports: - "8002:8002"
environment: - MONGO_URI=mongodb://mongo:27017/codesyncx-project - AUTH_SERVICE_URL=http://auth-service:8001 # For token validation
depends_on: - mongo - auth-service

# 5. Collaboration Service (Yjs)

collaboration-service:
build:
context: ./collaboration-service
ports: - "8003:8003"
environment: - MONGO_URI=mongodb://mongo:27017/codesyncx-collab
depends_on: - mongo

# 6. Communication Service (WebRTC Signaling + Chat)

communication-service:
build:
context: ./communication-service
ports: - "8004:8004"
environment: - MONGO_URI=mongodb://mongo:27017/codesyncx-comm
depends_on: - mongo

# 7. Execution Service (Using Piston API)

# If you build your own, this would be more complex

execution-service:
build:
context: ./execution-service
ports: - "8005:8005"
environment: - PISTON_API_URL=https://piston.run/api/v2/execute

# 8. Preview Service

preview-service:
build:
context: ./preview-service
ports: - "8006:8006"

volumes:
mongo-data:
