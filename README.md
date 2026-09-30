# 360 Waste Management

A multi-role smart waste-management dashboard built with React, TypeScript, Vite, Firebase, maps, analytics, QR workflows, and Gemini-powered assistance.

The application is designed as a prototype platform for households, waste collectors, municipal officers, administrators, and state-level departments to view waste activity from different operational perspectives.

## Highlights

- **Role-based dashboards** for households, collectors, officers, administrators, and department users.
- **Smart-bin status** with fill-level and status visualization.
- **Household reward points** and recent waste-log tracking.
- **QR-based household identification** for collection workflows.
- **Collector route map** using Leaflet.
- **AI waste assistant** for household questions.
- **Image-based bin analysis** through Gemini Vision.
- **Municipal and state analytics** with charts and map views.
- **Firebase authentication / Firestore integration** available in the codebase.
- **Responsive React UI** with motion, reusable components, and protected routes.

## User Roles

| Role | Main Experience |
| --- | --- |
| Household | Waste history, smart-bin status, points, QR identity, AI assistant |
| Collector | Assigned route, bin priority, QR scan flow, photo analysis |
| Officer | Zone-level monitoring and operational views |
| Admin | User management, platform metrics, gamification configuration |
| Department | State-level analytics, trends, district comparison, heatmap |

## Current Development Mode

The project currently runs with **mock mode enabled** in the authentication context so the UI can be demonstrated without a live Firebase login.

For production use, review `src/contexts/AuthContext.tsx`, disable mock mode, configure Firebase, and validate all authorization rules server-side.

## Tech Stack

- React 18
- TypeScript
- Vite
- React Router
- Firebase Authentication / Firestore
- Google Generative AI
- Leaflet / React Leaflet
- Recharts
- Framer Motion
- QRCode / QR reader
- Tailwind utility tooling

## Getting Started

### Prerequisites

- Node.js 18+ recommended
- npm
- A Firebase project if you want live authentication/data
- A Gemini API key if you want AI features

### Install

```bash
git clone https://github.com/KVL3159H/360-waste-management.git
cd 360-waste-management
npm install
```

### Environment Variables

Create a `.env` file in the project root when using live integrations:

```env
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id

VITE_GEMINI_API_KEY=your_gemini_key
```

Do not commit real credentials.

### Run Locally

```bash
npm run dev
```

Vite will print the local development URL in the terminal.

## Available Scripts

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

## Application Routes

The project uses protected role-based routes including:

- `/household`
- `/collector`
- `/officer`
- `/admin`
- `/dept`

The root route redirects to the login flow.

## Architecture

```text
src/
├── components/       reusable UI and layout components
├── contexts/         authentication and language state
├── hooks/            shared application data hooks
├── lib/              Firebase and Gemini integrations
├── pages/
│   ├── household/
│   ├── collector/
│   ├── officer/
│   ├── admin/
│   └── state/
├── App.tsx            routing and role protection
└── main.tsx           React entry point
```

## Security Notes

This repository is a prototype. Before real deployment:

- disable mock authentication;
- enforce Firebase security rules;
- move privileged operations to trusted backend services;
- restrict API keys appropriately;
- never rely only on client-side role checks;
- validate uploaded images and user-controlled data;
- review privacy requirements before storing household/location data.

## Roadmap

- Replace mock authentication with production Firebase auth.
- Add server-enforced role and permission checks.
- Persist collector completion workflows.
- Add production-ready waste-event APIs.
- Add automated tests for protected routes and core business rules.
- Add deployment documentation and monitoring.

## Contributing

Useful contributions include bug fixes, accessibility improvements, tests, documentation, and production-hardening work. Keep pull requests focused and include a short explanation of the behavior changed.

---

Built as a smart waste-management prototype focused on visibility from household level to state-level administration.

## Development Quality Check

Before opening a pull request, run:

```bash
npm run lint
npm run build
```

The CI workflow runs the same production checks so local verification matches the repository pipeline.
