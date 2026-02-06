# Bill AI - Antigravity Powered Chatbot

A modern AI chatbot interface powered by Google's Antigravity API with OAuth authentication.

## Features

✨ **OAuth Authentication** - Secure login flow with Google Antigravity
🎨 **Premium UI** - Beautiful, responsive interface with custom color palette
💬 **Real-time Streaming** - Live text generation with typing indicators
🤖 **Multiple AI Models** - Switch between different models on the fly
📸 **Image Support** - Upload and analyze images
💾 **Conversation History** - Persistent chat sessions with local storage
📱 **Fully Responsive** - Works seamlessly on all devices

## Color Palette

- Primary: `#005F02` (Dark Green)
- Secondary: `#427A43` (Forest Green)
- Accent: `#C0B87A` (Gold)
- Light: `#F2E3BB` (Cream)

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Vanilla CSS with custom design system
- **State Management**: React Hooks + LocalStorage
- **API**: Antigravity OAuth + Streaming responses

## Getting Started

### Development

```bash
npm install
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
bill-ai/
├── src/
│   ├── components/
│   │   ├── LoginPage.tsx       # OAuth login interface
│   │   ├── ChatInterface.tsx   # Main chat UI
│   │   └── HistoryDrawer.tsx   # Conversation history
│   ├── utils/
│   │   └── api.ts              # Antigravity API integration
│   ├── types.ts                # TypeScript interfaces
│   ├── App.tsx                 # Main app component
│   └── index.css               # Global styles
└── index.html
```

## How It Works

### 1. OAuth Flow

- User clicks "Login with Antigravity"
- Redirects to Google OAuth consent screen
- After approval, exchanges code for access/refresh tokens
- Tokens stored securely in localStorage

### 2. Model Selection

- Auto-fetches available models from Antigravity API
- User can switch models via dropdown in chat interface
- Selection persists across sessions

### 3. Real-time Chat

- Messages stream in real-time with visual indicators
- Full conversation history maintained per session
- Images can be uploaded and analyzed by AI

### 4. Persistence

- All conversations saved to localStorage
- User session persists across page reloads
- Model preferences remembered

## Customization

### To Connect Real Antigravity API

1. Replace mock functions in `src/utils/api.ts`
2. Add your OAuth client credentials
3. Implement backend token exchange endpoint
4. Update API endpoints to actual Antigravity URLs

### To Modify Colors

Edit CSS variables in `src/index.css`:

```css
:root {
  --primary: #005F02;
  --secondary: #427A43;
  --accent: #C0B87A;
  --light: #F2E3BB;
}
```

## Deployment

### Cloudflare Pages

```bash
npm run build
npx wrangler pages deploy ./dist --project-name=bill-ai
```

### Vercel

```bash
npm run build
vercel --prod
```

## License

MIT

---

Built with ❤️ using Antigravity AI
