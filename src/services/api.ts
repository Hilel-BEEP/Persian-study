import { ChatMessage, PronunciationResult, SuggestedReply } from '../types';

export interface ChatResponse {
  replyFarsi: string;
  replyFingilish: string;
  replyHebrew: string;
  correction: {
    hasCorrection: boolean;
    userOriginal?: string;
    correctedFarsi?: string;
    correctedFingilish?: string;
    hebrewExplanation?: string;
  };
  suggestedReplies: SuggestedReply[];
  culturalNote?: string;
}

export interface TTSResponse {
  audioBase64: string;
  mimeType: string;
  sampleRate: number;
}

export interface TranscribeResponse {
  transcriptionFarsi: string;
  transcriptionFingilish: string;
  transcriptionHebrew: string;
  confidenceScore: number;
}

// Audio cache to speed up repeating common phrases
const audioCache = new Map<string, string>();

export async function checkServerHealth(): Promise<{ status: string; hasApiKey: boolean }> {
  try {
    const res = await fetch('/api/health');
    if (!res.ok) throw new Error('Health check failed');
    return await res.json();
  } catch (err) {
    return { status: 'offline', hasApiKey: false };
  }
}

export async function sendChatMessage(params: {
  messages: { sender: 'user' | 'assistant'; text: string }[];
  scenario: string;
  level: string;
  userNotes?: string;
}): Promise<ChatResponse> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.details || 'שגיאה בתקשורת עם השרת');
  }

  return await res.json();
}

export async function generatePersianTTS(
  text: string,
  voice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir' = 'Kore'
): Promise<string> {
  const cacheKey = `${voice}:${text.trim()}`;
  if (audioCache.has(cacheKey)) {
    return audioCache.get(cacheKey)!;
  }

  const res = await fetch('/api/tts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, voice }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'נכשלה יצירת הקול בשרת');
  }

  const data: TTSResponse = await res.json();
  const audioDataUri = `data:${data.mimeType || 'audio/wav'};base64,${data.audioBase64}`;
  audioCache.set(cacheKey, audioDataUri);
  return audioDataUri;
}

export async function transcribeAudio(
  audioBase64: string,
  mimeType = 'audio/webm'
): Promise<TranscribeResponse> {
  const res = await fetch('/api/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ audioBase64, mimeType }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'נכשל תמלול ההקלטה');
  }

  return await res.json();
}

export async function evaluatePronunciation(params: {
  targetFarsi: string;
  targetFingilish: string;
  audioBase64: string;
  mimeType?: string;
}): Promise<PronunciationResult> {
  const res = await fetch('/api/evaluate-speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'נכשלה בדיקת ההגייה');
  }

  return await res.json();
}
