import React, { useState, useEffect } from 'react';
import {
  Mic,
  Volume2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  X,
  Play,
  Square,
  Sparkles,
  HelpCircle,
  Laptop,
} from 'lucide-react';
import { testMicrophoneAccess, startAudioRecording, playAudioUri, RecorderHandle } from '../utils/audio';
import { generatePersianTTS } from '../services/api';

interface AudioTroubleshooterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AudioTroubleshooterModal: React.FC<AudioTroubleshooterModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [micStatus, setMicStatus] = useState<'checking' | 'granted' | 'denied' | 'prompt' | 'no-device' | 'error'>('checking');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isRecordingTest, setIsRecordingTest] = useState<boolean>(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [recorderHandle, setRecorderHandle] = useState<RecorderHandle | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [isTestingTTS, setIsTestingTTS] = useState<boolean>(false);
  const [ttsSuccess, setTtsSuccess] = useState<boolean | null>(null);

  const runDiagnostics = async () => {
    setMicStatus('checking');
    setErrorMessage('');
    const result = await testMicrophoneAccess();
    if (!result.supported) {
      setMicStatus('error');
      setErrorMessage(result.errorMessage || 'הדפדפן אינו תומך ב-MediaDevices.');
    } else if (result.hasDevice === false) {
      setMicStatus('no-device');
      setErrorMessage('לא זוהה מיקרופון מחובר למחשב זה.');
    } else if (result.permission === 'granted') {
      setMicStatus('granted');
    } else if (result.permission === 'denied') {
      setMicStatus('denied');
      setErrorMessage('הגישה למיקרופון חסומה בהגדרות הדפדפן.');
    } else {
      setMicStatus('prompt');
    }
  };

  useEffect(() => {
    if (isOpen) {
      runDiagnostics();
    }
  }, [isOpen]);

  // Monitor audio levels when recording test is active
  useEffect(() => {
    if (!isRecordingTest || !recorderHandle) return;
    const interval = setInterval(() => {
      setAudioLevel(recorderHandle.getAudioLevel());
    }, 50);
    return () => clearInterval(interval);
  }, [isRecordingTest, recorderHandle]);

  const handleStartMicTest = async () => {
    try {
      setRecordedAudioUrl(null);
      const handle = await startAudioRecording();
      setRecorderHandle(handle);
      setIsRecordingTest(true);
      setMicStatus('granted');
    } catch (err: any) {
      setMicStatus('denied');
      setErrorMessage(err.message || 'נכשלה הפעלת המיקרופון');
    }
  };

  const handleStopMicTest = async () => {
    if (!recorderHandle) return;
    try {
      const result = await recorderHandle.stop();
      setIsRecordingTest(false);
      setRecorderHandle(null);
      setRecordedAudioUrl(result.blobUrl);
    } catch (err: any) {
      setIsRecordingTest(false);
      setRecorderHandle(null);
      setErrorMessage(err.message || 'שגיאה בעצירת ההקלטה');
    }
  };

  const handleTestTTS = async () => {
    setIsTestingTTS(true);
    setTtsSuccess(null);
    try {
      const testPhrase = 'سلام! صدای من از سرور هوش مصنوعی به خوبی پخش می‌شه.';
      const audioUri = await generatePersianTTS(testPhrase, 'Kore');
      playAudioUri(audioUri, {
        onStart: () => setTtsSuccess(true),
        onError: () => setTtsSuccess(false),
      });
    } catch (err: any) {
      console.error(err);
      setTtsSuccess(false);
    } finally {
      setIsTestingTTS(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 text-slate-100 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">אבחון ופתרון בעיות מיקרופון והקראה</h2>
              <p className="text-xs text-slate-400">
                פתרון בעיות להפעלת המאמן במחשבי בית ספר, לפטופים ובכל סוגי הדפדפנים
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Why did it fail before? Insight banner */}
        <div className="bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/30 rounded-xl p-4 flex gap-3.5">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1.5 leading-relaxed text-slate-300">
            <span className="font-semibold text-amber-300 block text-sm">
              למה ההקראה והמיקרופון לא עבדו במחשבים אחרים?
            </span>
            <p>
              1. <strong>חוסר בקול פרסי מקומי:</strong> במערכות Windows ו-Mac כברירת מחדל לא מותקנת חבילת קול פרסית (fa-IR). דפדפן שמנסה להקריא נכשל או שותק. <span className="text-emerald-400 font-medium">המערכת הזו פותרת זאת ע״י שרת AI ייעודי (Gemini TTS) שמזרים שמע פרסי אותנטי לכל מחשב!</span>
            </p>
            <p>
              2. <strong>הרשאות מיקרופון:</strong> דפדפנים דורשים הרשאה מפורשת. אם המשתמש לחץ בעבר על Block או בגלל iframe, המיקרופון נחסם.
            </p>
          </div>
        </div>

        {/* Section 1: Microphone Test */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Mic className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white text-base">בדיקת חומרת מיקרופון</h3>
            </div>
            <button
              onClick={runDiagnostics}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              רענן סטטוס
            </button>
          </div>

          <div className="flex items-center gap-3">
            {micStatus === 'granted' && (
              <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                המיקרופון מורשה ותקין לשימוש!
              </div>
            )}
            {micStatus === 'denied' && (
              <div className="flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
                <XCircle className="w-4 h-4" />
                המיקרופון חסום בדפדפן
              </div>
            )}
            {micStatus === 'no-device' && (
              <div className="flex items-center gap-2 text-amber-400 text-sm font-medium bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                <AlertTriangle className="w-4 h-4" />
                לא נמצא מיקרופון מחובר
              </div>
            )}
            {micStatus === 'prompt' && (
              <div className="text-slate-300 text-sm">
                יש צורך ללחוץ על בדיקת הקלטה כדי לאשר הרשאה בדפדפן
              </div>
            )}
          </div>

          {errorMessage && (
            <p className="text-xs text-rose-400 bg-rose-950/40 p-2.5 rounded-lg border border-rose-800/40">
              {errorMessage}
            </p>
          )}

          {/* Live recording tester */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            {!isRecordingTest ? (
              <button
                onClick={handleStartMicTest}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
              >
                <Mic className="w-4 h-4" />
                התחל בדיקת דיבור במיקרופון
              </button>
            ) : (
              <button
                onClick={handleStopMicTest}
                className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-xl shadow-lg animate-pulse transition-all"
              >
                <Square className="w-4 h-4" />
                עצור הקלטה ובדוק שמע
              </button>
            )}

            {isRecordingTest && (
              <div className="flex items-center gap-2.5 flex-1 min-w-[180px]">
                <span className="text-xs text-emerald-400 font-medium">עוצמת שמע:</span>
                <div className="flex-1 h-3 bg-slate-700 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 rounded-full transition-all duration-75"
                    style={{ width: `${Math.max(5, audioLevel)}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-400">{audioLevel}%</span>
              </div>
            )}

            {recordedAudioUrl && !isRecordingTest && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => playAudioUri(recordedAudioUrl)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-xs text-white rounded-lg transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  השמע את ההקלטה שלך
                </button>
                <span className="text-xs text-emerald-400">✓ ההקלטה עבדה בהצלחה!</span>
              </div>
            )}
          </div>
        </div>

        {/* Section 2: Persian TTS Audio Test */}
        <div className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-4.5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Volume2 className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-white text-base">בדיקת הקראה קולית בפרסית (Gemini TTS)</h3>
            </div>
            <span className="text-xs bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full font-persian">
              فارسی عامیانه
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            לחץ על הכפתור כדי לוודא ששרת ה-AI מפיק קול פרסי איכותי ברמקולים או באוזניות של המחשב:
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={handleTestTTS}
              disabled={isTestingTTS}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-xl shadow-lg transition-all"
            >
              {isTestingTTS ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  מפיק קול פרסי משרת ה-AI...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  השמע משפט ניסיון בפרסית
                </>
              )}
            </button>

            {ttsSuccess === true && (
              <span className="text-xs text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                השמע הפרסי עובד מצוין!
              </span>
            )}
            {ttsSuccess === false && (
              <span className="text-xs text-rose-400 flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                שגיאה בהשמעת קול. ודא שהרמקולים אינם על השתק.
              </span>
            )}
          </div>
        </div>

        {/* Section 3: Browser Permission Quick Guide */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-4 text-xs space-y-2 text-slate-300">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <HelpCircle className="w-4 h-4 text-sky-400" />
            כיצד לאשר מיקרופון בדפדפן אם נחסם:
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
            <li>
              <strong>Google Chrome / Microsoft Edge:</strong> לחץ על סמל המנעול או המחוונים בצד ימין/שמאל של שורת הכתובת &gt; ודא שהאפשרות <strong>״מיקרופון״ (Microphone)</strong> מוגדרת כ-<strong>Allow (אפשר)</strong>, ולאחר מכן רענן את הדף (F5).
            </li>
            <li>
              <strong>מחשבי בית ספר או מעבדה:</strong> ודא שהאוזניות/מיקרופון מחוברים לשקע הנכון (ירוק/ורוד או USB) ומוגדרים כהתקן ברירת מחדל בהגדרות הקול של Windows.
            </li>
            <li>
              <strong>אם אין מיקרופון במחשב:</strong> אל דאגה! המאמן כולל גם מקלדת פרסית אינטראקטיבית, כפתורי תגובה מוכנים והקלדה רגילה כך שתוכל לתרגל באופן מלא ללא מיקרופון!
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl shadow-lg transition-all"
          >
            הבנתי, חזור למאמן השיחה
          </button>
        </div>
      </div>
    </div>
  );
};
