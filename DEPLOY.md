# Vercel Deployment Guide

To successfully deploy QuizGenius to Vercel, you need to add the following Environment Variables in the Vercel Dashboard (Project Settings > Environment Variables).

## Required Environment Variables

| Variable Name | Description | Source |
|---|---|---|
| `VITE_SUPABASE_URL` | Your Supabase Project URL | Supabase Dashboard > Project Settings > API |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase Project Anon public API key | Supabase Dashboard > Project Settings > API |
| `VITE_GEMINI_API_KEY` | Your Google Gemini API Key | Google AI Studio |

**Note**: All environment variables that should be exposed to the client-side code in a Vite application must be prefixed with `VITE_`.

## Deployment Steps
1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Log in to Vercel and click "Add New..." -> "Project".
3. Import your Git repository.
4. Expand the **Environment Variables** section and add the keys/values listed above.
5. Click **Deploy**. Vercel will automatically run `npm run build` and respect the `vercel.json` rewrites rules for SPA.
