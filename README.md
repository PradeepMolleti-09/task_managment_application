# Production-Ready Task Management Application

A full-stack task management system built with the MERN stack, featuring secure authentication, AES encryption for sensitive data, and a modern, responsive UI.

## 🚀 Key Features

- **Secure Authentication**: JWT-based auth with HttpOnly cookies, password hashing (bcrypt), and account lock protection after multiple failed attempts.
- **Task Management**: Full CRUD functionality with pagination, status filtering, and title search.
- **AES Payload Encryption**: Sensitive task descriptions are encrypted using AES-256-CBC before being stored in the database and decrypted only for the owner.
- **Email Verification**: OTP-based email verification using NodeMailer.
- **Modern UI**: Built with React, Tailwind CSS, and Framer Motion for a premium look and feel.
- **Security Best Practices**: CORS protection, Input validation, and SQL/NoSQL injection prevention via Mongoose schemas.

## 🛠 Tech Stack

- **Backend**: Node.js, Express.js
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Database**: MongoDB (Mongoose)
- **Deployment**: Render/Railway (Backend), Vercel (Frontend)

## 🏗 Architecture Overview

The application follows a clean, modular architecture:
- **Controllers**: Handle business logic and request/response flow.
- **Models**: Define data structure and validation.
- **Routes**: Handle API endpoints and middleware application.
- **Middleware**: Custom authentication and error handling logic.
- **Utils**: Reusable utilities like AES encryption and Email transporter.

## 🔧 Setup Instructions

### Backend Setup
1. Navigate to the `server` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with the following variables:
   ```env
   PORT=9000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   NODE_ENV=development
   EMAIL_USER=your_email
   EMAIL_PASS=your_app_password
   ENCRYPTION_KEY=64_character_hex_key
   ```
4. Start the server: `npm run dev`.

### Frontend Setup
1. Navigate to the `client` directory.
2. Install dependencies: `npm install`.
3. Create a `.env` file with:
   ```env
   VITE_BACKEND_URL=http://localhost:9000
   ```
4. Start the application: `npm run dev`.

## 🌐 Deployment
This project is configured for easy deployment on **Render** (Backend) and **Vercel** (Frontend).

### Backend (Render)
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Required Env**: `MONGO_URI`, `JWT_SECRET`, `ENCRYPTION_KEY`, `EMAIL_USER`, `EMAIL_PASS`, `FRONTEND_URL`.

### Frontend (Vercel)
- **Framework**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Required Env**: `VITE_BACKEND_URL`.

For a step-by-step walkthrough, see our [Deployment Guide](./deployment_guide.md).

## 📜 API Documentation
Refer to [API_DOCS.md](./API_DOCS.md) for detailed endpoint documentation.
