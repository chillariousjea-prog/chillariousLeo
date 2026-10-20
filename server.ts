import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

// In-memory audio cache for story text to keep narration fast & low latency
const ttsCache = new Map<string, string>();

// Initialize Gemini client (server-side only)
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// TTS API endpoint using Gemini 3.8 Flash Lite TTS
app.post('/api/tts', async (req: Request, res: Response): Promise<void> => {
  try {
    const { text, voice = 'Kore', style = 'gentle' } = req.body;

    if (!text || typeof text !== 'string') {
      res.status(400).json({ error: 'Text parameter is required' });
      return;
    }

    const cleanText = text.replace(/[*_#"`]/g, '').trim();
    const cacheKey = `${voice}_${style}_${cleanText}`;

    if (ttsCache.has(cacheKey)) {
      res.json({
        audioBase64: ttsCache.get(cacheKey),
        cached: true,
      });
      return;
    }

    if (!ai) {
      res.status(503).json({
        error: 'Gemini API is not configured on the server. Falling back to browser voice.',
        fallback: true,
      });
      return;
    }

    const voicePromptStyle = style === 'cheerful'
      ? 'Cheerful, lively, playful British primary school teacher reading an adventure picture book to children.'
      : 'Warm, soothing, gentle, friendly bedtime children\'s storybook narrator with clear cheerful pronunciation, comforting for young pupils aged 5 to 11.';

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: cleanText,
              speechMetadata: {
                style: voicePromptStyle,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // 'Kore', 'Puck', 'Zephyr', 'Charon', 'Fenrir'
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio returned by speech model');
    }

    // Cache the base64 audio
    ttsCache.set(cacheKey, base64Audio);

    res.json({
      audioBase64: base64Audio,
      cached: false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'TTS generation error';
    console.error('TTS endpoint error:', err);
    res.status(500).json({
      error: message,
      fallback: true,
    });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', hasGeminiKey: !!apiKey });
});

async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Vite middleware for development
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve production build
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Storybook server listening on http://0.0.0.0:${port}`);
  });
}

startServer();
