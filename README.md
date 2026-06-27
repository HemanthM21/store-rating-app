# RateStore — Full-Stack Store Rating Platform

> A full-stack web application built for the **Roxiler Systems FullStack Intern Coding Challenge**.  
> Users can discover, browse, and rate stores. Admins manage users and stores from a dedicated dashboard. Store owners track their ratings in real time.

---

## Live Demo Credentials

| Role | Email | Password |
|---|---|---|
| **System Administrator** | `admin@storeratingapp.com` | `Admin@1234` |
| Normal User | *(Register via /register)* | — |
| Store Owner | *(Created by Admin)* | — |

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js (Create React App), React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | PostgreSQL |
| **ORM** | Sequelize |
| **Auth** | JWT (JSON Web Tokens) + bcrypt |
| **Styling** | Vanilla CSS — custom design system (no UI library) |
| **Fonts** | DM Serif Display + Inter (Google Fonts) |

---

## Features

### System Administrator
- Dashboard with live counts — total users, stores, and submitted ratings
- Add new users (Normal User, Store Owner, or Admin) with full validation
- Add new stores and assign them to a Store Owner
- View and filter the full user list by Name, Email, Address, and Role
- View and filter the full store list by Name, Email, and Address
- See each Store Owner's average store rating in the user list
- Sortable columns (ascending / descending) across all tables

### Normal User
- Self-registration via a public sign-up page
- Browse all registered stores with name, address, overall rating, and personal submitted rating
- Search stores by Name or Address
- Submit a rating (1–5 stars) for any store
- Modify or delete a previously submitted rating
- Update account password

### Store Owner
- Dedicated dashboard showing their store's health index
- See the average rating of their store with a large visual display
- View a table of all users who have rated their store (name, email, rating)
- Update account password

---

## Form Validations

| Field | Rule |
|---|---|
| **Name** | Min 20 characters, Max 60 characters |
| **Email** | Standard email format |
| **Password** | 8–16 characters, at least one uppercase letter, at least one special character |
| **Address** | Max 400 characters |

All validations are enforced on both the frontend (instant feedback) and backend (API-level rejection).

---

## Project Structure

```
store-rating-app/
├── backend/
│   ├── config/
│   │   └── db.js                  # PostgreSQL + Sequelize connection
│   ├── controllers/
│   │   ├── adminController.js     # Dashboard, users, stores CRUD
│   │   ├── authController.js      # Register, login, update password
│   │   ├── ownerController.js     # Owner dashboard data
│   │   └── storeController.js     # Store listing + rating submission
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based access control
│   ├── models/
│   │   ├── User.js                # User model (bcrypt hooks)
│   │   ├── Store.js               # Store model
│   │   ├── Rating.js              # Rating model (1–5 constraint)
│   │   └── index.js               # Associations
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   ├── ownerRoutes.js
│   │   └── storeRoutes.js
│   ├── utils/
│   │   └── validators.js          # Shared validation functions
│   └── server.js                  # Entry point, auto-seeds admin
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── Navbar.jsx          # Sidebar with SVG icons
        │   └── StarRating.jsx      # Interactive star widget
        ├── context/
        │   └── AuthContext.jsx     # Global auth state + JWT storage
        ├── pages/
        │   ├── Login.jsx
        │   ├── Register.jsx
        │   ├── UpdatePassword.jsx
        │   ├── admin/
        │   │   ├── AdminDashboard.jsx
        │   │   ├── AdminUsers.jsx
        │   │   └── AdminStores.jsx
        │   ├── owner/
        │   │   └── OwnerDashboard.jsx
        │   └── user/
        │       └── UserStores.jsx
        ├── styles/
        │   └── global.css          # Full custom design system
        └── utils/
            └── api.js              # Axios instance with auth interceptor
```

---

## API Overview

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Login and receive JWT |
| `PUT` | `/api/auth/update-password` | Any auth | Change password |
| `GET` | `/api/auth/me` | Any auth | Get current user info |
| `GET` | `/api/admin/dashboard` | Admin | Platform statistics |
| `GET` | `/api/admin/users` | Admin | List all users (filterable) |
| `POST` | `/api/admin/users` | Admin | Create a new user |
| `GET` | `/api/admin/users/:id` | Admin | Get user detail |
| `GET` | `/api/admin/stores` | Admin | List all stores (filterable) |
| `POST` | `/api/admin/stores` | Admin | Create a new store |
| `GET` | `/api/owner/dashboard` | Owner | Store stats + rating list |
| `GET` | `/api/stores` | User | Browse stores |
| `POST` | `/api/stores/:id/rate` | User | Submit a rating |
| `DELETE` | `/api/stores/:id/rate` | User | Delete a rating |

---

## Database Schema

```
users          stores           ratings
─────────      ─────────────    ───────────────
id (PK)        id (PK)          id (PK)
name           name             user_id (FK)
email          email            store_id (FK)
password*      address          rating (1–5)
address        owner_id (FK)    createdAt
role           createdAt        updatedAt
createdAt      updatedAt
updatedAt

* bcrypt-hashed automatically via Sequelize beforeCreate/beforeUpdate hooks
```

**Relationships:**
- A `User` with role `owner` is associated 1-to-1 with a `Store` (via `owner_id`)
- A `User` can submit many `Ratings`, one per `Store`
- A `Store` has many `Ratings`; average is computed at query time

---

## Local Setup

### Prerequisites
- Node.js v18+
- PostgreSQL (running locally or via a cloud service)

### 1. Clone the repository
```bash
git clone https://github.com/HemanthM21/store-rating-app.git
cd store-rating-app
```

### 2. Configure the backend environment
```bash
cd backend
```
Create a `.env` file:
```env
DB_NAME=store_rating_db
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### 3. Install dependencies and start the backend
```bash
npm install
npm run dev
```
The backend auto-syncs the database schema and seeds a default admin account on first run.

### 4. Install dependencies and start the frontend
```bash
cd ../frontend
npm install
npm start
```

The app runs on **http://localhost:3000**  
The API runs on **http://localhost:5000**

---

## Default Admin Account

Automatically created on first server start:

```
Email:    admin@storeratingapp.com
Password: Admin@1234
```

To reset the admin account manually:
```bash
cd backend
node resetAdmin.js
```

---

## Design Highlights

- **Custom Design System** — zero external UI libraries; all components hand-crafted in vanilla CSS
- **Two-tone Brand Palette** — Natural Viridian `#40826D` (actions, accents) paired with Seashell `#FFF5EE` (backgrounds)
- **Creative Login Page** — CoreShift-inspired connected store-category icons (Cafe, Restaurant, Fashion, Electronics, Grocery, Beauty) linked by SVG dashed lines to a central rating hub, communicating the platform purpose at a glance
- **Role-aware Sidebar** — Product-dashboard style navigation with inline SVG icons; adapts to admin, owner, and user roles automatically
- **Micro-animations** — Floating category cards, pulse effects on status indicators, smooth hover transitions throughout

---

## Challenge Requirements Checklist

| Requirement | Status |
|---|---|
| Single login system for all roles | ✅ |
| Normal user self-registration | ✅ |
| Admin dashboard (users / stores / ratings count) | ✅ |
| Admin: add users and stores | ✅ |
| Admin: filter and sort user + store listings | ✅ |
| Admin: view Store Owner's store rating in user list | ✅ |
| User: browse and search stores | ✅ |
| User: submit, edit, delete ratings (1–5) | ✅ |
| Owner: view store average rating | ✅ |
| Owner: view list of users who rated their store | ✅ |
| Password update for all roles | ✅ |
| Form validations (name, email, password, address) | ✅ |
| Sortable tables (ascending / descending) | ✅ |
| PostgreSQL database | ✅ |
| Express.js backend | ✅ |
| React.js frontend | ✅ |
| Best practices — JWT auth, bcrypt hashing, role middleware | ✅ |

---

*Built with React.js · Express.js · PostgreSQL · Sequelize*
