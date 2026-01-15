# FlipScout AI

FlipScout AI is a single-user MVP that analyzes resale listings and returns pricing, profit, and outreach guidance fast.

## Stack
- Frontend: Vite + React
- Backend: Node.js + Express
- Storage: SQLite (better-sqlite3)

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`.

## Environment Variables

Create `frontend/.env` if you need a custom API base:

```
VITE_API_BASE=http://localhost:5000
```

## How It Works

1. Paste a listing URL or text into the intake box.
2. FlipScout normalizes the listing and uses deterministic heuristics to estimate resale range.
3. Fee engine computes net proceeds and net profit across platforms.
4. Deal scoring ranks the opportunity and explains why.
5. Seller message templates are generated for quick outreach.

## Tests

```bash
cd backend
npm test
```

## Deploy (Render)

### Backend
1. Create a new **Web Service** in Render.
2. Root directory: `backend`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add `NODE_VERSION` environment variable (recommended: `18` or higher).

### Frontend
1. Create a new **Static Site** in Render.
2. Root directory: `frontend`
3. Build command: `npm install && npm run build`
4. Publish directory: `dist`
5. Add environment variable `VITE_API_BASE` pointing at the backend URL.

## Project Structure

```
backend/
  src/
    config/
    engines/
    utils/
  tests/
frontend/
  src/
```
