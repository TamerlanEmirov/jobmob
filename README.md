# JobMob

An AI-powered job board and applicant tracking platform. Employers post jobs and manage applicants; job seekers browse and apply.

## Features

- Role-based accounts (Job Seeker / Employer) with Clerk authentication
- Employer dashboard: create, edit, delete and search job listings
- Job seeker flow: browse jobs and apply
- Applications management: employers accept or reject applicants
- Profile pages

**Planned:** saved jobs, advanced search and filters, notifications, CV upload, AI CV-to-job matching

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, TypeScript
- **Database:** PostgreSQL with Prisma
- **Auth:** Clerk

## Getting Started

### Prerequisites

- Node.js 20+
- A PostgreSQL database (e.g. Neon or Supabase)
- A Clerk account

### 1. Clone

```bash
git clone https://github.com/TamerlanEmirov/jobmob.git
cd jobmob
```

### 2. Server

```bash
cd server
npm install
cp .env.example .env   # fill in your own values
npx prisma migrate dev
npm run dev
```

### 3. Client

```bash
cd client
npm install
cp .env.example .env.local   # fill in your own values
npm run dev
```

The client runs on http://localhost:3000.

## Project Structure

```
jobmob/
  client/   # Next.js frontend
  server/   # Express API + Prisma
```
