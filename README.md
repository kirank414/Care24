<div align="center">
  <div style="background: #0f172a; padding: 40px; border-radius: 24px;">
    <h1 style="color: #3b82f6; font-size: 48px; margin: 0;">Care24</h1>
    <p style="color: #94a3b8; font-size: 20px; margin-top: 10px;">Premium Full-Stack Elderly Nursing & Healthcare SaaS Platform</p>
  </div>
</div>

<br />

[![React](https://img.shields.io/badge/React-18.x-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud-brightgreen.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![JWT Auth](https://img.shields.io/badge/JWT_Auth-Secure-orange.svg?style=flat-square&logo=json-web-tokens)](https://jwt.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38bdf8.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Project Overview

**Care24** is an enterprise-grade, full-stack healthcare SaaS platform designed to bridge the gap between families seeking premium elderly care and certified clinical specialists. Engineered with a rigorous focus on compliance, real-time telemetry tracking, and role-based access security, Care24 provides an elite portal for managing specialized nursing, dementia support, and post-operative care.

---

## 🚀 Key Features

* 🔐 **Enterprise Authentication & RBAC**: Fully integrated JWT session management with strict Role-Based Access Control (`USER`, `CAREGIVER`, `ADMIN`).
* 📊 **Clinical Command Center Dashboard**: Real-time patient telemetry monitoring (BPM, vitals) and active clinical care plan tracking.
* 👨‍⚕️ **Expert Vetting & Network**: Access to background-checked, certified elite RNs and caregivers with transparent compliance logging.
* ⚡ **Optimized UI/UX**: Premium glassmorphism design system built with Tailwind CSS, featuring smooth micro-animations and fully responsive mobile slide-over navigation.
* 🛡️ **Audit & Compliance Standards**: Built to align with HIPAA Level 3 encryption guidelines and ISO-27001 operational standards.

---

## 🛠️ Technology Stack

### Frontend Architecture
* **Framework**: React 18 with TypeScript
* **State Management**: Zustand (with automatic `localStorage` persistence & rehydration)
* **HTTP Client**: Axios (with automated JWT Bearer token injection & global 401 interceptors)
* **Styling**: Tailwind CSS & Shadcn UI components
* **Routing**: React Router DOM (with protected route guards)

### Backend Architecture
* **Runtime**: Node.js (ES Modules)
* **Framework**: Express.js
* **Database**: MongoDB Atlas (Cloud Database)
* **ORM**: Mongoose ODM
* **Authentication**: JSON Web Tokens (JWT) & Bcrypt password hashing
* **Validation**: Zod & Mongoose schema validation

---

## 🏛️ Authentication & Security Architecture

Care24 employs a highly secure, decoupled authentication architecture engineered for seamless full-stack communication:

```
┌──────────────┐          1. POST /api/auth/login          ┌──────────────┐
│              ├──────────────────────────────────────────►│              │
│    React     │          2. Returns JWT & User            │   Express    │
│   Frontend   │◄──────────────────────────────────────────┤   Backend    │
│ (Zustand/    │                                           │ (MongoDB     │
│  Axios)      │          3. API Request + Bearer Token    │  Atlas)      │
│              ├──────────────────────────────────────────►│              │
└──────────────┘                                           └──────────────┘
```

1. **Token Persistence**: Upon successful authentication, the JWT and user profile are securely stored in `localStorage` (`care24_token`, `care24_user`).
2. **Automated Interceptors**: All outgoing requests via the Axios client (`src/api.ts`) automatically attach the `Authorization: Bearer <token>` header.
3. **Session Resiliency & Expiry Handling**: Global Axios response interceptors monitor for `401 Unauthorized` responses, automatically purging expired local sessions and routing users to the login screen.
4. **Protected Route Guards**: The `ProtectedRoute` component validates both active authentication status and authorized user roles before rendering sensitive dashboard views.

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster

### 1. Clone the Repository
```bash
git clone https://github.com/kirank414/Care24.git
cd Care24
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variable Setup
Create a `.env` file in the root directory based on the provided `.env.example`. Ensure your sensitive credentials are configured correctly:

```env
# MongoDB Atlas Cloud Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/care24?retryWrites=true&w=majority"

# JWT Secret Key for Session Signing
JWT_SECRET="your_super_secret_jwt_signing_key_here"

# Server Port
PORT=3000

# Environment Mode
NODE_ENV="development"
```

> [!IMPORTANT]  
> The `.env` file is explicitly ignored in `.gitignore` to prevent sensitive database credentials and signing secrets from being exposed to public version control.

---

## 🖥️ Running the Application

### Development Mode
To launch both the Express backend API and the Vite React frontend concurrently:

```bash
npm run dev
```

* **Frontend UI / Client**: Accessible at `http://localhost:3000`
* **Backend API Endpoints**: Accessible at `http://localhost:3000/api`

### Production Build & Linting
To verify TypeScript compilation and build the production client bundle:

```bash
# Run TypeScript linter
npm run lint

# Build production assets
npm run build
```

---

## 📁 Project Structure

```
Care24/
├── lib/                     # Database connection & backend utilities
│   └── db.ts                # Mongoose connection logic with fallback mode
├── middleware/              # Express middleware
│   └── authMiddleware.ts    # JWT verification & route protection
├── models/                  # Mongoose ODM schemas
│   └── User.ts              # User schema with bcrypt pre-save middleware
├── routes/                  # Express API routes
│   └── authRoutes.ts        # Login, signup, and profile endpoints
├── src/                     # React Frontend Source
│   ├── api.ts               # Axios client configuration & interceptors
│   ├── store.ts             # Zustand authentication state store
│   ├── App.tsx              # Root component & protected route definitions
│   ├── components/          # Reusable UI components & layouts
│   │   ├── common/          # Navbar, Footer, etc.
│   │   └── ProtectedRoute.tsx # RBAC route guard component
│   ├── pages/               # Application views (Home, Login, Signup, Dashboards)
│   └── ...
├── .env.example             # Template for required environment variables
├── .gitignore               # Version control exclusion rules
├── package.json             # Project dependencies & npm scripts
└── server.ts                # Express server entry point & Vite middleware
```

---

## 🔒 Security & Deployment Readiness

* **Zero Credential Exposure**: `.gitignore` strictly excludes `.env*`, `node_modules`, `dist`, `build`, and debug logs.
* **Database Resiliency**: Includes a graceful mock fallback mode in `lib/db.ts` to maintain UI/UX operability even during cloud database maintenance.
* **Production Ready**: Fully optimized for deployment on cloud platforms like AWS, Render, Heroku, or Vercel/Netlify (decoupled).

---

<div align="center">
  <p>Built with ❤️ for elderly healthcare excellence.</p>
  <p>© 2026 Care24 Inc. All Rights Reserved.</p>
</div>
