# Bugema University — Student Performance Dashboard

This is a Student Performance Dashboard built with React (Vite) and a mock REST API (json-server). It is intended as an individual exam project. The UI uses Material-UI and Chart.js; global state uses React Context.

Quick summary (features)
- Login (mocked) and protected routes
- Students list: sorting, filtering, pagination, search-as-you-type
- Add / Edit / Delete students (modals + confirmation)
- Student detail: profile, courses, animated GPA trend chart, export profile to PDF
- Dashboard: cards, distribution and trend charts, skeleton loaders, PDF export
- Reports: average GPA per course, top performers, students at risk, CSV & PDF export
- Theme (light/dark), notifications (snackbar)
- Mock API using json-server (endpoints: GET/POST/PUT/DELETE /students, GET /users)

Beginner-friendly setup & run instructions

Prerequisites
1. Install Node.js LTS (v18+ recommended). Check with:
   node -v
2. A code editor (VS Code recommended).

Steps
1. Clone or copy this project into a folder on your machine.
2. Open a terminal in the project folder.
3. Install dependencies:
   npm install
4. Start the development servers (both the React app and the mock API):
   npm run dev
   - Vite dev server will run on: http://localhost:5173
   - json-server API will run on: http://localhost:3001/api
5. Open your browser and visit: http://localhost:5173

User credentials (for login)
- username: admin
- password: password123

Notes
- The json-server stores data in db.json. Changes made via the UI (add/edit/delete) update db.json while the API is running.
- To run json-server only:
  npm run start:api
- To build for production:
  npm run build

Troubleshooting
- If port 5173 or 3001 is already in use, either stop the process using them or change the ports in the scripts.
- If PDF export fails due to cross-origin content, ensure images are loaded with CORS or avoid external images when exporting.

Project structure
See the top of this README for a summary. Each major folder groups related files:
- context: state for auth, students, theme, notifications
- components: reusable UI elements and layout
- pages: route views
- services: API calls (axios wrapper)
- utils: helper functions such as PDF export

Designed and developed by Masai Timothy
Massatimo@gmail.com 