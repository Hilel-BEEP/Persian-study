import React from 'react';
import {
  FileCode2,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle,
  HelpCircle,
  Volume2,
  Mic,
  Server,
  Code2,
  GraduationCap,
  Award,
} from 'lucide-react';

export const ProjectDocTab: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 text-slate-200">
      {/* Title & Badge */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-amber-500/20 border border-emerald-500/30 rounded-full text-emerald-300 text-xs font-bold">
          <GraduationCap className="w-4 h-4 text-emerald-400" />
          עבודת גמר במדעי המחשב י״ב • כיתת נחשון
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          ספר הפרויקט: פארסיבּוֹט (FarsiBot)
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          מערכת מבוססת בינה מלאכותית רב-מודאלית (LLM + Multimodal Audio) לתרגול ושיפור שיחה בפרסית מדוברת (טהראנית) עם משוב דקדוקי והקראה קולית בזמן אמת.
        </p>
      </div>

      {/* Quick Summary Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
            <Cpu className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">מודלי AI בשימוש</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gemini 3.8 Flash (שיחה ומשוב), Gemini 3.8 Flash-Lite TTS (הקראה קולית 24kHz), Gemini 3.5 Transcribe (תמלול קול).
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit">
            <Server className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">ארכיטקטורת Full-Stack</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            צד לקוח React 19 + TypeScript + Web Audio API; צד שרת Express ב-Node.js מאובטח ללא חשיפת מפתחות לדפדפן.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl w-fit">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">פתרון כשל שמע ומיקרופון</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            עקיפת היעדר מנוע קול פרסי מקומי במערכות הפעלה ע״י סינתזת קול בענן ומנגנון דחיסת MediaRecorder אוניברסלי.
          </p>
        </div>
      </div>

      {/* Chapter 1: Vision & Motivation */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">פרק 1: רקע, מטרות וייחוד הפרויקט</h2>
            <span className="text-xs text-slate-400">הבעיה שפתרנו והחשיבות הלימודית</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-3">
          <p>
            <strong>הבעיה הלשונית:</strong> השפה הפרסית מאופיינת בדיגלוסיה קיצונית (פער עמוק בין השפה הכתובה לשפה המדוברת). רוב אפליקציות הלימוד המסורתיות מלמדות פרסית ספרותית רשמית (فارسی کتابی) ארכאית. דובר שישתמש בה ברחובות טהראן יישמע מלאכותי וארכאי. הפרסית המדוברת העממית (فارسی عامیانه و محاوره‌ای تهرانی) כוללת חוקי צמצום קבועים (כגון מעבר תנועות [an] ל-[oon], קיצורי פעלים קיצוניים, והסרת כינויים), וכן מערכת כללי נימוס ותרבות מורכבת ביותר המכונה <strong>טַעֲרוֹף (تعارف)</strong>.
          </p>
          <p>
            <strong>מטרת הפרויקט:</strong> לפתח מאמן אישי אינטראקטיבי מבוסס AI המאפשר שיחה חיה קולית בפרסית מדוברת טהראנית, מתקן את התלמיד ברגע ששגה או השתמש במבנה רשמי מדי, מקריא לו בקול טבעי ואותנטי, ומספק תרגולים אינטראקטיביים.
          </p>
        </div>
      </div>

      {/* Chapter 2: Technical Breakdown of the Mic & Audio Fix */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
            <Volume2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              פרק 2: פתרון הבעיה הטכנולוגית – מדוע ההקראה והמיקרופון נכשלו בעבר?
            </h2>
            <span className="text-xs text-slate-400">ניתוח מעמיק עבור בוחני הבגרות</span>
          </div>
        </div>

        <div className="text-xs sm:text-sm text-slate-300 leading-relaxed space-y-4">
          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 block">1. כשל ההקראה הקולית (SpeechSynthesis):</span>
            <p>
              מרבית הדפדפנים והמערכות (Windows 10/11, macOS, Linux, ChromeOS) אינם כוללים חבילת קול מותקנת בפרסית (קוד שפה <code>fa-IR</code>). כאשר מפתח מזמן את ה-Web Speech API המקומי בדפדפן, המערכת אינה מוצאת קול פרסי ושותקת לחלוטין או מנסה להקריא באנגלית אותיות בודדות.
            </p>
            <p className="text-emerald-300 font-semibold">
              הפתרון ההנדסי שיושם במערכת שלנו: יצרנו שרת Backend מבוסס מודל <code>gemini-3.8-flash-lite-tts</code>. הטקסט הפרסי נשלח לשרת ומוחזר כקובץ שמע סטנדרטי (WAV באיכות 24,000Hz mono). מכיוון שכל דפדפן בעולם יודע לנגן קובץ אודיו בסיסי, ההקראה עובדת בצורה חלקה ב-100% מהמחשבים ללא תלות בהגדרות מערכת ההפעלה!
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="font-bold text-amber-300 block">2. כשל זיהוי הדיבור והמיקרופון:</span>
            <p>
              ה-API המובנה של הדפדפן (<code>webkitSpeechRecognition</code>) מוגבל לדפדפן כרום בלבד, תלוי ברשת גוגל ולעיתים קרובות חסום בתוך סביבות עבודה (Iframes / Sandbox) או שאינו מזהה מבטאים נכונה.
            </p>
            <p className="text-emerald-300 font-semibold">
              הפתרון ההנדסי שיושם: שילוב מנגנון <code>MediaRecorder</code> עם Web Audio API לדגימת הקול, בדיקת עוצמת שמע ויזואלית (VU Meter), שליחת ה-Audio Stream אל מודל התמלול <code>gemini-3.5-transcribe</code> בשרת, בתוספת כלי אבחון ייעודי ובקרת הרשאות.
            </p>
          </div>
        </div>
      </div>

      {/* Chapter 3: System Architecture & Data Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">פרק 3: ארכיטקטורת המערכת ותרשים זרימה</h2>
            <span className="text-xs text-slate-400">חלוקת שכבות ותקשורת בין שרת ללקוח</span>
          </div>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 font-mono text-xs text-slate-300 space-y-4 overflow-x-auto">
          <div className="font-bold text-emerald-400 text-sm">תרשים זרימת מידע (Data Flow):</div>
          <div className="leading-relaxed border-l-2 border-emerald-500 pl-4 space-y-2">
            <div>[משתמש מדבר במיקרופון] ➔ Web Audio API / MediaRecorder (דגימת קול בדפדפן)</div>
            <div>➔ קידוד Base64 ➔ בקשת HTTP POST אל /api/transcribe</div>
            <div>➔ מודל Gemini 3.5 Transcribe ➔ תמלול טקסט בפרסית מדוברת</div>
            <div>➔ שליחת היסטוריית השיחה אל /api/chat (מודל Gemini 3.8 Flash)</div>
            <div>➔ ניתוח שגיאות דקדוקיות + הפקת תשובה טהראנית + תעתיק Fingilish + תרגום לעברית</div>
            <div>➔ בקשת POST אל /api/tts (מודל Gemini 3.8 Flash-Lite TTS) ➔ החזרת WAV 24kHz</div>
            <div>➔ ניגון אוטומטי בדפדפן + הצגת כרטיס תיקון והצעות לתשובה מהירה!</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs space-y-2">
            <span className="font-bold text-white text-sm block">Frontend (צד לקוח):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pr-1">
              <li>React 19 עם TypeScript לסביבה טיפוסית יציבה ונקייה משגיאות זמן ריצה.</li>
              <li>Tailwind CSS v4 לעיצוב רספונסיבי מודרני מותאם RTL לעברית ולפרסית.</li>
              <li>גופן Vazirmatn המותאם במיוחד לקריאה נעימה של כתב פרסי אותנטי.</li>
              <li>מודול Web Audio API עם AnalyserNode לניטור עוצמת המיקרופון בזמן אמת.</li>
            </ul>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/60 text-xs space-y-2">
            <span className="font-bold text-white text-sm block">Backend (צד שרת):</span>
            <ul className="list-disc list-inside space-y-1 text-slate-400 pr-1">
              <li>Express.js ב-Node.js מארח שרת API מלא ומאובטח.</li>
              <li>ספריית <code>@google/genai</code> הרשמית של גוגל בתקשורת שרת-אל-שרת.</li>
              <li>מפתח ה-API מוגן ב-Environment Variables ואינו חשוף לעולם לדפדפן הלקוח.</li>
              <li>מנגנון מטמון (Audio Cache) למניעת קריאות כפולות לסינתזת קטעי קול שחוזרים על עצמם.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Chapter 4: Testing & Bagrut Presentation Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-400">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">פרק 4: תרחישי בדיקה (Test Cases) ונקודות להצגה בפני הבוחן</h2>
            <span className="text-xs text-slate-400">כיצד להציג את הפרויקט בצורה מרשימה ולקבל 100</span>
          </div>
        </div>

        <div className="space-y-3 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-emerald-400 block">הדגמה 1: בדיקת תיקון שגיאות ספרותיות מול מדוברות</span>
            <p className="text-slate-400 text-xs">
              אמור למאמן את המשפט הספרותי: <em>"من می‌خواهم بروم به خانه و نان بخرم"</em>.
              הראה לבוחן כיצד ה-AI מזהה שזו פרסית ספרותית יבשה ומתקן בעברית בהירה: <em>"בפרסית מדוברת טהראנית אומרים: می‌خوام برم خونه نون بخرم (בגלל חוק ה-an שמשתנה ל-oon וצמצום הפועל)"</em>!
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-indigo-400 block">הדגמה 2: השמעת קול איכותית ופתרון הכשל בכל מחשב</span>
            <p className="text-slate-400 text-xs">
              הצג בפני הבוחן את כפתור <strong>״בדיקת מיקרופון ושמע״</strong> והסבר כיצד מערכות רגילות נכשלות ללא קולות מערכת, בעוד שהפתרון שפיתחת מייצר קבצי אודיו אמיתיים בעזרת שרת סינתזה ייעודי.
            </p>
          </div>

          <div className="p-3.5 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1">
            <span className="font-bold text-amber-400 block">הדגמה 3: מעבדת ההגייה הפונטית (Shadowing)</span>
            <p className="text-slate-400 text-xs">
              עבור ללשונית ״מעבדת הגייה״, השמע משפט, הקלט את קולך והראה את ציון הדיוק (0-100) ואת הטיפים הפונטיים לאותיות גרוניות כמו خ (ח') ו-ق/غ (ע'/ר').
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
