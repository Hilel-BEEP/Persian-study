import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RotateCcw,
  Volume2,
  Sparkles,
  ChevronLeft,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../data/curriculum';
import { generatePersianTTS } from '../services/api';
import { playAudioUri } from '../utils/audio';

interface QuizTabProps {
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
}

export const QuizTab: React.FC<QuizTabProps> = ({ selectedVoice }) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOptionIdx, setSelectedOptionIdx] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [score, setScore] = useState<number>(0);
  const [isFinished, setIsFinished] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOptionIdx(idx);
  };

  const handleSubmitAnswer = () => {
    if (selectedOptionIdx === null) return;
    setIsAnswerSubmitted(true);
    if (currentQ.options[selectedOptionIdx].isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOptionIdx(null);
      setIsAnswerSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedOptionIdx(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsFinished(false);
  };

  const handlePlayAudio = async (text: string) => {
    try {
      const audioUri = await generatePersianTTS(text, selectedVoice);
      playAudioUri(audioUri);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-xs font-semibold">
          <Award className="w-3.5 h-3.5" />
          מבחן ותרגול אינטראקטיבי
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          בוחן שליטה בפרסית מדוברת
        </h2>
        <p className="text-xs sm:text-sm text-slate-400">
          בדוק את הבנתך בשינויי תנועות, צמצום פעלים, סלנג מקומי וקודי התנהגות (טערוף)
        </p>
      </div>

      {!isFinished ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>שאלה {currentIdx + 1} מתוך {QUIZ_QUESTIONS.length}</span>
              <span className="font-mono text-emerald-400 font-bold">ציון: {score}</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
                style={{ width: `${((currentIdx + 1) / QUIZ_QUESTIONS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question Box */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {currentQ.questionHe}
            </h3>
            {currentQ.questionFa && (
              <p className="font-persian text-xl text-emerald-400">
                {currentQ.questionFa}
              </p>
            )}
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQ.options.map((option, idx) => {
              const isSelected = selectedOptionIdx === idx;
              let btnClass = 'bg-slate-800/60 border-slate-700/80 text-slate-200 hover:bg-slate-800';

              if (isAnswerSubmitted) {
                if (option.isCorrect) {
                  btnClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-200 shadow-md';
                } else if (isSelected && !option.isCorrect) {
                  btnClass = 'bg-rose-500/20 border-rose-500 text-rose-200';
                } else {
                  btnClass = 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60';
                }
              } else if (isSelected) {
                btnClass = 'bg-emerald-500/15 border-emerald-500 text-white shadow-md';
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 ${btnClass}`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-persian text-xl font-bold text-white">
                        {option.textFa}
                      </span>
                      {option.textFingilish && (
                        <span className="font-mono text-xs text-emerald-400">
                          ({option.textFingilish})
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-300">
                      {option.textHe}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePlayAudio(option.textFa);
                      }}
                      className="p-2 rounded-lg bg-slate-700/60 hover:bg-slate-600 text-slate-300 hover:text-white"
                      title="השמע אפשרות זו"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    {isAnswerSubmitted && option.isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    )}
                    {isAnswerSubmitted && isSelected && !option.isCorrect && (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Explanation if submitted */}
          {isAnswerSubmitted && (
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4.5 text-xs text-slate-300 space-y-2 animate-in fade-in duration-200">
              <span className="font-bold text-amber-300 block text-sm">
                הסבר הדקדוק המדובר:
              </span>
              <p className="leading-relaxed text-slate-200">
                {currentQ.explanationHe}
              </p>
            </div>
          )}

          {/* Footer Controls */}
          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
            <span className="text-xs text-slate-400">
              {selectedOptionIdx === null && !isAnswerSubmitted && 'בחר תשובה ולחץ על אישור'}
            </span>

            {!isAnswerSubmitted ? (
              <button
                onClick={handleSubmitAnswer}
                disabled={selectedOptionIdx === null}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg"
              >
                בדוק תשובה
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg"
              >
                <span>{currentIdx + 1 < QUIZ_QUESTIONS.length ? 'לשאלה הבאה' : 'לסיום המבחן'}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Quiz Finished View */
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Award className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-white">כל הכבוד! סיימת את המבחן</h3>
            <p className="text-sm text-slate-400">
              ענית נכון על <strong className="text-emerald-400 text-lg font-mono">{score}</strong> מתוך{' '}
              <strong className="text-white text-lg font-mono">{QUIZ_QUESTIONS.length}</strong> שאלות
            </p>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 max-w-md mx-auto text-xs text-slate-300">
            {score === QUIZ_QUESTIONS.length ? (
              <p className="text-emerald-400 font-semibold">
                מושלם! אתה מבין היטב את ההבדלים בין פרסית ספרותית לפרסית מדוברת טהראנית ואת מנהגי הטַעֲרוֹף!
              </p>
            ) : score >= QUIZ_QUESTIONS.length / 2 ? (
              <p className="text-amber-300">
                תוצאה יפה מאוד! מומלץ להמשיך לתרגל שיחה חיה ולעיין במדריך החוקים כדי להמשיך להשתפר.
              </p>
            ) : (
              <p className="text-slate-300">
                התחלה טובה! מומלץ לעבור על לשונית ״מדריך מדוברת וסלנג״ כדי להכיר את כללי הזהב של הדיאלקט הטהראני.
              </p>
            )}
          </div>

          <button
            onClick={handleRestart}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            בצע את המבחן שוב
          </button>
        </div>
      )}
    </div>
  );
};
