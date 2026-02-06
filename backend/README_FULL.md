# 🤖 Bill AI - Full Stack AI Chatbot

A production-ready AI chatbot powered by Google's Gemini AI with OAuth authentication and real-time streaming.

![Bill AI](https://img.shields.io/badge/Google-Gemini%202.0-blue)
![Deploy](https://img.shields.io/badge/Deploy-Render%20%2B%20Cloudflare-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 🔐 **Google OAuth 2.0** - Secure authentication
- 🤖 **Multiple AI Models** - Gemini 2.0 Flash, 1.5 Pro, 1.5 Flash, 1.0 Pro
- 💬 **Real-time Streaming** - Live response generation
- 📸 **Image Analysis** - Upload and analyze images
- 💾 **Conversation History** - Persistent chat sessions
- 🎨 **Beautiful UI** - Custom color palette with dark theme
- 📱 **Fully Responsive** - Works on all devices

## 🚀 Live Demo

**Frontend:** https://bill-ai-42w.pages.dev

## 🏗️ Architecture

```
Frontend (React + TypeScript + Vite)
    ↓ HTTPS
Backend (Node.js + Express)
    ↓
Google OAuth 2.0 + Vertex AI (Gemini)
```

## 📦 Project Structure

```
bill-ai/
├── bill-ai/                    # Frontend (React)
│   ├── src/
│   │   ├── components/
│   │   ├── utils/api.ts
│   │   └── App.tsx
│   └── package.json
│
├── bill-ai-backend/           # Backend (Node.js)
│   ├── server.js
│   ├── package.json
│   └── render.yaml
│
└── Documentation/
    ├── RENDER_DEPLOY.md       # Deployment guide
    ├── OAUTH_SETUP_GUIDE.md   # OAuth setup
    └── ARCHITECTURE.md         # System architecture
```

## 🚀 Quick Deploy

### Prerequisites

- Google Cloud Project with:
  - Vertex AI API enabled
  - OAuth 2.0 credentials
  - Service Account with Vertex AI User role
- GitHub account
- Render.com account (free)
- Cloudflare account (frontend already deployed)

### Deploy Backend (5 minutes)

1. **Create GitHub repo** and push backend code
2. **Deploy to Render:**
   - Connect GitHub repo
   - Add environment variables
   - Deploy!
3. **Update OAuth redirect URIs** in Google Console
4. **Test:** https://YOUR-BACKEND.onrender.com/health

**Full guide:** [RENDER_DEPLOY.md](./RENDER_DEPLOY.md)

### Deploy Frontend (2 minutes)

Frontend is already deployed! Just update the backend URL:

```bash
cd bill-ai
echo "VITE_API_URL=https://YOUR-BACKEND.onrender.com" > .env.production
npm run build
npx wrangler pages deploy ./dist --project-name=bill-ai
```

## 🔐 Environment Variables

### Backend (.env)

```env
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
FRONTEND_URL=https://bill-ai-42w.pages.dev
REDIRECT_URI=https://your-backend.onrender.com/auth/callback
SESSION_SECRET=random-secret-key
PORT=10000
```

### Frontend (.env.production)

```env
VITE_API_URL=https://your-backend.onrender.com
```

## 🛠️ Local Development

### Backend

```bash
cd bill-ai-backend
npm install
cp .env.example .env
# Edit .env with your credentials
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
npm start
```

### Frontend

```bash
cd bill-ai
npm install
npm run dev
```

Open http://localhost:5173

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/auth/url` | Get OAuth URL |
| GET | `/auth/callback` | OAuth callback |
| POST | `/auth/token` | Exchange code for tokens |
| POST | `/auth/refresh` | Refresh access token |
| GET | `/models` | List available models |
| POST | `/chat` | Send message (SSE streaming) |

## 🎨 Tech Stack

**Frontend:**
- React 18
- TypeScript
- Vite 7
- Vanilla CSS

**Backend:**
- Node.js 18+
- Express.js
- Google OAuth Client
- Google Vertex AI SDK

**Hosting:**
- Frontend: Cloudflare Pages
- Backend: Render.com
- AI: Google Vertex AI

## 🔒 Security

- OAuth secrets stored in backend only
- CORS protection
- Token validation on every request
- Environment variable configuration
- No hardcoded credentials

## 💰 Cost

- **Render:** Free tier (750 hours/month)
- **Cloudflare Pages:** Free unlimited
- **Vertex AI:** Free tier available

**Expected monthly cost:** $0 (free tier)

## 📖 Documentation

- [Render Deployment Guide](./RENDER_DEPLOY.md)
- [OAuth Setup Guide](./OAUTH_SETUP_GUIDE.md)
- [Architecture Overview](./ARCHITECTURE.md)
- [Quick Start](./QUICK_START.md)

## 🐛 Troubleshooting

**"OAuth redirect mismatch"**
→ Add redirect URI in Google Console

**"Failed to fetch models"**
→ Check Vertex AI API is enabled

**"Service account error"**
→ Add `GOOGLE_APPLICATION_CREDENTIALS_JSON` env var

**"CORS error"**
→ Verify `FRONTEND_URL` matches Cloudflare Pages URL

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use for personal or commercial projects!

## 🙏 Acknowledgments

- Google Gemini AI
- Cloudflare Pages
- Render.com
- React Team
- Vite Team

## 📧 Support

For issues or questions:
- Open an issue on GitHub
- Check documentation files
- Review troubleshooting section

---

**Built with ❤️ using Google Gemini AI**

🌐 **Live:** https://bill-ai-42w.pages.dev
