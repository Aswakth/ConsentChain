# ConsentChain

ConsentChain is a smart, consent-based cloud file access manager that acts as a secure middleware between users and cloud storage. It enables privacy-first, transparent, and auditable file sharing by allowing users to manage file access through explicit consent.

## Features

- OAuth 2.0 Authentication with Google
- Consent-based access control for files
- Cloud file upload and management
- JWT-secured routes and user sessions
- Consent expiry and automatic revocation
- Dashboard with file access analytics
- PostgreSQL database with Prisma ORM
- Planned: File usage audit trail, request workflow, encryption, and more

## Tech Stack

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS

**Backend**
- Node.js with Express
- Google OAuth 2.0
- JSON Web Tokens (JWT)
- PostgreSQL with Prisma ORM

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/ConsentChain.git
cd ConsentChain
```

### 2. Backend Setup

```bash
cd backend
npm install
npx prisma generate
npm run dev
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
npm run dev
```

### 4. Environment Variables

Create `.env` files in both the `backend` and `frontend` directories.

**Backend `.env` example:**
```
DATABASE_URL=your_postgresql_database_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret
```

**Frontend `.env` example:**
```
VITE_BACKEND_URL=http://localhost:5000
```
