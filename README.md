# AI Interview Coach

AI Interview Coach is a beginner-friendly full-stack practice app. A user uploads a PDF CV,
adds a job description, answers ten interview questions, and receives rule-based feedback.
Version 1 uses no paid AI APIs.

## Tech stack

- React and Vite frontend
- Node.js and Express backend
- Supabase PostgreSQL database
- `multer` for PDF uploads
- `pdf-parse` for CV text extraction

## Project structure

```text
ai-interview-coach/
├── client/                 # React frontend
├── server/
│   ├── src/                # Express API and rule-based services
│   └── supabase/schema.sql # Database setup
├── .gitignore
└── README.md
```

## 1. Create the Supabase database

1. Create a free project at [Supabase](https://supabase.com/).
2. Open **SQL Editor** in the Supabase dashboard.
3. Copy and run `server/supabase/schema.sql`.
4. Open **Project Settings → API** and copy the project URL and anon key.

Version 1 has no user authentication, so the schema does not enable Row Level Security.
Add Supabase Auth and user-specific RLS policies before deploying real user data.

## 2. Configure environment variables

Create `server/.env` from `server/.env.example`:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

Create `client/.env` from `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

Never commit either `.env` file. They are already excluded by `.gitignore`.

## 3. Install and run

From the project root:

```bash
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:5000`.

## API routes

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/api/cv/upload` | Upload and extract a PDF CV |
| POST | `/api/job/analyze` | Compare CV and job keywords |
| POST | `/api/interview/questions` | Create or load ten questions |
| POST | `/api/interview/answer` | Save an answer and generate feedback |
| GET | `/api/report/:sessionId` | Build and store the final report |

## How version 1 works

The job matcher searches for a clear list of common technical and workplace skills. The answer
reviewer checks answer length, reasoning words, and measurable details. These rules are intentionally
simple and transparent. A future version can replace the service functions with a local Ollama model
without changing the page flow or database structure.

## Production notes

- Add authentication and Row Level Security before storing real CVs.
- Add rate limiting, stricter file validation, and malware scanning.
- Use a private server-side Supabase key only if future protected operations require it.
- Add OCR if scanned CVs must be supported.
