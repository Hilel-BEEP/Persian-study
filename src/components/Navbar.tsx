import React from 'react';
import {
  MessageSquare,
  Mic,
  BookOpen,
  Award,
  FileCode2,
  Wrench,
  Sparkles,
  Volume2,
} from 'lucide-react';
import { TabType, PersianLevel } from '../types';

interface NavbarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  level: PersianLevel;
  setLevel: (level: PersianLevel) => void;
  onOpenTroubleshooter: () => void;
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
  setSelectedVoice: (voice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  level,
  setLevel,
  onOpenTroubleshooter,
  selectedVoice,
  setSelectedVoice,
}) => {
  const tabs: { id: TabType; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'chat', label: 'שיחה חיה עם ה-AI', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'pronunciation', label: 'מעבדת הגייה (Shadowing)', icon: <Mic className="w-4 h-4" /> },
    { id: 'guide', label: 'מדריך מדוברת וסלנג', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'quiz', label: 'מבחן ותרגילים', icon: <Award className="w-4 h-4" /> },
    { id: 'project-book', label: 'ספר פרויקט (י״ב נחשון)', icon: <FileCode2 className="w-4 h-4" />, badge: 'מדעי המחשב' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo & School Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-400 flex items-center justify-center text-white shadow-lg shadow-emerald-950/50">
              <span className="font-persian font-bold text-xl leading-none">ف</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight">פארסיבּוֹט</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI מדוברת טהראנית
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                עבודת גמר במחשבים כיתה י״ב • כיתת נחשון
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-800/60 p-1 rounded-xl border border-slate-700/50">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all relative ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className="text-[9px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.2 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Controls: Level selector, Voice selector, Troubleshooter */}
          <div className="flex items-center gap-2.5">
            {/* Level selector */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <span className="text-slate-400 text-[11px]">רמה:</span>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as PersianLevel)}
                aria-label="בחר רמת לימוד בפרסית"
                className="bg-transparent text-emerald-300 font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="מתחיל (مبتدی)" className="bg-slate-900 text-slate-200">מתחיל (مبتدی)</option>
                <option value="בינוני (متوسط)" className="bg-slate-900 text-slate-200">בינוני (متوسط)</option>
                <option value="מתקדם (پیشرفته)" className="bg-slate-900 text-slate-200">מתקדם (پیشرفته)</option>
              </select>
            </div>

            {/* Voice selector */}
            <div className="hidden md:flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              <select
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value as any)}
                aria-label="בחר קול להקראה בפרסית"
                className="bg-transparent text-indigo-300 font-medium text-xs focus:outline-none cursor-pointer"
              >
                <option value="Kore" className="bg-slate-900 text-slate-200">קול נשי רך (Kore)</option>
                <option value="Puck" className="bg-slate-900 text-slate-200">קול צעיר ודינמי (Puck)</option>
                <option value="Zephyr" className="bg-slate-900 text-slate-200">קול טבעי בהיר (Zephyr)</option>
                <option value="Fenrir" className="bg-slate-900 text-slate-200">קול גברי עמוק (Fenrir)</option>
              </select>
            </div>

            {/* Troubleshooter Button */}
            <button
              onClick={onOpenTroubleshooter}
              title="בדיקת מיקרופון ושמע במחשב זה"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 hover:border-emerald-500/50 transition-colors shadow-sm"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">בדיקת מיקרופון ושמע</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1 border-t border-slate-800 scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
