# Bill AI Backend - Render Deployment

Backend server for Bill AI chatbot with Google OAuth and Vertex AI integration.

## 🚀 Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## Quick Deploy Steps

1. Click "Deploy to Render" button above
2. Connect your GitHub account
3. Render will auto-detect `render.yaml`
4. Click "Create Web Service"
5. Wait 2-3 minutes for deployment
6. Copy your service URL (e.g., `https://bill-ai-backend.onrender.com`)
7. Update environment variables:
   - `REDIRECT_URI` = `https://YOUR-BACKEND-URL.onrender.com/auth/callback`
8. Update Google OAuth redirect URIs with your Render URL
9. Deploy!

## Environment Variables (Pre-configured)

All environment variables are already set in `render.yaml`:
- ✅ `GOOGLE_CLIENT_ID`
- ✅ `GOOGLE_CLIENT_SECRET`
- ✅ `GOOGLE_CLOUD_PROJECT_ID`
- ✅ `FRONTEND_URL`
- ✅ `SESSION_SECRET` (auto-generated)
- ⚠️ `REDIRECT_URI` - You need to set this after deployment

## Service Account Setup

**Important:** Render needs the service account key as an environment variable.

After deployment:
1. Go to your Render dashboard
2. Click on `bill-ai-backend` service
3. Go to "Environment" tab
4. Add new variable:
   - Key: `GOOGLE_APPLICATION_CREDENTIALS_JSON`
   - Value: Paste the entire content of your service account JSON

## Update Frontend

After backend is deployed, update frontend `.env.production`:

```env
VITE_API_URL=https://YOUR-BACKEND-URL.onrender.com
```

Then rebuild and redeploy frontend to Cloudflare Pages.

## Tech Stack

- Node.js 18+
- Express.js
- Google OAuth 2.0
- Vertex AI (Gemini)

## License

MIT
