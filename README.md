# Contacts App (Monorepo)

This repository contains a minimal scaffold for a Contact Management application:

- Backend (Nest.js microservices):
  - apps/api-gateway
  - apps/contacts-service
  - apps/auth-service

- Frontend (Vite + React + TypeScript):
  - frontend

Run MongoDB via Docker Compose then install dependencies and start the services.

Quick start (recommended):

1. Start MongoDB:

```bash
docker-compose up -d
```

2. Install workspace dependencies (requires npm 7+ workspaces):

```bash
npm install
```

3. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

4. Start backend services (each in its folder):

```bash
# in a new terminal for each service
cd apps/api-gateway
npm install
npm run start:dev

cd apps/auth-service
npm install
npm run start:dev

cd apps/contacts-service
npm install
npm run start:dev

cd apps/messages-service
npm install
npm run start:dev
```

See `.env.example` for required environment variables.
# Contacts-app-react