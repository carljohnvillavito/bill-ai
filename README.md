# 🤖 Bill AI - Production-Ready AI Chatbot

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/carljohnvillavito/bill-ai)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-production--ready-green.svg)
![Tech](https://img.shields.io/badge/tech-React%20%7C%20Node.js%20%7C%20Gemini%20AI-purple.svg)

**Bill AI** is a full-stack, production-grade AI chatbot application powered by **Google's Vertex AI (Gemini models)**. It features secure OAuth 2.0 authentication, real-time streaming responses, multimodal capabilities (image analysis), and a polished, responsive UI.

---

## ✨ Key Features

- **🔐 Enterprise-Grade Auth:** Secure Google OAuth 2.0 integration (real Gmail login).
- **🧠 Advanced AI Models:** Access to Gemini 1.5 Pro, 1.5 Flash, and 1.0 Pro via Vertex AI.
- **⚡ Real-Time Streaming:** Server-Sent Events (SSE) for instant, typewriter-style responses.
- **👁️ Multimodal Vision:** Upload images for instant AI analysis and Q&A.
- **💾 Persistent History:** Auto-saving conversation history and session management.
- **🎨 Premium UI:** Modern, responsive interface with dark mode and smooth animations.
- **☁️ Cloud Native:** Docker-ready and pre-configured for Render and Cloudflare deployment.

---

## 🏗️ Architecture

The project is structured as a monorepo:

```mermaid
graph TD
    User[User Browser] <-->|HTTPS| Frontend
    Frontend[Frontend (React + Vite)] <-->|API Calls| Backend
    Backend[Backend (Node.js + Express)] <-->|OAuth| GoogleAuth[Google OAuth 2.0]
    Backend <-->|AI Request| VertexAI[Google Vertex AI]
```

*   **`frontend/`**: React 18, TypeScript, Vite, Custom CSS. Deployed on Cloudflare Pages.
*   **`backend/`**: Node.js, Express, Google Auth Library, Vertex AI SDK. Deployed on Render.

---

## 🚀 One-Click Deployment

You can deploy the backend functionality instantly using Render.

### 1. Prerequisites
Before deploying, ensure you have the following from Google Cloud Console:
1.  **OAuth Client ID & Secret**
2.  **Service Account JSON Key** (for Vertex AI access)

### 2. Deploy Backend
Click the button below to deploy the backend service directly to Render.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/carljohnvillavito/bill-ai)

**Required Environment Variables:**
During the setup, Render will ask for these values:

| Variable | Description |
| :--- | :--- |
| `GOOGLE_CLIENT_ID` | OAuth Client ID from Google Cloud Console. |
| `GOOGLE_CLIENT_SECRET` | OAuth Client Secret from Google Cloud Console. |
| `GOOGLE_CLOUD_PROJECT_ID`| Your Google Cloud Project ID. |
| `GOOGLE_CLOUD_LOCATION` | Region for Vertex AI (e.g., `us-central1`). |
| `FRONTEND_URL` | URL of your deployed frontend (e.g., `https://bill-ai.pages.dev`). |
| `SESSION_SECRET` | A random string for securing sessions. |
| `GOOGLE_APPLICATION_CREDENTIALS_JSON` | **Copy and paste the entire content** of your Service Account JSON file here. |

### 3. Deploy Frontend
The frontend is optimized for **Cloudflare Pages**.
1.  Connect your GitHub repo to Cloudflare Pages.
2.  Set **Root Directory** to `frontend`.
3.  Set **Build Command** to `npm run build`.
4.  Set **Output Directory** to `dist`.
5.  Add Environment Variable: `VITE_API_URL` = `Your_Render_Backend_URL`.

---

## 🛠️ Local Development

### Backend
```bash
cd backend
npm install
cp .env.example .env # Add your credentials
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by **Carl John Villavito**
