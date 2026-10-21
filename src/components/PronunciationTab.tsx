import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
  Loader2,
  HelpCircle,
} from 'lucide-react';
import { PRONUNCIATION_EXERCISES } from '../data/curriculum';
import { PronunciationExercise, PronunciationResult } from '../types';
import { generatePersianTTS, evaluatePronunciation } from '../services/api';
import { startAudioRecording, playAudioUri, stopCurrentAudio, RecorderHandle } from '../utils/audio';

interface PronunciationTabProps {
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
  onOpenTroubleshooter: () => void;
}

export const PronunciationTab: React.FC<PronunciationTabProps> = ({
  selectedVoice,
  onOpenTroubleshooter,
}) => {
  const [currentExercise, setCurrentExercise] = useState<PronunciationExercise>(
    PRONUNCIATION_EXERCISES[0]
  );
  const [isPlayingModel, setIsPlayingModel] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorderHandle, setRecorderHandle] = useState<RecorderHandle | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [userRecordedUrl, setUserRecordedUrl] = useState<string | null>(null);
  const [userAudioBase64, setUserAudioBase64] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [evaluationResult, setEvaluationResult] = useState<PronunciationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Monitor audio levels when recording
  useEffect(() => {
    if (!isRecording || !recorderHandle) return;
    const interval = setInterval(() => {
      setAudioLevel(recorderHandle.getAudioLevel());
    }, 60);
    return () => clearInterval(interval);
  }, [isRecording, recorderHandle]);

  const handlePlayModelAudio = async () => {
    if (isPlayingModel) {
      stopCurrentAudio();
      setIsPlayingModel(false);
      return;
    }
    try {
      setIsPlayingModel(true);
      const audioUri = await generatePersianTTS(currentExercise.farsi, selectedVoice);
      playAudioUri(audioUri, {
        onEnd: () => setIsPlayingModel(false),
        onError: () => setIsPlayingModel(false),
      });
    } catch (err: any) {
      console.error(err);
      setIsPlayingModel(false);
    }
  };

  const handleStartRecording = async () => {
    setErrorMessage(null);
    setEvaluationResult(null);
    setUserRecordedUrl(null);
    setUserAudioBase64(null);

    try {
      const handle = await startAudioRecording();
      setRecorderHandle(handle);
      setIsRecording(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'לא ניתן להפעיל את המיקרופון');
      onOpenTroubleshooter();
    }
  };

  const handleStopRecording = async () => {
    if (!recorderHandle) return;
    setIsRecording(false);
    setIsEvaluating(true);

    try {
      const { audioBase64, mimeType, blobUrl } = await recorderHandle.stop();
      setRecorderHandle(null);
      setUserRecordedUrl(blobUrl);
      setUserAudioBase64(audioBase64);

      // Evaluate pronunciation with Gemini
      const evalRes = await evaluatePronunciation({
        targetFarsi: currentExercise.farsi,
        targetFingilish: currentExercise.fingilish,
        audioBase64,
        mimeType,
      });

      setEvaluationResult(evalRes);
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאה בניתוח ההגייה');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          מעבדת הגייה פונטית ושאדואינג (Shadowing)
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          אימון הגייה ודיבור בפרסית מדוברת
        </h2>
        <p className="text-sm text-slate-400 max-w-xl mx-auto">
          הקשב למשפט בפרסית מדוברת טהראנית, חזור עליו לתוך המיקרופון, וקבל ציון ומשוב מפורט מבוסס AI!
        </p>
      </div>

      {/* Exercise Selection Carousel */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {PRONUNCIATION_EXERCISES.map((ex, index) => {
          const isSelected = currentExercise.id === ex.id;
          return (
            <button
              key={ex.id}
              onClick={() => {
                setCurrentExercise(ex);
                setEvaluationResult(null);
                setUserRecordedUrl(null);
              }}
              className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-emerald-500/15 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="font-bold">תרגיל {index + 1}</span>
                <span
                  className={`text-[9px] px-1.5 py-0.2 rounded ${
                    ex.difficulty === 'קל'
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : ex.difficulty === 'בינוני'
                      ? 'bg-amber-500/20 text-amber-300'
                      : 'bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {ex.difficulty}
                </span>
              </div>
              <div className="font-persian text-xs font-semibold truncate text-emerald-300">
                {ex.farsi}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Practice Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Category & Difficulty */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-medium">
            קטגוריה: {currentExercise.category}
          </span>
          <span className="text-xs text-slate-400">
            רמת קושי: <strong className="text-white">{currentExercise.difficulty}</strong>
          </span>
        </div>

        {/* Target Phrase Display */}
        <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-6 text-center space-y-4">
          <div className="text-xs text-slate-400 uppercase font-semibold tracking-wider">
            משפט היעד להגייה בפרסית מדוברת
          </div>

          <div className="font-persian text-3xl sm:text-4xl font-extrabold text-white leading-relaxed tracking-wide">
            {currentExercise.farsi}
          </div>

          <div className="font-mono text-sm sm:text-base text-emerald-400 font-semibold tracking-wide">
            {currentExercise.fingilish}
          </div>

          <div className="text-sm text-slate-300 font-medium">
            תרגום: {currentExercise.hebrew}
          </div>

          {/* Native Audio Listen Button */}
          <div className="pt-2">
            <button
              onClick={handlePlayModelAudio}
              className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-md ${
                isPlayingModel
                  ? 'bg-amber-500 text-slate-950 animate-pulse'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              }`}
            >
              {isPlayingModel ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  משמיע קול טהראני אותנטי...
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4" />
                  הקשב להגייה מקורית (Gemini Voice)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Phonetic Tip Callout */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3 text-xs text-slate-300">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-amber-300 block mb-0.5">דגש פונטי למשפט זה:</span>
            {currentExercise.colloquialTip}
          </div>
        </div>

        {/* Voice Recording Controls */}
        <div className="border-t border-slate-800 pt-6 flex flex-col items-center justify-center space-y-4">
          {errorMessage && (
            <div className="text-xs text-rose-400 bg-rose-950/60 border border-rose-800 p-3 rounded-xl max-w-md text-center">
              {errorMessage}
            </div>
          )}

          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              disabled={isEvaluating}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold text-base rounded-2xl shadow-xl transition-all transform hover:scale-105 active:scale-95"
            >
              <Mic className="w-6 h-6" />
              <span>הקלט את קולך עכשיו</span>
            </button>
          ) : (
            <div className="flex flex-col items-center gap-3 w-full max-w-md">
              <button
                onClick={handleStopRecording}
                className="flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-bold text-base rounded-2xl shadow-xl transition-all animate-pulse transform active:scale-95"
              >
                <MicOff className="w-6 h-6" />
                <span>עצור ובדוק הגייה</span>
              </button>

              <div className="w-full flex items-center gap-3 text-xs text-slate-400">
                <span>עוצמת שמע:</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden p-0.5">
                  <div
                    className="h-full bg-emerald-400 rounded-full transition-all duration-75"
                    style={{ width: `${Math.max(5, audioLevel)}%` }}
                  />
                </div>
                <span className="font-mono">{audioLevel}%</span>
              </div>
            </div>
          )}

          {isEvaluating && (
            <div className="flex items-center gap-2 text-xs text-emerald-400 animate-pulse">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>ה-AI מנתח את ההקלטה שלך מול הפונטיקה הטהראנית...</span>
            </div>
          )}

          {userRecordedUrl && !isRecording && (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => playAudioUri(userRecordedUrl)}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 rounded-lg transition-colors border border-slate-700"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                השמע את ההקלטה שלך
              </button>
            </div>
          )}
        </div>

        {/* AI Pronunciation Evaluation Results Card */}
        {evaluationResult && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-6 space-y-4 animate-in fade-in duration-300">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" />
                <h4 className="font-bold text-white text-base">תוצאות בדיקת ההגייה ב-AI</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">ציון דיוק:</span>
                <span
                  className={`text-xl font-extrabold px-3 py-0.5 rounded-lg font-mono ${
                    evaluationResult.score >= 80
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : evaluationResult.score >= 60
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {evaluationResult.score} / 100
                </span>
              </div>
            </div>

            {/* Recognized audio */}
            {evaluationResult.recognizedFarsi && (
              <div className="text-xs text-slate-300 space-y-1">
                <span className="text-slate-400">מה שנקלט מההקלטה שלך:</span>
                <div className="font-persian text-lg text-emerald-300">
                  {evaluationResult.recognizedFarsi}
                </div>
                {evaluationResult.recognizedFingilish && (
                  <div className="font-mono text-xs text-slate-400">
                    ({evaluationResult.recognizedFingilish})
                  </div>
                )}
              </div>
            )}

            {/* Feedback Hebrew */}
            <div className="text-sm text-slate-200 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-700/50">
              <span className="font-semibold text-emerald-400 block mb-1">משוב המאמן:</span>
              {evaluationResult.feedbackHebrew}
            </div>

            {/* Phonetic Tips */}
            {evaluationResult.phoneticTips && evaluationResult.phoneticTips.length > 0 && (
              <div className="space-y-1.5 text-xs text-slate-300">
                <span className="font-semibold text-amber-300 block">טיפים לשיפור הפונטיקה:</span>
                <ul className="list-disc list-inside space-y-1 text-slate-400 pr-2">
                  {evaluationResult.phoneticTips.map((tip, idx) => (
                    <li key={idx}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
