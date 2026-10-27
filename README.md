# FitLog

FitLog is a workout library and daily training planner. Browse twelve exercises, read workout instructions, build today's plan, and save workouts for later.

- Live site: my-fitness-app-sage.vercel.app
- GitHub repository: NazninAkthery/my-fitness-app

## Features

- Workout library: Browse twelve exercises with images, muscle groups, equipment, duration, calories, and ratings.
- Sorting: Sort exercises by duration, calories, or rating.
- Workout details: View descriptions, difficulty, sets, reps, and step-by-step instructions.
- Today's plan: Add up to five workouts and track total exercises, minutes, and calories.
- Saved workouts: Save exercises for later in a separate tab.
- Workout tracking: Mark planned exercises as done or remove them from the plan.
- Toast notifications: Receive feedback when adding, saving, completing, or removing workouts.
- Persistent selections: Keep plan, saved, and completed workout selections across page reloads using localStorage.
- Responsive layouts: Dedicated layouts for mobile, tablet, and desktop, with loading indicators and not-found pages.

## Technologies Used

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4 and custom CSS
- React Context for shared state
- Browser localStorage for persistence
- FitLog API for workout data

## Getting Started

Requires Node.js 20.9 or later and npm.

git clone https://github.com/NazninAkthery/my-fitness-app.git
cd my-fitness-app
npm ci
npm run dev

Open http://localhost:3000.

## Production Build

npm run build
npm start

## Pages

| Route | Description |
|---|---|
| / | Browse and sort the workout library |
| /workout/[id] | View workout details and add exercises to the plan or saved list |
| /my-plan | Manage today's plan and saved workouts |

## Workout API

The app fetches workout data through /api/workouts. If the primary API fails, it automatically tries the alternative API.

- Primary API
- Alternative API
