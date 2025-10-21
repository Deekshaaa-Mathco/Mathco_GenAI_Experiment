# Deployment TODO List

## Completed
- [x] Set up Git Repository (done).
- [x] Create a GitHub repository (done).
- [x] Push code to GitHub (done).
- [x] Set up Supabase Project (done).
- [x] Get the DATABASE_URL from Supabase dashboard (done).
- [x] Migrate existing database schema to Supabase (done).
- [x] Deploy Frontend to Vercel (done).

## Pending
- [x] Prepare Backend for Deployment
  - [x] Update backend/server.js to export app for Vercel (instead of listen).
  - [x] Add vercel.json for Vercel configuration.
  - [ ] Set environment variables in Vercel: DATABASE_URL, JWT_SECRET, etc.
- [ ] Deploy Backend to Vercel
  - [ ] Deploy backend from GitHub to Vercel.
  - [ ] Get the deployed backend URL.
- [x] Update Frontend for Production
  - [x] Update frontend/src/context/AuthContext.jsx to use deployed backend URL instead of localhost:3001.
  - [ ] Redeploy frontend to Vercel.
- [ ] Test Deployed Application
  - [ ] Test authentication, API calls, and database interactions.
  - [ ] Verify CORS and environment variables.
- [ ] Final Checks
  - [ ] Ensure all routes work.
  - [ ] Check for any hardcoded localhost references.
