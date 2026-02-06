const express = require('express');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const { VertexAI } = require('@google-cloud/vertexai');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Handle service account credentials from environment variable (for Render)
if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
  const credPath = path.join(__dirname, 'credentials.json');
  fs.writeFileSync(credPath, process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON);
  process.env.GOOGLE_APPLICATION_CREDENTIALS = credPath;
}

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Google OAuth Client
const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

// Vertex AI Configuration
const vertexAI = new VertexAI({
  project: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION || 'us-central1',
});

// ============================================================================
// ROUTES
// ============================================================================

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Get OAuth URL
app.get('/auth/url', (req, res) => {
  try {
    const scopes = [
      'openid',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/cloud-platform', // For Vertex AI access
    ];

    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent', // Force consent screen to get refresh token
    });

    res.json({ url: authUrl });
  } catch (error) {
    console.error('Error generating auth URL:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// OAuth callback - Exchange code for tokens
app.get('/auth/callback', async (req, res) => {
  try {
    const { code } = req.query;

    if (!code) {
      return res.status(400).send('No authorization code provided');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = new OAuth2Client();
    oauth2.setCredentials(tokens);
    
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    const userInfo = await userInfoResponse.json();

    // Redirect back to frontend with tokens in URL hash (for demo)
    // In production, use secure session cookies or JWT
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const params = new URLSearchParams({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || '',
      user_id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || '',
      picture: userInfo.picture || '',
    });

    res.redirect(`${frontendUrl}/auth/success?${params.toString()}`);
  } catch (error) {
    console.error('Error in OAuth callback:', error);
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(error.message)}`);
  }
});

// Exchange code for tokens (alternative POST endpoint)
app.post('/auth/token', async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({ error: 'No authorization code provided' });
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    
    // Get user info
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    
    const userInfo = await userInfoResponse.json();

    res.json({
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || '',
      picture: userInfo.picture || '',
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token || '',
      expiresAt: tokens.expiry_date,
    });
  } catch (error) {
    console.error('Error exchanging token:', error);
    res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
});

// Refresh access token
app.post('/auth/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ error: 'No refresh token provided' });
    }

    oauth2Client.setCredentials({ refresh_token: refreshToken });
    const { credentials } = await oauth2Client.refreshAccessToken();

    res.json({
      accessToken: credentials.access_token,
      expiresAt: credentials.expiry_date,
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ error: 'Failed to refresh access token' });
  }
});

// ============================================================================
// AI MODEL ROUTES
// ============================================================================

// Get available models
app.get('/models', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    // Available Vertex AI models
    const models = [
      {
        id: 'gemini-2.0-flash-exp',
        name: 'Gemini 2.0 Flash',
        provider: 'Google Vertex AI',
        maxTokens: 1000000,
        description: 'Latest Gemini 2.0 with extended context',
      },
      {
        id: 'gemini-1.5-pro',
        name: 'Gemini 1.5 Pro',
        provider: 'Google Vertex AI',
        maxTokens: 2000000,
        description: 'Most capable model with largest context window',
      },
      {
        id: 'gemini-1.5-flash',
        name: 'Gemini 1.5 Flash',
        provider: 'Google Vertex AI',
        maxTokens: 1000000,
        description: 'Fast and efficient for most tasks',
      },
      {
        id: 'gemini-1.0-pro',
        name: 'Gemini 1.0 Pro',
        provider: 'Google Vertex AI',
        maxTokens: 32000,
        description: 'Stable production model',
      },
    ];

    res.json(models);
  } catch (error) {
    console.error('Error fetching models:', error);
    res.status(500).json({ error: 'Failed to fetch models' });
  }
});

// ============================================================================
// CHAT ROUTES
// ============================================================================

// Send chat message with streaming
app.post('/chat', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    const { message, conversationHistory = [], model = 'gemini-1.5-flash', image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: 'No message or image provided' });
    }

    // Set up SSE (Server-Sent Events) for streaming
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Initialize the model
    const generativeModel = vertexAI.getGenerativeModel({
      model: model,
    });

    // Build conversation history
    const contents = conversationHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    // Add current message
    const currentParts = [];
    if (image) {
      // Handle image (base64)
      const imageData = image.replace(/^data:image\/\w+;base64,/, '');
      currentParts.push({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageData,
        },
      });
    }
    if (message) {
      currentParts.push({ text: message });
    }

    contents.push({
      role: 'user',
      parts: currentParts,
    });

    // Generate response with streaming
    const streamingResp = await generativeModel.generateContentStream({
      contents: contents,
    });

    // Stream the response
    for await (const chunk of streamingResp.stream) {
      const text = chunk.candidates[0]?.content?.parts[0]?.text || '';
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error in chat:', error);
    res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
    res.end();
  }
});

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 Bill AI Backend running on http://localhost:${PORT}`);
  console.log(`📝 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  console.log(`🔐 OAuth Redirect URI: ${process.env.REDIRECT_URI}`);
});
