# AI Interview Coach

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Build](https://github.com/rayanib/ai-interview-coach/actions/workflows/ci.yml/badge.svg)](https://github.com/rayanib/ai-interview-coach/actions/workflows/ci.yml)

AI Interview Coach is a full-stack web application that helps job seekers prepare for interviews
based on their own CV and a target job description.

The application extracts text from a PDF CV, compares its skills with the job requirements,
generates ten relevant interview questions, evaluates the user's answers, and produces a final
report with strengths and topics to improve.

> This is a junior developer learning project. Version 1 uses transparent, rule-based analysis
> instead of claiming to use a paid AI service. A future version can connect to a local Ollama model.

## Why I built this project

I built this project to practice how the parts of a real full-stack application work together:

- Designing a multi-step user experience with React
- Creating REST API routes with Express
- Uploading and reading PDF files on the server
- Storing related data in a PostgreSQL database
- Comparing text with simple, explainable algorithms
- Handling loading states, validation, errors, and API responses
- Keeping environment variables and credentials outside source control

## Main features

- Upload a text-based PDF CV, with file type and size validation
- Extract CV text on the backend with `pdf-parse`
- Compare CV skills with a pasted job description
- Display match percentage, strong skills, and missing skills
- Generate ten HR, technical, and project questions
- Present one interview question at a time
- Score answers from 1 to 100 using understandable rules
- Suggest good points, missing points, and an improved answer structure
- Build and save a complete final interview report
- Preserve the active interview session after a page refresh

## Application flow

```mermaid
flowchart LR
    A["Upload PDF CV"] --> B["Extract and store CV text"]
    B --> C["Paste job description"]
    C --> D["Compare skill keywords"]
    D --> E["Generate 10 questions"]
    E --> F["Submit answers"]
    F --> G["Create rule-based feedback"]
    G --> H["Show final report"]
```

## Tech stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend | React 19, Vite, React Router | Pages, navigation, forms, and UI state |
| Backend | Node.js, Express | REST API and application logic |
| Database | Supabase PostgreSQL | Sessions, questions, answers, and reports |
| File upload | Multer | Receives PDF files in memory |
| PDF processing | pdf-parse | Extracts text from uploaded CVs |
| Version control | Git and GitHub | Source history and automated build checks |

## Architecture

```text
Browser (React + Vite)
        |
        | HTTP requests
        v
Express REST API
        |
        +-- CV extraction service
        +-- Keyword matching service
        +-- Question generation service
        +-- Answer feedback service
        |
        v
Supabase PostgreSQL
```

The frontend never receives a Supabase key directly. It calls the Express backend, and the backend
reads its Supabase configuration from environment variables.

## How the rule-based coaching works

### Job matching

The job analysis service normalizes the CV and job description, searches for a list of common
skills, and separates them into:

- **Strong skills:** required keywords also found in the CV
- **Missing skills:** required keywords not found in the CV
- **Match percentage:** matched required skills divided by all recognized required skills

### Answer feedback

The feedback service gives points for:

- Providing enough detail
- Using words that show reasoning, action, and results
- Including a number or measurable outcome
- Answering with a clear example

This logic is intentionally simple. It is easy to inspect, explain, test, and later replace with a
local AI model.

## Database design

| Table | Stores |
| --- | --- |
| `profiles` | Basic user information for future authentication |
| `interview_sessions` | CV text, job description, and matching results |
| `interview_questions` | Generated questions and their order |
| `interview_answers` | Answers, scores, and detailed feedback |
| `final_reports` | A JSON snapshot of the completed report |

The SQL schema is available in [`server/supabase/schema.sql`](server/supabase/schema.sql).

## API endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/cv/upload` | Upload a PDF, extract its text, and create a session |
| `POST` | `/api/job/analyze` | Compare the saved CV with a job description |
| `POST` | `/api/interview/questions` | Create or load ten interview questions |
| `POST` | `/api/interview/answer` | Save one answer and return immediate feedback |
| `GET` | `/api/report/:sessionId` | Build, store, and return the final report |

## Project structure

```text
ai-interview-coach/
|-- client/                  # React frontend
|   `-- src/
|       |-- components/      # Reusable UI components
|       `-- pages/           # The five application pages
|-- server/
|   |-- src/
|   |   |-- config/          # Supabase configuration
|   |   |-- routes/          # Express API routes
|   |   |-- services/        # Matching, questions, and feedback logic
|   |   `-- utils/           # Shared backend helpers
|   `-- supabase/schema.sql  # Database tables
|-- .github/workflows/       # Automated build verification
`-- README.md
```

## Run locally

### Prerequisites

- Node.js 20 or newer
- npm
- A free Supabase project

### 1. Create the database

1. Create a project at [Supabase](https://supabase.com/).
2. Open the Supabase **SQL Editor**.
3. Copy and run [`server/supabase/schema.sql`](server/supabase/schema.sql).
4. Open **Project Settings > API** and copy the project URL and anon key.

### 2. Configure the backend

Copy `server/.env.example` to `server/.env`:

```env
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Configure the frontend

Copy `client/.env.example` to `client/.env`:

```env
VITE_API_URL=http://localhost:5000
```

The real `.env` files are excluded by `.gitignore` and must never be committed.

### 4. Install and start

```bash
npm install
npm run install:all
npm run dev
```

Open `http://localhost:5173`. The API runs on `http://localhost:5000`.

## Code tour for interviews

If you are reviewing this project with me, these are useful starting points:

- [`client/src/App.jsx`](client/src/App.jsx) defines the frontend routes and shared navigation.
- [`client/src/pages/Interview.jsx`](client/src/pages/Interview.jsx) manages the question-by-question flow.
- [`server/src/routes/cvRoutes.js`](server/src/routes/cvRoutes.js) handles PDF upload and text extraction.
- [`server/src/services/analysisService.js`](server/src/services/analysisService.js) contains keyword matching.
- [`server/src/services/feedbackService.js`](server/src/services/feedbackService.js) explains answer scoring.
- [`server/src/routes/reportRoutes.js`](server/src/routes/reportRoutes.js) combines the stored data into a report.

The source includes beginner-friendly comments that explain important decisions and functions.

## What I would improve next

- Add Supabase Auth and user-specific Row Level Security policies
- Connect Ollama for optional local AI feedback
- Add OCR support for scanned PDF documents
- Add unit and API integration tests
- Add rate limiting and stronger production file security
- Deploy the frontend and backend and add an application demo
- Improve skill recognition beyond exact keyword matching

## Important security note

Version 1 is designed as a local learning project and does not include authentication. Do not use it
for real personal CV data in a public deployment until Supabase Auth and Row Level Security are added.

## Author

Created by [rayanib](https://github.com/rayanib) as a full-stack learning and portfolio project.

## License

This project is available under the [MIT License](LICENSE).
