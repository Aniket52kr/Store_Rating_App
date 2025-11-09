# ⭐ FullStack Store Rating Platform

A full-stack web application that allows users to rate stores (1–5 stars) and provides role-based functionalities for **System Administrators**, **Normal Users**, and **Store Owners**. Built with React, Express, MySQL, and JWT authentication.

Live, secure, and production-ready — perfect for real-world use.


---

## 🚀 Tech Stack

### Backend
- **Node.js** – Runtime environment
- **Express.js** – REST API framework
- **MySQL** – Relational database
- **JWT (JSON Web Tokens)** – Secure authentication
- **bcrypt** – Password hashing

### Frontend
- **React.js** – Component-based UI
- **Vite** – Fast development build tool
- **Tailwind CSS** – Utility-first styling
- **React Router DOM** – Client-side routing
- **Axios** – HTTP client for API calls

### Architecture
- Role-based access control (RBAC)
- Ownership validation (store → owner)
- Centralized auth context
- Responsive design
- Docker & Docker Compose support

---

## 🔐 User Roles & Functionalities

### 1. System Administrator
 **Full platform control**

- Add new:
  - Stores
  - Normal Users
  - Admin Users
- Dashboard:
  - Total number of users
  - Total number of stores
  - Total number of submitted ratings
- User Management:
  - View list of all users with Name, Email, Address, Role
  - Filter users by Name, Email, Address, Role
  - View user details including role-specific info
- Store Management:
  - View list of all stores with Name, Email, Address, Rating
  - Assign a **Store Owner** to any store
  - See which users rated each store
- Authentication:
  - Login / Logout
  - Session protected via JWT

> 🔒 All routes are protected and accessible only to admins.

---

### 2. Normal User
 **Interactive rating experience**

- Sign up & Log in
- Update password after login (with validation)
- View all registered stores
- Search stores by **Name** and **Address**
- Store Listings include:
  - Store Name
  - Address
  - Overall Average Rating (stars)
  - User's Own Submitted Rating
  - Option to **submit** or **update** a rating (1–5)
- Logout

> 💡 Ratings are linked to the user and can be edited later using the correct ID.

---

### 3. Store Owner
 **Insight into customer feedback**

- Log in (same system as other roles)
- Update password after login
- Dashboard:
  - View list of users who have submitted ratings for **their store**
  - See the **average rating** of their store
  - View individual customer names and ratings
- Logout

> 🔐 Security: Only shows data for stores they own (via `owner_id` in DB)

---

## 📝 Form Validations

All forms enforce strict validation on both frontend and backend:

| Field | Rules |
|------|-------|
| **Name** | Min 20 characters, Max 60 characters |
| **Address** | Max 400 characters |
| **Password** | 8–16 characters, must include:<br>• At least one uppercase letter<br>• At least one special character |
| **Email** | Must follow standard email format (`user@domain.com`) |
| **Rating** | Must be between 1 and 5 |

Validation is performed:
- On frontend (UX)
- On backend (security)

---

## 🧩 Database Schema (Key Tables)

### `users`
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| name | VARCHAR(60) | Full name |
| email | VARCHAR(100) | Unique login |
| password | VARCHAR(255) | Hashed with bcrypt |
| address | VARCHAR(400) | Optional |
| role | ENUM | 'user', 'store_owner', 'admin' |

### `stores`
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| name | VARCHAR(255) | Store name |
| email | VARCHAR(100) | Contact email |
| address | VARCHAR(400) | Physical location |
| owner_id | INT | Foreign key to `users.id` |

### `ratings`
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| user_id | INT | References `users.id` |
| store_id | INT | References `stores.id` |
| rating | INT (1–5) | Customer rating |
| UNIQUE(user_id, store_id) | Prevents duplicate ratings |

Foreign keys ensure referential integrity and ownership tracking.

---


## 🔐 Authentication & Security

- Single login system for all roles
- JWT tokens stored in `localStorage`
- Protected routes via middleware:
  - `authenticate`: Checks valid token
  - `authorizeAdmin`, `authorizeStoreOwner`: Enforces role access
- Ownership checks:
  - Store owners only see their stores
  - Users can only update their own ratings
- Input sanitization and SQL injection prevention via parameterized queries

---

## 🖥️ How to Run (Zero Setup Needed)

### 1. Install Docker
Download and install: [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)

> Works on Windows, macOS, and Linux

### 2. Run the App

Open Terminal or PowerShell and run:

```bash
# Clone the project
git clone https://github.com/Aniket52kr/Store_Rating_App.git
cd Store_Rating_App

# Build and start all services (frontend, backend, database)
docker-compose up --build