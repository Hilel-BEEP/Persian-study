/**
 * Audio and Microphone utilities for FarsiBot
 * Designed to guarantee reliable voice recording and playback across all browsers and devices.
 */

export interface RecorderHandle {
  stop: () => Promise<{ audioBase64: string; mimeType: string; blobUrl: string }>;
  cancel: () => void;
  getAudioLevel: () => number;
}

// Convert Blob to base64 string
export async function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data:*/*;base64, prefix
      const base64 = base64String.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Check microphone availability and permission status
export async function testMicrophoneAccess(): Promise<{
  supported: boolean;
  permission: 'granted' | 'denied' | 'prompt' | 'unknown';
  errorMessage?: string;
  hasDevice?: boolean;
}> {
  if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
    return {
      supported: false,
      permission: 'unknown',
      errorMessage: 'הדפדפן אינו תומך בהקלטת קול (MediaDevices API חסר).',
    };
  }

  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasAudioInput = devices.some((d) => d.kind === 'audioinput');

    if (!hasAudioInput) {
      return {
        supported: true,
        permission: 'unknown',
        hasDevice: false,
        errorMessage: 'לא זוהה מיקרופון מחובר למחשב זה.',
      };
    }

    if (navigator.permissions && navigator.permissions.query) {
      try {
        const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
        return {
          supported: true,
          permission: result.state as 'granted' | 'denied' | 'prompt',
          hasDevice: true,
        };
      } catch {
        // query not supported for microphone on some browsers
      }
    }

    return { supported: true, permission: 'prompt', hasDevice: true };
  } catch (err: any) {
    return {
      supported: true,
      permission: 'unknown',
      errorMessage: err?.message || 'שגיאה בבדיקת חיבורי המיקרופון',
    };
  }
}

// Start recording audio with live audio level metering
export async function startAudioRecording(): Promise<RecorderHandle> {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error('דפדפן זה אינו תומך בהקלטת קול ישירה.');
  }

  let stream: MediaStream;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });
  } catch (err: any) {
    if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
      throw new Error('גישת המיקרופון נחסמה בהגדרות הדפדפן. יש ללחוץ על סמל המנעול ליד כתובת האתר ולאשר מיקרופון.');
    }
    if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
      throw new Error('לא נמצא מיקרופון מחובר למחשב זה. חבר מיקרופון או אוזניות ונסה שוב.');
    }
    if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
      throw new Error('המיקרופון תפוס כרגע ע״י תוכנה אחרת (זום, טימס, ווטסאפ וכו׳). סגור אותן ונסה שוב.');
    }
    throw new Error(`שגיאה בהפעלת המיקרופון: ${err.message || err.name}`);
  }

  // Audio level analysis
  let audioContext: AudioContext | null = null;
  let analyser: AnalyserNode | null = null;
  let dataArray: Uint8Array | null = null;

  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioCtx) {
      audioContext = new AudioCtx();
      const source = audioContext.createMediaStreamSource(stream);
      analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      dataArray = new Uint8Array(analyser.frequencyBinCount);
    }
  } catch (e) {
    console.warn('AudioContext analysis not available', e);
  }

  // Determine supported mime type
  const mimeTypes = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/mp4',
    'audio/wav',
  ];
  let selectedMimeType = '';
  for (const m of mimeTypes) {
    if (MediaRecorder.isTypeSupported(m)) {
      selectedMimeType = m;
      break;
    }
  }

  const mediaRecorder = new MediaRecorder(stream, selectedMimeType ? { mimeType: selectedMimeType } : undefined);
  const recordedChunks: Blob[] = [];

  mediaRecorder.ondataavailable = (event) => {
    if (event.data && event.data.size > 0) {
      recordedChunks.push(event.data);
    }
  };

  mediaRecorder.start(100);

  const getAudioLevel = (): number => {
    if (!analyser || !dataArray) return 0;
    analyser.getByteFrequencyData(dataArray as any);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    return Math.min(100, Math.round((avg / 255) * 100 * 2));
  };

  return {
    getAudioLevel,
    stop: () => {
      return new Promise((resolve, reject) => {
        mediaRecorder.onstop = async () => {
          try {
            // Clean up stream tracks
            stream.getTracks().forEach((track) => track.stop());
            if (audioContext && audioContext.state !== 'closed') {
              audioContext.close().catch(() => {});
            }

            const blob = new Blob(recordedChunks, { type: selectedMimeType || 'audio/webm' });
            const blobUrl = URL.createObjectURL(blob);
            const audioBase64 = await blobToBase64(blob);

            resolve({
              audioBase64,
              mimeType: selectedMimeType || 'audio/webm',
              blobUrl,
            });
          } catch (e) {
            reject(e);
          }
        };

        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      });
    },
    cancel: () => {
      stream.getTracks().forEach((track) => track.stop());
      if (audioContext && audioContext.state !== 'closed') {
        audioContext.close().catch(() => {});
      }
      if (mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    },
  };
}

// Global audio player with speed and state callbacks
let currentAudioElement: HTMLAudioElement | null = null;

export function playAudioUri(
  audioUri: string,
  options?: {
    playbackRate?: number;
    onStart?: () => void;
    onEnd?: () => void;
    onError?: (err: any) => void;
  }
): () => void {
  // Stop existing playback
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
  }

  const audio = new Audio(audioUri);
  currentAudioElement = audio;
  audio.playbackRate = options?.playbackRate || 1.0;

  audio.onplay = () => {
    options?.onStart?.();
  };

  audio.onended = () => {
    options?.onEnd?.();
  };

  audio.onerror = (e) => {
    console.error('Audio playback error', e);
    options?.onError?.(e);
  };

  audio.play().catch((err) => {
    console.warn('Auto-play prevented or audio failed to play:', err);
    options?.onError?.(err);
  });

  return () => {
    audio.pause();
    audio.currentTime = 0;
  };
}

export function stopCurrentAudio(): void {
  if (currentAudioElement) {
    currentAudioElement.pause();
    currentAudioElement.currentTime = 0;
    currentAudioElement = null;
  }
}
