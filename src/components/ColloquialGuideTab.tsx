import React, { useState } from 'react';
import {
  BookOpen,
  Volume2,
  Sparkles,
  ArrowLeft,
  CheckCircle,
  HelpCircle,
  Heart,
  MessageCircle,
} from 'lucide-react';
import { COLLOQUIAL_RULES, SLANG_PHRASES } from '../data/curriculum';
import { ColloquialRule, SlangPhrase } from '../types';
import { generatePersianTTS } from '../services/api';
import { playAudioUri } from '../utils/audio';

interface ColloquialGuideTabProps {
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
}

export const ColloquialGuideTab: React.FC<ColloquialGuideTabProps> = ({ selectedVoice }) => {
  const [activeSubTab, setActiveSubTab] = useState<'rules' | 'slang'>('rules');
  const [playingAudioKey, setPlayingAudioKey] = useState<string | null>(null);

  const handlePlayAudio = async (text: string, key: string) => {
    try {
      setPlayingAudioKey(key);
      const audioUri = await generatePersianTTS(text, selectedVoice);
      playAudioUri(audioUri, {
        onEnd: () => setPlayingAudioKey(null),
        onError: () => setPlayingAudioKey(null),
      });
    } catch (err) {
      console.error(err);
      setPlayingAudioKey(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          המדריך השלם לפרסית מדוברת טהראנית
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
          החוקים והסלנג של הרחוב בטהראן
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          גלה את ההבדלים בין השפה הספרותית הרשמית לבין הפרסית היומיומית האמיתית המדוברת בפי עשרות מיליוני איראנים.
        </p>
      </div>

      {/* Toggle between Rules and Slang */}
      <div className="flex justify-center">
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl flex gap-2">
          <button
            onClick={() => setActiveSubTab('rules')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'rules'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            חוקי הצמצום וההגייה (4 כללי הזהב)
          </button>
          <button
            onClick={() => setActiveSubTab('slang')}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeSubTab === 'slang'
                ? 'bg-emerald-600 text-white shadow-lg'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            מילון סלנג וביטויי טַעֲרוֹף (تعارف)
          </button>
        </div>
      </div>

      {/* Rules Section */}
      {activeSubTab === 'rules' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {COLLOQUIAL_RULES.map((rule) => (
            <div
              key={rule.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-slate-700 transition-colors"
            >
              <div className="space-y-4">
                <div className="border-b border-slate-800 pb-3">
                  <h3 className="font-bold text-white text-base leading-snug">{rule.titleHe}</h3>
                  <div className="font-persian text-xs text-emerald-400 mt-1 font-semibold">
                    {rule.titleFa}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {rule.descriptionHe}
                </p>

                {/* Comparison Box */}
                <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/80 space-y-3">
                  {/* Formal Book Persian */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-rose-400 font-semibold uppercase tracking-wider">
                        ספרותית רשמית (کتابی):
                      </span>
                      <button
                        onClick={() => handlePlayAudio(rule.formalExample.farsi, `formal-${rule.id}`)}
                        className="text-slate-400 hover:text-white p-1"
                        title="השמע ספרותית"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-persian text-base text-slate-300">
                      {rule.formalExample.farsi}
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      {rule.formalExample.fingilish}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {rule.formalExample.hebrew}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/80 my-2" />

                  {/* Colloquial Tehrani Spoken */}
                  <div className="text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        מדוברת טהראנית (عامیانه):
                      </span>
                      <button
                        onClick={() => handlePlayAudio(rule.colloquialExample.farsi, `colloquial-${rule.id}`)}
                        className="text-emerald-400 hover:text-emerald-300 p-1"
                        title="השמע מדוברת"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="font-persian text-lg text-emerald-300 font-bold">
                      {rule.colloquialExample.farsi}
                    </div>
                    <div className="font-mono text-[11px] text-emerald-400 font-semibold">
                      {rule.colloquialExample.fingilish}
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium">
                      {rule.colloquialExample.hebrew}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
                  <strong className="text-slate-200 block mb-0.5">הסבר הדקדוק המדובר:</strong>
                  {rule.ruleExplanation}
                </div>
              </div>

              {rule.culturalInsight && (
                <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-amber-300/90 flex items-start gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{rule.culturalInsight}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Slang & Ta'arof Section */}
      {activeSubTab === 'slang' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SLANG_PHRASES.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] bg-slate-800 text-emerald-400 px-2.5 py-1 rounded-full font-semibold border border-slate-700">
                    {item.category}
                  </span>
                  <button
                    onClick={() => handlePlayAudio(item.phraseFa, `slang-${item.id}`)}
                    className="p-2 bg-slate-800 hover:bg-emerald-600 hover:text-slate-950 text-emerald-400 rounded-xl transition-all"
                    title="השמע ביטוי קולי ב-AI"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <div className="font-persian text-2xl font-extrabold text-white leading-relaxed">
                    {item.phraseFa}
                  </div>
                  <div className="font-mono text-xs text-emerald-400 font-semibold tracking-wide">
                    {item.phraseFingilish}
                  </div>
                </div>

                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px]">תרגום מילולי: </span>
                    <span className="text-slate-300 italic">״{item.literalTranslationHe}״</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px]">משמעות אמיתית: </span>
                    <span className="text-emerald-300 font-bold">{item.actualMeaningHe}</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 pt-3 border-t border-slate-800">
                <strong className="text-slate-300">הקשר שימוש: </strong>
                {item.contextExample}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
