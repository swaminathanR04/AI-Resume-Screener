# AI Resume Screener (Better Auth + Prisma + SQLite)

A modern Nuxt 4 project for applicant resume uploads, admin resume review, AI-assisted scoring, and hiring workflow management.

## Features

- **Nuxt 4**: Frontend and server routes in one app.
- **Better Auth**: Email OTP authentication.
- **Prisma**: Type-safe ORM for database access.
- **SQLite**: Simple local database for development.
- **Nuxt UI**: UI components for the applicant and admin dashboards.
- **Nodemailer**: OTP email delivery.
- **Ollama**: Local AI resume scoring.

## Stack

- **Framework**: Nuxt
- **Auth**: Better Auth
- **ORM**: Prisma
- **Database**: SQLite
- **UI Framework**: Nuxt UI
- **Email**: Nodemailer
- **AI Scoring**: Ollama

## Getting Started

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd AI-Resume-Screener
```

### 2. Install dependencies

This project uses `pnpm`.

```bash
pnpm install
```

### 3. Set up environment variables

Copy the example environment file.

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the following:

- `DATABASE_URL`: SQLite connection string. Default: `file:./dev.db`
- `BETTER_AUTH_SECRET`: Secure random string for auth encryption
- `BETTER_AUTH_URL`: App URL. Default: `http://localhost:3000`
- `EMAIL_USER`: SMTP email account used for OTP emails
- `EMAIL_PASS`: SMTP password or app password
- `EMAIL_FROM`: Sender email address
- `EMAIL_HOST`: SMTP host, such as `smtp.gmail.com`
- `UPLOAD_STORAGE_PATH`: Optional custom folder for uploaded files. If blank, the app uses `.data/uploads`
- `AI_PROVIDER`: Keep this as `ollama`
- `OLLAMA_BASE_URL`: Ollama server URL. Default: `http://127.0.0.1:11434`
- `OLLAMA_MODEL`: Ollama model name. Default: `llama3.2:3b`

If you are using Gmail for OTP emails:

- `EMAIL_USER`: your Gmail address
- `EMAIL_PASS`: your Gmail App Password
- Google guide for app passwords: https://support.google.com/accounts/answer/185833

Example `.env` values:

```bash
DATABASE_URL=file:./dev.db
BETTER_AUTH_SECRET=replace-with-a-random-secret
BETTER_AUTH_URL=http://localhost:3000
EMAIL_USER=your-smtp-email@example.com
EMAIL_PASS=your-smtp-password-or-app-password
EMAIL_FROM=your-smtp-email@example.com
EMAIL_HOST=smtp.gmail.com
UPLOAD_STORAGE_PATH=
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://127.0.0.1:11434
OLLAMA_MODEL=llama3.2:3b
```

### 4. Start Ollama

Install Ollama and pull the model used by the app:

```bash
ollama pull llama3.2:3b
```

If Ollama is not installed, the website still works, but AI reason text will show `AI not configured` and the score will show `-/10`.

### 5. Database setup

Initialize the local database, apply migrations, generate Prisma, and seed sample data:

```bash
pnpm prisma:reset
```

This is a local development reset command. It recreates your local database.

### 6. Start the development server

```bash
pnpm dev
```

The app runs at `http://localhost:3000`. This command also starts Prisma Studio.

## How to Login

Login requires an email that exists in the seeded database.

- **Option A: Use the seeded admin**
  Sign in with `alice@example.com`
- **Option B: Use a different email**
  Update `prisma/seed.ts`, then run `pnpm prisma:reset` again

To get the OTP:

- Check your configured email inbox
- Or open Prisma Studio and read the OTP from the `Verification` table

## Seeded Data

The seed creates:

- admin user: `alice@example.com`
- applicant user: `bob@example.com`
- applicant user: `jamie.applicant@example.com`
- one sample job listing
- one sample resume for Bob

The sample PDF is included in the repo at `prisma/seed-assets/bob-builder-resume.pdf`, so other people will get it when they clone the repository.

## Important Notes

### Admin access

Admin access is currently hardcoded in `server/utils/user-role.ts`.

You are treated as an admin only if:

- your name is `alice`, or
- your email starts with `alice@`

### Resume storage

Uploaded resume PDFs are saved on disk.

- default folder: `.data/uploads`
- path format: `users/<userId>/resumes/<uuid>.pdf`
- database stores only the relative path

If `UPLOAD_STORAGE_PATH` is set, resumes are saved there instead.

Sample PDFs that should exist for everyone, like Bob's seeded resume, should stay in the repository under `prisma/seed-assets/`.

### GitHub and other PCs

This repo should work on other computers as long as the setup steps are followed.

Commit source files, migrations, seed assets, and docs.
Do not commit local-only files like `.env`, `.nuxt`, `.output`, `.data`, `node_modules`, or `dev.db`.

## Common Commands

Install dependencies:

```bash
pnpm install
```

Start dev server:

```bash
pnpm dev
```

Build app:

```bash
pnpm build
```

Preview production build:

```bash
pnpm preview
```

Reset and reseed database:

```bash
pnpm prisma:reset
```

Regenerate Prisma client:

```bash
pnpm exec prisma generate
```

Run Prisma migrations:

```bash
pnpm exec prisma migrate dev
```

## Project Structure

- `app/`: Frontend pages, components, composables, and UI logic
- `server/`: API routes, auth logic, Prisma access, AI scoring, and file handling
- `prisma/`: Schema, migrations, seed script, generated client, and seed assets
- `public/`: Static assets
- `docs/`: Supporting project notes

## If Something Breaks

### OTP email not arriving

- check `EMAIL_*` values
- use a Gmail app password if needed
- read the OTP from Prisma Studio for local testing

### Prisma model missing or undefined

```bash
pnpm exec prisma generate
```

Then restart the dev server if needed.

### AI scoring not working

- make sure Ollama is running
- make sure `llama3.2:3b` is pulled
- restart the app after changing `.env`
