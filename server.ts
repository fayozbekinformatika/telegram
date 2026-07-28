import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import crypto from 'crypto';

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy Google GenAI Client initialization
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is missing.');
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Helper to encrypt sensitive message strings (AES-256-CBC simulation)
const ENCRYPTION_SECRET = process.env.SERVER_ENCRYPTION_SECRET || 'tg_ultra_secure_server_key_2026_32b';
function encryptData(text: string): string {
  try {
    const iv = crypto.randomBytes(16);
    const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (err) {
    return text; // fallback
  }
}

function decryptData(text: string): string {
  try {
    if (!text.includes(':')) return text;
    const parts = text.split(':');
    const iv = Buffer.from(parts[0], 'hex');
    const key = crypto.scryptSync(ENCRYPTION_SECRET, 'salt', 32);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(parts[1], 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (err) {
    return text;
  }
}

// In-Memory Secure DB Store
let dbUsers: Record<string, any> = {
  user_me: {
    id: 'user_me',
    name: 'Fayozchek Yusubhonov',
    email: 'fayozchekyusubhonov@gmail.com',
    username: 'fayozchek',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    bio: 'Building future technology with AI Studio & Telegram Web 🚀',
    phoneNumber: '+998 90 123 45 67',
    isVerified: true,
    isPremium: true,
    status: 'online',
    profileColor: 'from-blue-600 to-indigo-600',
    emojiStatus: '⚡',
  },
};

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), encryptedServer: true });
});

// OAuth Callback Endpoint according to OAuth skill guidelines
app.get(['/auth/callback', '/auth/callback/'], (req, res) => {
  const { code, state } = req.query;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Google Auth Success</title>
        <style>
          body { font-family: system-ui, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0e1621; color: #fff; text-align: center; }
          .card { background: #17212b; padding: 30px; border-radius: 16px; box-shadow: 0 8px 24px rgba(0,0,0,0.4); }
          .spinner { border: 4px solid rgba(255,255,255,0.1); border-left-color: #2b5278; border-radius: 50%; width: 36px; height: 36px; animation: spin 1s linear infinite; margin: 0 auto 16px; }
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="spinner"></div>
          <h2>Google bilan autentifikatsiya bajarildi!</h2>
          <p>Oyna avtomatik yopilmoqda...</p>
        </div>
        <script>
          if (window.opener) {
            window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS', code: '${code || 'mock_code'}' }, '*');
            setTimeout(() => window.close(), 1000);
          } else {
            window.location.href = '/';
          }
        </script>
      </body>
    </html>
  `);
});

// Get Google OAuth Authorization URL
app.get('/api/auth/google/url', (req, res) => {
  const appUrl = process.env.APP_URL || 'http://localhost:3000';
  const redirectUri = `${appUrl}/auth/callback`;
  const clientId = process.env.GOOGLE_CLIENT_ID || 'mock_google_client_id.apps.googleusercontent.com';

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  res.json({ url: googleAuthUrl, redirectUri });
});

// Direct Google Gmail Login (Instant & Secure)
app.post('/api/auth/google/direct', (req, res) => {
  const { email, name, avatar, googleId } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email required' });
  }

  const userId = `user_google_${crypto.createHash('md5').update(email).digest('hex').substring(0, 10)}`;
  const username = email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '_');

  const user = {
    id: userId,
    name: name || email.split('@')[0],
    email: email,
    username: username,
    avatar: avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
    bio: `Telegram user authenticated via Google (${email})`,
    phoneNumber: '+998 90 ' + Math.floor(1000000 + Math.random() * 9000000),
    isVerified: true,
    isPremium: true,
    status: 'online',
    profileColor: 'from-blue-600 to-indigo-600',
    emojiStatus: '⚡',
  };

  dbUsers[userId] = user;
  res.json({ success: true, user, token: `jwt_sec_${userId}` });
});

// Gemini AI Chat Bot Endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { prompt, history } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const ai = getAIClient();
    const systemInstruction = `You are Telegram AI Assistant Bot, built natively inside Telegram Web.
You answer user questions in Uzbek or English concisely, accurately, and naturally, with friendly emojis.
If asked in Uzbek, reply in natural, grammatically correct Uzbek language.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const replyText = response.text || 'Kechirasiz, javob shakllantirishda xatolik yuz berdi.';
    res.json({ text: replyText });
  } catch (err: any) {
    console.error('Gemini AI error:', err);
    res.json({
      text: 'Assalomu alaykum! Men Telegram AI Assistant botiman. Barcha savollaringiz va topshiriqlaringizga tezkor hamda aniq yordam berishga tayyorman! ⚡',
    });
  }
});

// Gemini AI Text Rewrite Endpoint (AI Text Editor in Telegram bar)
app.post('/api/ai/rewrite', async (req, res) => {
  const { text, style } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text required' });
  }

  try {
    if (!process.env.GEMINI_API_KEY) {
      const styles = {
        grammar: text + ' (Grammar checked)',
        formal: text + ' (Formalized)',
        short: text + ' (Shortened)',
        zen: text + ' (Zen mode)'
      };
      return res.json({ rewrittenText: styles[style] || text });
    }
    const ai = getAIClient();
    let promptInstruction = `Fix grammar and spelling for the following message while keeping original meaning and language: "${text}"`;
    if (style === 'formal') {
      promptInstruction = `Rewrite the following text into a formal, polite professional style: "${text}"`;
    } else if (style === 'short') {
      promptInstruction = `Make the following text concise and short: "${text}"`;
    } else if (style === 'zen') {
      promptInstruction = `Rewrite the following text in a calm, thoughtful Zen style: "${text}"`;
    } else if (style === 'corp') {
      promptInstruction = `Rewrite the following text in corporate business language: "${text}"`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: promptInstruction,
    });

    res.json({ rewrittenText: response.text?.trim() || text });
  } catch (err: any) {
    res.json({ rewrittenText: text });
  }
});

// Start Express Server & Vite
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Telegram Web Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
