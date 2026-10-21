import React, { useState, useEffect } from 'react';
import { TabType, PersianLevel } from './types';
import { Navbar } from './components/Navbar';
import { ChatTab } from './components/ChatTab';
import { PronunciationTab } from './components/PronunciationTab';
import { ColloquialGuideTab } from './components/ColloquialGuideTab';
import { QuizTab } from './components/QuizTab';
import { ProjectDocTab } from './components/ProjectDocTab';
import { AudioTroubleshooterModal } from './components/AudioTroubleshooterModal';
import { checkServerHealth } from './services/api';
import { Wrench, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('chat');
  const [level, setLevel] = useState<PersianLevel>('מתחיל (مبتدی)');
  const [selectedVoice, setSelectedVoice] = useState<'Kore' | 'Puck' | 'Zephyr' | 'Fenrir'>('Kore');
  const [isTroubleshooterOpen, setIsTroubleshooterOpen] = useState<boolean>(false);
  const [serverStatus, setServerStatus] = useState<{ status: string; hasApiKey: boolean }>({
    status: 'checking',
    hasApiKey: false,
  });

  useEffect(() => {
    checkServerHealth().then(setServerStatus);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200" dir="rtl">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        level={level}
        setLevel={setLevel}
        onOpenTroubleshooter={() => setIsTroubleshooterOpen(true)}
        selectedVoice={selectedVoice}
        setSelectedVoice={setSelectedVoice}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'chat' && (
          <ChatTab
            level={level}
            selectedVoice={selectedVoice}
            onOpenTroubleshooter={() => setIsTroubleshooterOpen(true)}
          />
        )}

        {activeTab === 'pronunciation' && (
          <PronunciationTab
            selectedVoice={selectedVoice}
            onOpenTroubleshooter={() => setIsTroubleshooterOpen(true)}
          />
        )}

        {activeTab === 'guide' && (
          <ColloquialGuideTab selectedVoice={selectedVoice} />
        )}

        {activeTab === 'quiz' && (
          <QuizTab selectedVoice={selectedVoice} />
        )}

        {activeTab === 'project-book' && (
          <ProjectDocTab />
        )}
      </main>

      {/* Troubleshooting Dialog Modal */}
      <AudioTroubleshooterModal
        isOpen={isTroubleshooterOpen}
        onClose={() => setIsTroubleshooterOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-6 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">פארסיבּוֹט (FarsiBot)</span>
            <span>•</span>
            <span>עבודת גמר במדעי המחשב כיתה י״ב, כיתת נחשון</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsTroubleshooterOpen(true)}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <Wrench className="w-3 h-3" />
              בדיקת תקינות מיקרופון והקראה
            </button>
            <span>•</span>
            <span className="text-slate-500">מונע ע״י Google Gemini 3.8 Flash & TTS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
