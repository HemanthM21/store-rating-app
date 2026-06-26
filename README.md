# RateStore — Full Stack Store Rating Platform

> Built for Roxiler Systems FullStack Intern Coding Challenge

---

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL + Sequelize ORM
- **Frontend:** React.js (React Router v6)
- **Auth:** JWT (JSON Web Tokens) + bcryptjs

---

## Project Structure

```
store-rating-app/
├── backend/                  # Express API
│   ├── config/db.js          # PostgreSQL connection
│   ├── models/               # Sequelize models (User, Store, Rating)
│   ├── controllers/          # Business logic
│   ├── middleware/           # Auth & Role guards
│   ├── routes/               # API route definitions
│   ├── utils/validators.js   # Form validation helpers
│   ├── .env                  # Environment variables
│   └── server.js             # Entry point
│
└── frontend/                 # React app
    └── src/
        ├── components/       # Navbar, Sidebar, StarRating, ProtectedRoute
        ├── context/          # AuthContext (global auth state)
        ├── pages/
        │   ├── admin/        # AdminDashboard, AdminUsers, AdminStores
        │   ├── user/         # UserStores (browse + rate)
        │   ├── owner/        # OwnerDashboard
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   └── UpdatePassword.jsx
        ├── styles/global.css # Full design system
        └── utils/api.js      # Axios instance with JWT interceptor
```

---

## Prerequisites

- Node.js v18+
- PostgreSQL 14+
- npm or yarn

---

## Setup Instructions

### 1. PostgreSQL Database

```sql
CREATE DATABASE store_rating_db;
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Edit `.env` with your PostgreSQL credentials:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

Start the backend:
```bash
npm run dev      # development (nodemon)
# or
npm start        # production
```

On first start, the server will:
- ✅ Connect to PostgreSQL
- ✅ Auto-sync all tables
- ✅ Seed a default admin account

**Default Admin credentials:**
```
Email:    admin@storeratingapp.com
Password: Admin@1234
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend runs at `http://localhost:3000` and proxies API calls to `http://localhost:5000`.

---

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login |
| GET | `/api/auth/me` | Any logged-in | Get current user |
| PUT | `/api/auth/update-password` | Any logged-in | Update password |

### Admin (role: admin)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Stats: users, stores, ratings |
| GET | `/api/admin/users` | List users (with filters + sort) |
| GET | `/api/admin/users/:id` | User detail (includes store rating if owner) |
| POST | `/api/admin/users` | Create user |
| GET | `/api/admin/stores` | List stores (with filters + sort) |
| POST | `/api/admin/stores` | Create store |

### Stores (role: user)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stores` | Browse stores with user's rating |
| POST | `/api/stores/:id/rate` | Submit or update rating (1-5) |
| DELETE | `/api/stores/:id/rate` | Remove your rating |

### Owner (role: owner)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/dashboard` | Store info + ratings list + avg |

---

## User Roles & Features

### 🔴 System Administrator
- Dashboard with total users, stores, and ratings
- Add new users (with name, email, password, address, role)
- View all users with filter by name/email/address/role
- View all stores with filter by name/email/address
- View store owner's store rating inline in user list
- Sort all tables by any column (asc/desc)

### 🟢 Normal User
- Register via public signup form
- Browse all stores (search by name or address)
- Submit ratings (1–5 stars) for any store
- Modify or remove their own rating
- Update their password

### 🟣 Store Owner
- Login only (no public registration)
- View their store's average rating
- See a list of all customers who rated their store
- Update their password

---

## Form Validations

| Field | Rule |
|-------|------|
| Name | 20–60 characters |
| Address | Max 400 characters |
| Password | 8–16 chars, ≥1 uppercase, ≥1 special character |
| Email | Standard email format |
| Rating | Integer between 1 and 5 |

---

## Design System

The UI is inspired by bold modern design studios (dzinrstudio.com, getmulti.ai):

- **Colors:** Deep obsidian background (#080810), electric violet accent (#7c5cfc), neon mint (#00e5b0), warm cream text
- **Fonts:** Syne (display headings), Space Grotesk (body), DM Mono (data/labels)
- **Style:** Dark, minimal, glassmorphic cards, gradient text, smooth transitions

---

## Database Schema

### users
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| name | VARCHAR(60) | 20-60 chars |
| email | VARCHAR | Unique |
| password | VARCHAR | bcrypt hashed |
| address | VARCHAR(400) | |
| role | ENUM | admin/user/owner |
| createdAt | TIMESTAMP | |

### stores
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| name | VARCHAR(60) | 20-60 chars |
| email | VARCHAR | Unique |
| address | VARCHAR(400) | |
| owner_id | FK → users.id | nullable |
| createdAt | TIMESTAMP | |

### ratings
| Column | Type | Notes |
|--------|------|-------|
| id | SERIAL PK | |
| rating | INTEGER | 1-5 |
| user_id | FK → users.id | |
| store_id | FK → stores.id | |
| createdAt | TIMESTAMP | |
| UNIQUE | (user_id, store_id) | One rating per user per store |

---

## GitHub Submission

```bash
git init
git add .
git commit -m "feat: complete store rating platform"
git remote add origin <your-repo-url>
git push -u origin main
```
