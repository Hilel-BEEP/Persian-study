import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Shared server-side Gemini client
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured on the server');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

// Chat & Persian Spoken Coach Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, scenario, level, userNotes } = req.body;
    const ai = getAiClient();

    const systemInstruction = `
אתה מאמן שיחה אישי ומומחה עולמי לשפה הפרסית המדוברת (טהראנית עממית - فارسی عامیانه و محاوره‌ای تهرانی).
פרויקט זה נבנה עבור עבודת גמר במחשבים כיתה י״ב כיתת נחשון של תלמיד ישראלי.

תפקידך:
1. לנהל שיחה חמה, זורמת ואותנטית בפרסית מדוברת יומיומית (טהראנית), כולל סלנג מקובל וביטויי טַעֲרוֹף (تعارف) כשמתאים.
2. תמיד להשתמש בצורות מדוברות (למשל: می‌خوام במקום می‌خواهم, می‌رم במקום می‌روم, خونه במקום خانه, نون במקום نان, اونا במקום آن‌ها, چطوری במקום حالت چطور است).
3. אם המשתמש שגה בדקדוק, השתמש במילים רשמיות מדי מספרים ישנים, או עשה שגיאה במבנה המשפט - נתח את השגיאה בעדינות והסבר בעברית בהירה את הכלל של הפרסית המדוברת!
4. להציג תמיד:
   - המשפט בפרסית (כתב פרסי עם ניקוד חלקי היכן שחשוב).
   - תעתיק פונטי באותיות לטיניות (Fingilish / Pingilish) כדי שהתלמיד יידע בדיוק איך לבטא.
   - תרגום לעברית ברורה.
   - הצעות ל-3 תשובות אפשריות שהמשתמש יכול לענות עכשיו.

הקשר ותרחיש: ${scenario || 'שיחה חופשית'}
רמת התלמיד: ${level || 'מתחיל-בינוני'}
הערות נוספות: ${userNotes || 'אין'}

חובה להחזיר JSON תקין בדיוק במבנה הבא:
{
  "replyFarsi": "טקסט התגובה בפרסית מדוברת טהראנית",
  "replyFingilish": "תעתיק פינגיליש מדוייק (למשל: Salam! Khoobi? Che khabar?)",
  "replyHebrew": "תרגום מלא וטבעי לעברית",
  "correction": {
    "hasCorrection": true/false (האם המשתמש טעה או דיבר בשפה רשמית מדי שדורשת התאמה מדוברת),
    "userOriginal": "המשפט שהמשתמש אמר (אם היה תיקון)",
    "correctedFarsi": "המשפט המתוקן בפרסית מדוברת",
    "correctedFingilish": "תעתיק המשפט המתוקן",
    "hebrewExplanation": "הסבר מפורט בעברית על השגיאה או על המעבר מפרסית ספרותית לפרסית מדוברת טהראנית"
  },
  "suggestedReplies": [
    {
      "farsi": "אפשרות תשובה 1 בפרסית",
      "fingilish": "תעתיק 1",
      "hebrew": "תרגום 1 לעברית"
    },
    {
      "farsi": "אפשרות תשובה 2 בפרסית",
      "fingilish": "תעתיק 2",
      "hebrew": "תרגום 2 לעברית"
    },
    {
      "farsi": "אפשרות תשובה 3 בפרסית",
      "fingilish": "תעתיק 3",
      "hebrew": "תרגום 3 לעברית"
    }
  ],
  "culturalNote": "טיפ תרבותי קצר או הסבר על ביטוי סלנג/טערוף שהופיע בשיחה (בעברית)"
}
`;

    // Format conversation history for Gemini
    const contents: any[] = [];
    if (Array.isArray(messages) && messages.length > 0) {
      for (const m of messages) {
        contents.push({
          role: m.sender === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        });
      }
    } else {
      contents.push({
        role: 'user',
        parts: [{ text: 'שלום! התחל איתי שיחה בפרסית מדוברת על הנושא שנבחר.' }],
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.7,
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        replyFarsi: 'سلام! خوش آمدید. چطوری؟ خوبی؟',
        replyFingilish: 'Salam! Khosh amadid. Chetori? Khoobi?',
        replyHebrew: 'שלום! ברוך הבא. מה שלומך? הכל טוב?',
        correction: { hasCorrection: false },
        suggestedReplies: [
          { farsi: 'ممنون، منم خوبم.', fingilish: 'Mamnoon, manam khoobam.', hebrew: 'תודה, גם אני טוב.' },
          { farsi: 'قربونت، بد نیستم.', fingilish: 'Ghorboonet, bad nistam.', hebrew: 'תודה רבה (קורבנת), לא רע.' }
        ],
        culturalNote: 'בפרסית מדוברת נהוג להשתמש בביטויי חיבה כמו "قربونت" (קורבנת - כפרה עליך/אקריב עצמי למענך).'
      };
    }

    res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    res.status(500).json({
      error: 'שגיאה בעיבוד השיחה בפרסית',
      details: err?.message || String(err),
    });
  }
});

// Text-to-Speech Endpoint for Persian (gemini-3.8-flash-lite-tts)
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore', rate = 1.0 } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text parameter is required' });
    }

    const ai = getAiClient();

    // Call gemini-3.8-flash-lite-tts for authentic Persian pronunciation
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Pronounce the following spoken colloquial Persian text naturally, with authentic Tehrani accent and warm, friendly tone:\n"${text}"`,
              speechMetadata: {
                style: 'Natural, friendly conversational native Persian speaker',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: voice || 'Kore' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error('No audio returned from Gemini TTS');
    }

    res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
      sampleRate: 24000,
    });
  } catch (err: any) {
    console.error('Error in /api/tts:', err);
    res.status(500).json({
      error: 'שגיאה ביצירת הקראה קולית',
      details: err?.message || String(err),
    });
  }
});

// Audio Transcription Endpoint (Microphone audio recording -> Persian text)
app.post('/api/transcribe', async (req: Request, res: Response) => {
  try {
    const { audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'audioBase64 parameter is required' });
    }

    const ai = getAiClient();

    // We can use gemini-3.5-transcribe or gemini-3.8-flash for multimodal transcription
    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const promptText = `
תמלל את הדיבור בפרסית מתוך קובץ השמע המצורף.
החזר אך ורק תשובת JSON בפורמט הבא:
{
  "transcriptionFarsi": "הטקסט המדויק שנאמר בפרסית",
  "transcriptionFingilish": "תעתיק באותיות לטיניות (פינגיליש)",
  "transcriptionHebrew": "תרגום לעברית של מה שנאמר",
  "detectedLanguage": "fa",
  "confidenceScore": 0.95
}
אם הדובר דיבר עברית או אנגלית בטעות, תמלל מה שאמר ותרגם לפרסית מדוברת.
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [audioPart, { text: promptText }],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '{}';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      parsedData = {
        transcriptionFarsi: responseText.trim(),
        transcriptionFingilish: '',
        transcriptionHebrew: '',
        confidenceScore: 0.8,
      };
    }

    res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/transcribe:', err);
    // Fallback attempt with gemini-3.8-flash
    try {
      const ai = getAiClient();
      const { audioBase64, mimeType = 'audio/webm' } = req.body;
      const audioPart = {
        inlineData: {
          mimeType: mimeType || 'audio/webm',
          data: audioBase64,
        },
      };
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: {
          parts: [
            audioPart,
            {
              text: 'Transcribe the spoken Persian speech from this audio. Return JSON: {"transcriptionFarsi":"...","transcriptionFingilish":"...","transcriptionHebrew":"..."}',
            },
          ],
        },
        config: {
          responseMimeType: 'application/json',
        },
      });
      const parsedData = JSON.parse(response.text || '{}');
      return res.json(parsedData);
    } catch (fallbackErr: any) {
      res.status(500).json({
        error: 'שגיאה בתמלול ההקלטה',
        details: fallbackErr?.message || String(fallbackErr),
      });
    }
  }
});

// Pronunciation & Shadowing Evaluation Endpoint
app.post('/api/evaluate-speech', async (req: Request, res: Response) => {
  try {
    const { targetFarsi, targetFingilish, audioBase64, mimeType = 'audio/webm' } = req.body;
    if (!audioBase64 || !targetFarsi) {
      return res.status(400).json({ error: 'Missing targetFarsi or audioBase64' });
    }

    const ai = getAiClient();
    const audioPart = {
      inlineData: {
        mimeType: mimeType || 'audio/webm',
        data: audioBase64,
      },
    };

    const promptText = `
אתה בוחן הגייה מקצועי בפרסית מדוברת טהראנית (טהרן).
המשתמש ניסה לבטא ולהקריא את המשפט הבא בפרסית:
משפט יעד בפרסית: "${targetFarsi}"
תעתיק פינגיליש: "${targetFingilish || ''}"

הקשב להקלטה הקולית המצורפת והערך את ההגייה של התלמיד.
החזר אך ורק JSON במבנה הבא:
{
  "score": מספר בין 0 ל-100 (ציון דיוק),
  "recognizedFarsi": "מה שהמשתמש ביטא בפועל בפרסית",
  "recognizedFingilish": "תעתיק של מה שהמשתמש ביטא",
  "isGoodPronunciation": true/false (אם הציון מעל 70),
  "feedbackHebrew": "משוב מפורט ומעודד בעברית עם דגשים פונטיים (למשל דיוק באותיות ח'/ח'ה خ, ע'/ר' ق/غ, תנועות פתוחות או טהראניות)",
  "phoneticTips": ["טיפ 1 לשיפור", "טיפ 2"]
}
`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [audioPart, { text: promptText }],
      },
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsedData = JSON.parse(response.text || '{}');
    res.json(parsedData);
  } catch (err: any) {
    console.error('Error in /api/evaluate-speech:', err);
    res.status(500).json({
      error: 'שגיאה בהערכת ההגייה',
      details: err?.message || String(err),
    });
  }
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
