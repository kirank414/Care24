<div align="center">
  <div style="background: #0f172a; padding: 40px; border-radius: 24px;">
    <h1 style="color: #3b82f6; font-size: 48px; margin: 0;">Care24</h1>
    <p style="color: #94a3b8; font-size: 20px; margin-top: 10px;">Premium Full-Stack Elderly Nursing & Healthcare Assistance SaaS</p>
  </div>
</div>

<br />

[![React](https://img.shields.io/badge/React-19.x-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg?style=flat-square&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg?style=flat-square&logo=express)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB_Atlas-Cloud-brightgreen.svg?style=flat-square&logo=mongodb)](https://www.mongodb.com/cloud/atlas)
[![JWT Auth](https://img.shields.io/badge/JWT_Auth-Secure-orange.svg?style=flat-square&logo=json-web-tokens)](https://jwt.io/)

---

## 🌟 Project Overview

**Care24** is a web-based service portal that connects senior citizens and their families with verified healthcare professionals (nurses, caregivers, physiotherapists, and attendants) providing in-home medical and non-medical assistance. Care24 digitizes booking and scheduling, caregiver onboarding/vetting, clinical care note logging, complaints management, and live administrative KPI metrics reporting.

---

## 🚀 Key Features

* 🔐 **Authentication & RBAC**: Signup, Login, and protected routes with JWT access tokens for three distinct roles: `user` (Patient/Family), `caregiver` (Service Agent), and `admin` (Administrator).
* 📋 **Patient Management**: Patient clinical profiles detailing demographic info, blood pressure, mobility status, allergies, chronic conditions, and emergency contacts.
* 👨‍⚕️ **Caregiver Management**: Professional caregiver profiles listing clinical titles, certifications, hourly rates, availability toggle, and service cities/regions.
* 🗂️ **Service Modalities**: Admin console to create, modify, and configure in-home service modalities.
* 📅 **Booking Lifecycles**: Multi-state scheduling flows (`pending` -> `confirmed` -> `active` -> `completed` / `cancelled`) with total shift cost estimations.
* 🩺 **Care Notes & Telemetry**: Caregiver logs containing patient observations and vital signs (Heart Rate, BP, SpO2, Temperature). Abnormal parameters dynamically trigger SOS flags on dashboards.
* ⚠️ **Complaints Queue**: Dispute ticket submission form for users; resolution and escalation management panel for admins.
* 📊 **Dynamic KPIs**: Dynamic operational calculations directly from database collections, displaying user totals, verified caregiver count, booking completion rates, average response time, CSAT ratings, and MAUs.

---

## 🏛️ System Architecture

Care24 uses a modern decoupled architecture:

```
┌─────────────────────────────────┐           HTTP REST Requests           ┌─────────────────────────────────┐
│         Vite / React            ├───────────────────────────────────────►│         Node / Express          │
│     (Zustand State Store)       │◄───────────────────────────────────────┤          API backend            │
│  Tailwind CSS UI / Flow Routing │        JSON Session Responses          │  Middleware (JWT / Auth Guard)   │
└─────────────────────────────────┘                                        └────────────────┬────────────────┘
                                                                                            │
                                                                                    Mongoose ODM
                                                                                            │
                                                                                            ▼
                                                                           ┌─────────────────────────────────┐
                                                                           │          MongoDB Atlas          │
                                                                           │         Cloud Database          │
                                                                           └─────────────────────────────────┘
```

---

## 💾 MongoDB Schema Documentation

The system contains 7 Mongoose schemas corresponding to active database collections:

### 1. User (`users`)
Stores platform credentials and roles.
* `name` (String, required)
* `email` (String, required, unique)
* `password` (String, required, Bcrypt hashed)
* `role` (String, enum: `["user", "caregiver", "admin"]`, default: `"user"`)
* `timestamps` (createdAt, updatedAt)

### 2. Patient (`patients`)
Stores demographic data and medical profiles.
* `user` (ObjectId ref: `User`, required)
* `name` (String, required)
* `age` (Number, required)
* `gender` (String, required)
* `bloodGroup` (String, required)
* `address` (String, required)
* `phone` (String, required)
* `emergencyContact` (Subdocument: `name`, `phone`, `relation`)
* `medicalHistory` ([String])
* `allergies` ([String])
* `currentMedications` ([String])
* `mobilityStatus` (String, default: `"Independent"`)
* `careRequirements` ([String])
* `chronicConditions` ([String])
* `preferredLanguage` (String, default: `"English"`)

### 3. Caregiver (`caregivers`)
Stores professional credentials and regional service locations.
* `user` (ObjectId ref: `User`, required)
* `name` (String, required)
* `title` (String, required)
* `experienceYears` (Number, required)
* `hourlyRate` (Number, required)
* `bio` (String, required)
* `specialties` ([String])
* `languages` ([String])
* `cities` ([String]) - Caregiver service locations (e.g. `["New York", "Boston"]`)
* `availability` (Boolean, default: `true`)
* `isVerified` (Boolean, default: `false`)
* `rating` (Number, default: `5.0`)

### 4. ServiceCategory (`servicecategories`)
Stores details of available service modalities.
* `title` (String, required)
* `description` (String, required)
* `priceRange` (String, required)
* `icon` (String, default: `"Stethoscope"`)
* `features` ([String])

### 5. Booking (`bookings`)
Manages patient/caregiver care shifts.
* `patient` (ObjectId ref: `Patient`, required)
* `caregiver` (ObjectId ref: `Caregiver`, required)
* `service` (ObjectId ref: `ServiceCategory`, required)
* `startDate` (Date, required)
* `endDate` (Date, required)
* `status` (String, enum: `["pending", "confirmed", "active", "completed", "cancelled"]`, default: `"pending"`)
* `totalAmount` (Number, required)
* `paymentStatus` (String, enum: `["pending", "paid", "refunded"]`, default: `"pending"`)
* `notes` (String, default: `""`)

### 6. CareNote (`carenotes`)
Stores text logs and clinical vital signs telemetry.
* `booking` (ObjectId ref: `Booking`, required)
* `caregiver` (ObjectId ref: `Caregiver`, required)
* `patient` (ObjectId ref: `Patient`, required)
* `note` (String, required)
* `bloodPressure` (String)
* `heartRate` (Number)
* `spo2` (Number)
* `temperature` (Number)
* `isAlert` (Boolean, default: `false`)
* `alertReason` (String)

### 7. Complaint (`complaints`)
Manages patient reports and admin resolution logs.
* `patient` (ObjectId ref: `Patient`, required)
* `caregiver` (ObjectId ref: `Caregiver`, optional)
* `booking` (ObjectId ref: `Booking`, required)
* `title` (String, required)
* `description` (String, required)
* `status` (String, enum: `["pending", "resolved", "escalated"]`, default: `"pending"`)
* `resolution` (String, default: `""`)

---

## 🔌 API Endpoint Documentation

All backend API routes require a valid authentication token via the header: `Authorization: Bearer <JWT_Token>`.

### Authentication (`/api/auth`)
* `POST /signup` — Register a new account.
* `POST /login` — Authenticate credentials and return JWT + role.
* `GET /me` — Retrieve active profile.

### Patient Profile (`/api/patients`)
* `GET /me` — Get patient profile connected to user.
* `POST /` — Create/update patient profile.

### Caregiver Profile (`/api/caregivers`)
* `GET /` — Get verified caregivers.
* `GET /admin` — Get all caregivers (Admin only).
* `GET /me` — Get caregiver profile connected to user.
* `POST /` — Create/update caregiver profile.
* `PUT /:id/verify` — Approve caregiver verification status (Admin only).
* `PUT /:id/revoke` — Revoke approval status (Admin only).
* `PUT /:id/availability` — Toggle caregiver availability by admin (Admin only).
* `PUT /me/availability` — Toggle own availability status.
* `DELETE /:id` — Delete caregiver profile (Admin only).

### Services Modalities (`/api/services`)
* `GET /` — Get all service categories.
* `POST /` — Create service modality (Admin only).
* `PUT /:id` — Update service modality parameters (Admin only).

### Bookings (`/api/bookings`)
* `POST /` — Create shift booking request.
* `GET /me` — Fetch bookings for the logged-in user.
* `GET /` — Get all system bookings (Admin only).
* `PUT /:id/status` — Advance booking state (e.g. accept, commence, complete).
* `GET /revenue/me` — Fetch earnings overview and weekly trajectory (Caregiver only).
* `GET /admin/metrics` — Retrieve dynamically computed metrics (Admin only).

### Care Notes (`/api/notes`)
* `POST /` — Log clinical observations and vitals.
* `GET /me` — Get notes written by caregiver.
* `GET /booking/:bookingId` — Get care note records for a booking.

### Complaints (`/api/complaints`)
* `POST /` — File a booking dispute ticket.
* `GET /` — List complaints (Admin only).
* `PUT /:id` — Resolve or escalate a ticket with logging notes (Admin only).

### Notifications (`/api/notifications`)
* `GET /` — Retrieve user notifications.
* `GET /unread-count` — Count unread notifications.
* `PUT /:id/read` — Mark notification read.
* `PUT /read-all` — Mark all read.
* `DELETE /:id` — Remove notification.

---

## ⚙️ Setup & Installation Instructions

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Git](https://git-scm.com/)
* A [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account and cluster

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment variables
Create a `.env` file in the root folder matching the parameters below:
```env
# MongoDB Atlas Database URI Connection String
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.xxxxxx.mongodb.net/care24?retryWrites=true&w=majority"

# JWT Secret Signing Key
JWT_SECRET="care24_super_secret_signing_key_123"

# Port Configuration
PORT=3000

# Environment Level
NODE_ENV="development"
```

### 3. Verification Commands
To test validation and compile build:
```bash
# TypeScript compiler checks
npm run lint

# Compile production bundle
npm run build
```

### 4. Running the App
```bash
# Launch development servers
npm run dev
```
The application will serve on `http://localhost:3000`.

---

## 📦 Deployment Instructions

### MongoDB Atlas Whitelisting
To deploy, verify your production server's public IP address is whitelisted in your MongoDB Atlas cluster:
1. Navigate to **Network Access** in the MongoDB Atlas console.
2. Click **Add IP Address** and whitelist your production IP (or `0.0.0.0/0` for dynamic hosting instances like AWS EC2/Vercel).

### Deploying to Render / AWS / Vercel
1. Set the **Build Command** to: `npm run build`.
2. Set the **Start Command** to: `node server.js` (or use `tsx server.ts` dynamically in Node environments).
3. Bind all env variables (`MONGODB_URI`, `JWT_SECRET`, `PORT`, `NODE_ENV="production"`) on the cloud hosting configuration tab.
