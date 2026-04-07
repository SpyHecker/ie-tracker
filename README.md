# Advanced Income & Expense Tracker (React + Node + MySQL)

A production-ready full-stack finance dashboard with JWT auth, analytics, budgeting visuals, and rule-based AI insights.

## Features

- JWT Authentication (register, login, protected routes)
- Transaction CRUD with search, filters, sorting, and pagination
- Analytics engine:
  - total income
  - total expense
  - balance
  - monthly grouping
  - category-wise breakdown
  - savings rate
  - expense growth vs previous month
- Rule-based AI insights (no external AI API required)
- Modern dashboard UI with Tailwind + Recharts
- Landing page before auth with 3D visual styling

## Tech Stack

### Backend

- Node.js
- Express.js
- MySQL (`mysql2`)
- JWT + bcrypt

### Frontend

- React (Vite)
- Tailwind CSS
- Recharts
- Axios
- Context API

## Project Structure

```text
ie-tracker/
- server/
  - src/
    - config/
    - middlewares/
    - modules/
      - auth/
      - users/
      - transactions/
      - analytics/
      - insights/
    - utils/
    - app.js
    - server.js
- client/
  - src/
    - components/
    - context/
    - pages/
    - services/
    - utils/
```

## Backend Setup (MySQL)

1. Go to backend folder

```bash
cd server
```

2. Install dependencies

```bash
npm install
```

3. Create env file

```bash
cp .env.example .env
```

4. Configure `.env`

Option A (recommended for deployment):

```env
MYSQL_URL=mysql://root:your_password@127.0.0.1:3306/ie_tracker
```

Option B (separate variables):

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=
MYSQL_DATABASE=ie_tracker
MYSQL_CONNECTION_LIMIT=10
```

Also set:

```env
NODE_ENV=development
PORT=5000
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
```

5. Run backend

```bash
npm run dev
```

Notes:
- Database and required tables are auto-created on server startup.
- No external API key is required for database usage.

## Frontend Setup

1. Go to frontend folder

```bash
cd client
```

2. Install dependencies

```bash
npm install
```

3. Create env file

```bash
cp .env.example .env
```

4. Configure `.env`

```env
VITE_API_URL=http://localhost:5000/api/v1
```

5. Run frontend

```bash
npm run dev
```

## API Overview

### Auth

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `GET /api/v1/auth/me`

### Transactions (Protected)

- `POST /api/v1/transactions`
- `GET /api/v1/transactions`
- `PATCH /api/v1/transactions/:id`
- `DELETE /api/v1/transactions/:id`

### Analytics (Protected)

- `GET /api/v1/analytics/overview`
- `GET /api/v1/analytics/monthly`
- `GET /api/v1/analytics/categories`
- `GET /api/v1/analytics/savings-rate`
- `GET /api/v1/analytics/expense-growth`

### Insights (Protected)

- `GET /api/v1/insights`
- `GET /api/v1/insights/rule-based`

## Scripts

### Backend (`server`)

- `npm run dev` - Start backend with nodemon
- `npm run start` - Start backend
- `npm run check` - Syntax check

### Frontend (`client`)

- `npm run dev` - Start Vite dev server
- `npm run build` - Build production assets
- `npm run preview` - Preview production build

## Deployment Notes

- Set `MYSQL_URL` or separate MySQL env vars in deployment.
- Ensure app host can reach MySQL host/port.
- Keep `JWT_SECRET` strong and private.
- Backend API contracts remain compatible with current frontend.
