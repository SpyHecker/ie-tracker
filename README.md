# Flow — Income & Expense Tracker

A clean MERN app to log income and spending, view charts, and stay within a monthly budget.

## Stack

- **MongoDB** + Mongoose
- **Express** REST API + JWT auth
- **React** (Vite) + Recharts
- **Node.js**

## Setup

```bash
npm install
cp .env.example .env
```

Start MongoDB locally, then:

```bash
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:5000  

Production:

```bash
npm run build
npm start
```

## Deploy on Render

Create a new **Web Service** from this repository. Render can read `render.yaml`, or you can enter these settings manually:

```text
Build Command: npm ci && npm run build
Start Command: npm start
Health Check Path: /health
```

Add these environment variables in Render:

```text
NODE_ENV=production
MONGODB_URI=your MongoDB Atlas connection string
JWT_SECRET=a long random secret
```

The React app is built into `client/dist`, and the Express server serves it together with the `/api` routes.

## Demo account

| Email | Password |
|-------|----------|
| `demo@flow.app` | `flow12345` |

## Routes

| Page | Path |
|------|------|
| Landing | `/` |
| Sign in | `/login` |
| Register | `/register` |
| Workspace | `/app` (protected) |

## API

- `POST /api/auth/register` · `POST /api/auth/login` · `GET /api/auth/me`
- `PATCH /api/auth/profile` — update `monthlyBudget`
- `GET /api/transactions` · `POST` · `PUT /:id` · `DELETE /:id`
- `GET /api/transactions/summary`
