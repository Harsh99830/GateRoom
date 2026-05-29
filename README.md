# GateRoom

GateRoom is a data-driven GATE preparation platform that helps aspirants benchmark their preparation against previous years' AIR toppers and get a predicted rank based on their actual study data.

Most GATE aspirants don't know where they stand until the results come out. GateRoom solves this by collecting real preparation data — study hours, mock scores, PYQs solved, subjects completed — and comparing it against what actual AIR rankers did at the same stage of preparation. The result is a live predicted rank that updates as the student progresses.

## Core Idea

Students often watch interviews of AIR toppers but have no way to systematically compare their own preparation with those toppers. GateRoom bridges that gap:

- A student logs their daily activity (what they studied, mock score, PYQs solved) in a 20-second daily check-in.
- Their data is compared against a database of AIR rankers' preparation patterns — hours per day, syllabus completion timeline, mock score trajectory, PYQ count, revision cycles.
- The platform shows a predicted AIR rank range and highlights exactly where the student is ahead or behind relative to their target rank.

## Features

- **Predicted AIR Rank**: A live rank estimate (e.g. AIR 200–500) calculated from mock scores, study hours, syllabus coverage, PYQs solved, and revision cycles — weighted by their actual predictive power.
- **Daily Check-in**: A 20-second tap-based check-in card. Select what you did today (studied a subject, gave a mock, solved PYQs, revision, rest day) and the platform updates your rank estimate instantly.
- **You vs Rankers Comparison**: Side-by-side bar comparison of your metrics against AIR 1, AIR 50, and AIR 100 rankers for every key data point.
- **Prep Timeline**: A month-by-month timeline showing where AIR toppers were at each stage of preparation and where you currently stand on that same timeline.
- **Subject Coverage Tracker**: Visual grid of all GATE subjects showing which are complete, in progress, behind schedule relative to AIR rankers, or not started yet.
- **Mock Score Trajectory**: Your mock score trend compared against what AIR rankers scored at the same point in their preparation.
- **Aspirant Feed**: A community feed where students share prep updates, ask doubts, and encourage each other.

## Data Model

GateRoom works with two types of data:

**AIR Ranker Data** (collected via interviews and structured forms from previous toppers):
- Preparation timeline, hours per day phase-wise, subjects completed and when
- Mock test series used, number of mocks, score trajectory
- PYQ strategy, revision cycles, weak areas and how they were fixed

**User Data** (collected at signup + daily check-in):
- Signup: branch, target year, attempt number, college type, months of prep done, hours per day, test series, first mock score
- Daily: subject studied, mock score if given, PYQs solved, whether it was a revision day or rest day

## Rank Prediction Formula

The predicted rank is calculated by weighting each prep signal:

| Signal | Weight |
|---|---|
| Latest mock score | 40% |
| Study hours pace | 20% |
| Syllabus coverage | 15% |
| PYQ completion | 15% |
| Revision cycles | 10% |

The student's weighted score is matched against ranker profiles to produce a rank range, not a single number.

## Tech Stack

### Frontend
- **Framework**: React.js (Vite)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Authentication**: Google OAuth (`@react-oauth/google`)

### Backend
- **Framework**: Node.js & Express
- **Authentication**: Google OAuth + JWT
- **Database**: Supabase (PostgreSQL)
  - `profiles` table — linked to Supabase `auth.users`
  - `gate_profiles` table — all prep and onboarding data
  - `daily_checkins` table — daily activity log per user

## Installation & Setup

### Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_KEY=your_supabase_service_role_key
```

Start the server:

```bash
npm run dev
```

### Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

Start the dev server:

```bash
npm run dev
```

## Supabase Schema

Run the following in your Supabase SQL editor to set up the required tables:

```sql
-- User profiles (linked to auth.users)
create table profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  name text,
  email text unique,
  avatar_url text,
  google_id text,
  updated_at timestamptz default now()
);

-- GATE preparation profiles
create table gate_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  branch text,
  target_year text,
  attempt_number int default 1,
  college_type text,
  months_of_prep int default 0,
  hours_per_day numeric,
  test_series text,
  first_mock_score numeric,
  no_mock_yet boolean default false,
  onboarding_done boolean default false,
  updated_at timestamptz default now()
);

-- Daily check-ins
create table daily_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  date date not null,
  activity_type text,        -- 'study' | 'mock' | 'pyq' | 'revision' | 'rest'
  subject text,
  hours numeric,
  mock_score numeric,
  pyq_count int,
  created_at timestamptz default now(),
  unique(user_id, date)
);
```

## Deployment

- **Frontend**: Deploy to Vercel. Set `VITE_API_URL` and `VITE_GOOGLE_CLIENT_ID` in environment variables.
- **Backend**: Deploy to Render or Railway (not serverless — needs a persistent process). Set all `.env` variables in the platform dashboard.

---

*Built for GATE aspirants who want to know exactly where they stand — not after results, but every single day.*
