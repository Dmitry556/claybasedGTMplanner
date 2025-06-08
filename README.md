# VeoGrowth GTM Generator v2

AI-powered GTM strategy and campaign generator that creates complete go-to-market plans in 60 seconds.

## New Architecture

This version uses Clay.com for AI processing instead of direct API calls:

1. User submits form → Vercel sends to Clay webhook
2. Clay processes with AI models (Gemini for research, Claude for strategy)
3. Clay sends results back to Vercel webhook
4. User sees results on beautiful tabbed interface

## Setup

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local` file:
   ```
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   NEXT_PUBLIC_LOGO_DEV_API_KEY=your_logo_dev_api_key (optional)
   ```

4. Update Clay webhook URL in `app/api/submit-to-clay/route.js` with your actual Clay webhook

5. In Clay, configure your webhook to:
   - Receive: job_id, email, website, positioning_clear, callback_url
   - Process with your AI workflow
   - Send back to callback_url: job_id, research_output, gtm_plan, campaigns

6. Deploy to Vercel:
   ```bash
   vercel
   ```

## Features

- Full GTM strategy creation (positioning, SWOT, market sizing)
- 3 buyer personas with operational reality
- 3 targetable segments with specific qualifiers  
- 3 hyper-personalized campaign ideas
- Beautiful dark theme UI with glassmorphism
- Tabbed interface for easy navigation
- Export functionality

## API Endpoints

- `POST /api/submit-to-clay` - Sends data to Clay webhook
- `POST /api/clay-webhook` - Receives results from Clay
- `GET /api/check-results?jobId=xxx` - Poll for job status
- `GET /api/get-results?jobId=xxx` - Get complete results

## Production Notes

- Replace in-memory job store with proper database (Vercel KV, Redis, etc.)
- Add authentication if needed
- Configure proper CORS headers
- Monitor Clay webhook reliability
