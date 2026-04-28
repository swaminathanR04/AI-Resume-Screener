# AI Resume Screener

This project lets applicants upload resumes and apply for jobs, while admins review resumes, run AI scoring, and manage the hiring flow.

## Quick Start

1. Clone the repo and install packages.

```bash
git clone <your-repository-url>
cd AI-Resume-Screener
pnpm install
```

2. Copy the env file.

macOS/Linux:

```bash
cp .env.example .env
```

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Update `.env` with these values:

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

4. Install and start Ollama.

```bash
ollama pull llama3.2:3b
```

5. Reset and seed the local database.

```bash
pnpm prisma:reset
```

6. Start the app.

```bash
pnpm dev
```

The app runs at `http://localhost:3000`.

## Local Login

Use this seeded admin account:

```text
alice@example.com
```

Login uses email OTP.

If that inbox is not real, get the OTP from Prisma Studio:

1. Start the app with `pnpm dev`
2. Open `http://localhost:3000/auth`
3. Enter `alice@example.com`
4. Open Prisma Studio
5. Check the `Verification` table
6. Copy the OTP and sign in

## What Gets Seeded

Running `pnpm prisma:reset` creates:

- admin user: `alice@example.com`
- applicant user: `bob@example.com`
- applicant user: `jamie.applicant@example.com`
- one sample job listing
- one sample resume for Bob

The sample resume file comes from [prisma/seed-assets/bob-builder-resume.pdf](c:/Users/swami/OneDrive/Desktop/CS%203354/AI-Resume-Screener/prisma/seed-assets/bob-builder-resume.pdf).

## Important Notes

### Admin access

Admin access is hardcoded in [server/utils/user-role.ts](c:/Users/swami/OneDrive/Desktop/CS%203354/AI-Resume-Screener/server/utils/user-role.ts).

You are treated as admin only if:

- your name is `alice`, or
- your email starts with `alice@`

### Resume storage

Resume PDFs are saved on disk.

- default folder: `.data/uploads`
- path format: `users/<userId>/resumes/<uuid>.pdf`
- database stores only the relative path

If `UPLOAD_STORAGE_PATH` is set, resumes are saved there instead.

### Database reset

`pnpm prisma:reset` deletes and recreates your local database. Use it only for local development.

## Common Commands

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

## If Something Breaks

OTP email not arriving:

- check `EMAIL_*` values
- use a Gmail app password if needed
- read the OTP from Prisma Studio for local testing

Prisma model missing or undefined:

```bash
pnpm exec prisma generate
```

Then restart the dev server if needed.

AI scoring not working:

- make sure Ollama is running
- make sure `llama3.2:3b` is pulled
- restart the app after changing `.env`
