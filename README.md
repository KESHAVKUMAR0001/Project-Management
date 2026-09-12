# Project Management Platform - Backend API

A secure, modular backend service built with **Node.js**, **Express 5**, and **MongoDB**. 

Currently, the entire **Authentication & Security Engine** is implemented with production-grade practices like dual-token JWT rotation, SHA-256 token hashing for verification, and automated email notifications.

---

## ⚡ Tech Stack

- **Runtime & Framework:** Node.js (ES Modules), Express.js 5.x
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (Access + Refresh tokens), Bcrypt (password hashing)
- **Security:** Node `crypto` (SHA-256 digests for temporary tokens)
- **Email Service:** Nodemailer + Mailgen (Mailtrap SMTP for dev testing)
- **Validation:** express-validator middleware pipeline

---

## 🚀 What’s Implemented & Working

### 1. Authentication & User Management (`/api/v1/auth`)
- **Register (`POST /register`)** - Validates input, prevents duplicate username/email, hashes password using Mongoose pre-save hook, creates user, and sends verification email.
- **Email Verification (`GET /verify-email/:verificationToken`)** - Verifies email with a secure unhashed token.
- **Login (`POST /login`)** - Validates credentials, issues a short-lived Access Token and a long-lived Refresh Token (stored in DB & HTTP-only cookie).
- **Logout (`POST /logout`)** - Protected route; revokes refresh token from the database and clears cookies.
- **Refresh Access Token (`POST /refresh-token`)** - Issues a fresh access token using the refresh token.
- **Current User Profile (`GET /current-user`)** - Returns sanitized user details (excluding sensitive fields).
- **Change Password (`POST /change-password`)** - Validates old password and updates it securely.
- **Forgot Password (`POST /forgot-password`)** - Generates a 20-minute expiring reset link and sends it via email.
- **Reset Password (`POST /reset-password/:resetToken`)** - Resets password after verifying the temporary token.

### 2. System Health
- **Health Check (`GET /api/v1/healthcheck`)** - Simple diagnostic route to confirm server status.

---

## 🧠 Key Engineering Decisions (Interviewer Q&A)

- **Why SHA-256 for email/reset tokens instead of saving plain strings?**  
  Raw tokens are never stored in the database. The DB only holds a one-way SHA-256 hash. Even if the DB is compromised, an attacker cannot generate valid reset or verification URLs.
- **Why Access Token + Refresh Token?**  
  Access tokens are short-lived for quick stateless verification, while refresh tokens reside in HTTP-only cookies and the DB so sessions can be revoked immediately on logout.
- **Clean Architecture & Uniform Contracts:**  
  All responses use standard `ApiResponse(statusCode, data, message)` and errors use `ApiError(statusCode, message, errors)` wrapped with an `asyncHandler` to avoid repetitive `try/catch` blocks.

---

## 🛠️ Quick Setup & Run

### 1. Clone & Install
```bash
git clone https://github.com/KESHAVKUMAR0001/Project-Management.git
cd Project-Management-Platform
npm install
```

### 2. Configure Environment Variables
Copy `.env.sample` to `.env`:
```bash
cp .env.sample .env
```
Ensure your `.env` has your MongoDB connection and Mailtrap credentials:
```env
PORT=3000
MONGO_URL=mongodb://localhost:27017/project_management
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=keshav_kumar_access_token_secret_key_2025
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=keshav_kumar_refresh_token_secret_key_2025
REFRESH_TOKEN_EXPIRY=10d

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password

MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=best2keshav
MAILTRAP_SMTP_PASS=best2keshav_mailtrap_pass
```

### 3. Start Development Server
```bash
npm run dev
```
Server runs on `http://localhost:3000`. Test it with `GET http://localhost:3000/api/v1/healthcheck`.

---

## 📂 Project Structure

```
src/
├── controllers/      # auth and healthcheck business logic
├── db/               # MongoDB connection setup
├── middlewares/      # JWT auth guard & validator handler
├── models/           # Mongoose schemas (User with pre-save hooks & token methods)
├── routes/           # Express route definitions
├── utils/            # ApiError, ApiResponse, asyncHandler, mailer
└── validators/       # express-validator request rules
```

---

## 👤 Author

**Keshav Kumar**  
- GitHub: [@KESHAVKUMAR0001](https://github.com/KESHAVKUMAR0001)  
- Email: [best2keshav@gmail.com](mailto:best2keshav@gmail.com)
