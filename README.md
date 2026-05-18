# GigFlow — Smart Leads Dashboard

A full-stack lead management dashboard built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript. Manage leads with filtering, search, pagination, role-based access, and CSV export.

## Features

- **Authentication** — JWT register/login, bcrypt password hashing, protected routes
- **Leads CRUD** — Create, read, update, and delete leads
- **Advanced filters** — Status, source, debounced name/email search, latest/oldest sort (combinable)
- **Pagination** — Server-side pagination (10 records per page by default)
- **Role-based access** — `admin` (all leads, delete, CSV export) and `sales_user` (own leads only)
- **UI** — Responsive dashboard, loading/empty/error states, form validation, dark mode

## Tech stack

| Layer | Technologies |
|-------|----------------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express, TypeScript, Mongoose |
| Database | MongoDB |

## Project structure

```
GigFlow-Smart-Leads-Dashboard/
├── backend/          # Express API
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       └── types/
├── frontend/         # React app
│   └── src/
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       └── types/
└── docs/
    └── API.md        # REST API reference
```

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally **or** a [MongoDB Atlas](https://www.mongodb.com/atlas) connection string

## Setup instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd GigFlow-Smart-Leads-Dashboard
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:

```env
MONGODB_URI=mongodb://localhost:27017/leads_db
JWT_SECRET=your_super_secret_key_change_in_production
JWT_EXPIRE=7d
PORT=5000
```

Start the API:

```bash
npm run dev
```

API runs at **http://localhost:5000**

### 3. Frontend

Open a new terminal:

```bash
cd frontend
npm install
cp .env.example .env
```

`frontend/.env` (default):

```env
VITE_API_URL=http://localhost:5000/api
```

Start the app:

```bash
npm run dev
```

App runs at **http://localhost:5173**

### 4. Log in

On first backend start, a default admin is created:

| Field | Value |
|-------|--------|
| Email | `admin@gmail.com` |
| Password | `Admin@12345` |

Register additional users from the app; they receive the `sales_user` role unless the email is `admin@gmail.com`.

## Production build

**Backend**

```bash
cd backend
npm run build
npm start
```

**Frontend**

```bash
cd frontend
npm run build
npm run preview
```

Serve the `frontend/dist` folder with any static host (Vercel, Netlify, etc.) and point `VITE_API_URL` to your deployed API.

## API documentation

Full endpoint reference, request/response examples, and status codes:

**[docs/API.md](./docs/API.md)**

Quick health check:

```bash
curl http://localhost:5000/api/health
```

## Environment variables

| File | Variable | Description |
|------|----------|-------------|
| `backend/.env` | `MONGODB_URI` | MongoDB connection string |
| `backend/.env` | `JWT_SECRET` | Secret for signing JWTs |
| `backend/.env` | `JWT_EXPIRE` | Token expiry (e.g. `7d`) |
| `backend/.env` | `PORT` | API port (default `5000`) |
| `frontend/.env` | `VITE_API_URL` | Backend API base URL |

See `backend/.env.example` and `frontend/.env.example` for templates.

## Scripts

| Location | Command | Description |
|----------|---------|-------------|
| `backend/` | `npm run dev` | Start API with ts-node |
| `backend/` | `npm run build` | Compile TypeScript |
| `backend/` | `npm start` | Run compiled API |
| `frontend/` | `npm run dev` | Start Vite dev server |
| `frontend/` | `npm run build` | Production build |
| `frontend/` | `npm run preview` | Preview production build |

## Deployment

Deploy the backend (Render) and frontend (Vercel) separately. Set environment variables on each platform and use a hosted MongoDB (Atlas).

**Live demo:** https://gig-flow-smart-leads-dashboard-theta.vercel.app

## License

This project was built as a full-stack internship assignment.
