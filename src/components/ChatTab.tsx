import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Sparkles,
  AlertCircle,
  CheckCircle,
  HelpCircle,
  RefreshCw,
  ShoppingBag,
  MessageSquare,
  HeartHandshake,
  Utensils,
  Car,
  Keyboard,
  Info,
  Loader2,
  Play,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { ChatMessage, Scenario, PersianLevel, SuggestedReply } from '../types';
import { SCENARIOS } from '../data/curriculum';
import { sendChatMessage, generatePersianTTS, transcribeAudio } from '../services/api';
import { startAudioRecording, playAudioUri, stopCurrentAudio, RecorderHandle } from '../utils/audio';

interface ChatTabProps {
  level: PersianLevel;
  selectedVoice: 'Kore' | 'Puck' | 'Zephyr' | 'Fenrir';
  onOpenTroubleshooter: () => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  level,
  selectedVoice,
  onOpenTroubleshooter,
}) => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recorderHandle, setRecorderHandle] = useState<RecorderHandle | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);
  const [recordingStatusText, setRecordingStatusText] = useState<string>('');
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [showPersianKeyboard, setShowPersianKeyboard] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with scenario's starter message
  useEffect(() => {
    const starter = selectedScenario.starterMessage;
    const initialMsg: ChatMessage = {
      id: 'starter-' + selectedScenario.id,
      sender: 'assistant',
      farsi: starter.farsi,
      fingilish: starter.fingilish,
      hebrew: starter.hebrew,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedReplies: [
        { farsi: 'سلام! ممنون، منم خوبم.', fingilish: 'Salam! Mamnoon, manam khoobam.', hebrew: 'שלום! תודה, גם אני טוב.' },
        { farsi: 'قربونت برم، همه‌چی عالیه!', fingilish: 'Ghorboonet beram, hame-chi a\'aliye!', hebrew: 'כפרה עליך (תודה חמה), הכל מצוין!' },
        { farsi: 'بد نیستم، روز شلوغی داشتم.', fingilish: 'Bad nistam, rooz-e sholooghi dashtam.', hebrew: 'לא רע, היה לי יום עמוס.' },
      ],
      culturalNote: 'בטהראן נהוג לפתוח שיחה בסדרת שאלות חמות ("چطوری؟ خوبی؟ رو‌به‌راهی؟") לפני שעוברים לעניין המרכזי.',
    };
    setMessages([initialMsg]);
    // Automatically speak the starter greeting
    playPersianAudio(starter.farsi, initialMsg.id);
  }, [selectedScenario]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  // Audio level monitoring during recording
  useEffect(() => {
    if (!isRecording || !recorderHandle) return;
    const interval = setInterval(() => {
      setAudioLevel(recorderHandle.getAudioLevel());
    }, 60);
    return () => clearInterval(interval);
  }, [isRecording, recorderHandle]);

  // Play Persian TTS Audio with Gemini
  const playPersianAudio = async (text: string, msgId: string) => {
    try {
      if (currentlyPlayingId === msgId) {
        stopCurrentAudio();
        setCurrentlyPlayingId(null);
        return;
      }

      setCurrentlyPlayingId(msgId);
      const audioUri = await generatePersianTTS(text, selectedVoice);
      playAudioUri(audioUri, {
        playbackRate: playbackSpeed,
        onEnd: () => setCurrentlyPlayingId(null),
        onError: () => setCurrentlyPlayingId(null),
      });
    } catch (err: any) {
      console.error('Audio playback error', err);
      setCurrentlyPlayingId(null);
    }
  };

  // Send message to AI Coach
  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    setErrorMessage(null);
    const userMsgId = 'user-' + Date.now();
    const newUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      farsi: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build history for API
      const history = [...messages, newUserMsg].map((m) => ({
        sender: m.sender,
        text: m.farsi,
      }));

      const response = await sendChatMessage({
        messages: history,
        scenario: `${selectedScenario.titleHe} (${selectedScenario.promptContext})`,
        level,
      });

      const assistantMsgId = 'assistant-' + Date.now();
      const newAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        sender: 'assistant',
        farsi: response.replyFarsi,
        fingilish: response.replyFingilish,
        hebrew: response.replyHebrew,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        correction: response.correction?.hasCorrection ? response.correction : undefined,
        suggestedReplies: response.suggestedReplies,
        culturalNote: response.culturalNote,
      };

      setMessages((prev) => [...prev, newAssistantMsg]);

      // Automatically speak the AI response
      playPersianAudio(response.replyFarsi, assistantMsgId);
    } catch (err: any) {
      setErrorMessage(err.message || 'שגיאה בקבלת תשובה מהמאמן');
    } finally {
      setIsLoading(false);
    }
  };

  // Start recording audio from microphone
  const handleStartRecording = async () => {
    setErrorMessage(null);
    try {
      setRecordingStatusText('מקליט... דבר בפרסית או בעברית');
      const handle = await startAudioRecording();
      setRecorderHandle(handle);
      setIsRecording(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'לא ניתן להפעיל את המיקרופון');
      onOpenTroubleshooter();
    }
  };

  // Stop recording and send audio to server for Gemini transcription
  const handleStopRecording = async () => {
    if (!recorderHandle) return;
    setIsRecording(false);
    setRecordingStatusText('מעבד ומתמלל את הדיבור שלך ב-AI...');

    try {
      const { audioBase64, mimeType } = await recorderHandle.stop();
      setRecorderHandle(null);

      // Transcribe via Gemini
      const transcribeRes = await transcribeAudio(audioBase64, mimeType);
      const recognized = transcribeRes.transcriptionFarsi?.trim();

      if (recognized) {
        setInputText(recognized);
        setRecordingStatusText('');
        // Automatically send the transcribed speech
        handleSendMessage(recognized);
      } else {
        setRecordingStatusText('');
        setErrorMessage('לא זוהה דיבור ברור בהקלטה. נסה שוב ודבר קרוב יותר למיקרופון.');
      }
    } catch (err: any) {
      setRecordingStatusText('');
      setRecorderHandle(null);
      setErrorMessage('שגיאה בתמלול ההקלטה: ' + (err.message || 'נסה שוב'));
    }
  };

  const getScenarioIcon = (iconName: string) => {
    switch (iconName) {
      case 'ShoppingBag': return <ShoppingBag className="w-4 h-4" />;
      case 'HeartHandshake': return <HeartHandshake className="w-4 h-4" />;
      case 'Utensils': return <Utensils className="w-4 h-4" />;
      case 'Car': return <Car className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  // Quick Persian letters for users without Persian keyboard layout
  const quickPersianLetters = ['پ', 'چ', 'ژ', 'گ', 'می‌خوام', 'می‌رم', 'خونه', 'نون', 'قربونت', 'دستت درد نکنه', 'چطوری', 'ممنون'];

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto px-4 py-6">
      {/* Sidebar: Scenario Selector & Learning Tips */}
      <div className="w-full lg:w-80 shrink-0 space-y-4">
        {/* Scenarios Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              תרחישי שיחה מדוברת
            </h3>
            <span className="text-[11px] text-slate-400">בחר נושא</span>
          </div>

          <div className="space-y-1.5">
            {SCENARIOS.map((sc) => {
              const isSelected = selectedScenario.id === sc.id;
              return (
                <button
                  key={sc.id}
                  onClick={() => setSelectedScenario(sc)}
                  className={`w-full text-right p-3 rounded-xl transition-all border flex items-start gap-3 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500/40 text-white shadow-md'
                      : 'bg-slate-800/40 border-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    {getScenarioIcon(sc.iconName)}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-xs leading-snug">{sc.titleHe}</div>
                    <div className="font-persian text-[11px] text-emerald-400/90 truncate mt-0.5">{sc.titleFa}</div>
                    <div className="text-[11px] text-slate-400 line-clamp-1 mt-1">{sc.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Audio Diagnostics & Controls Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Volume2 className="w-3.5 h-3.5 text-indigo-400" />
              הגדרות קול והקראה
            </h4>
            <button
              onClick={onOpenTroubleshooter}
              className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              אבחון בעיות
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-slate-300">
            <span>מהירות הקראה:</span>
            <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
              {[0.8, 1.0, 1.2].map((s) => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[11px] font-semibold transition-colors ${
                    playbackSpeed === s ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-[11px] text-slate-300 space-y-1">
            <span className="font-semibold text-emerald-400 block">✓ טכנולוגיית Gemini TTS:</span>
            <p className="text-slate-400 leading-relaxed">
              הקול מופק ישירות בשרת AI באיכות 24kHz. אינך תלוי בקולות המותקנים במחשב, וההקראה עובדת בכל מקום!
            </p>
          </div>
        </div>
      </div>

      {/* Main Conversation Stream */}
      <div className="flex-1 flex flex-col h-[750px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-slate-900/90 px-6 py-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-persian font-bold text-lg">
              ف
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-sm">{selectedScenario.titleHe}</h3>
                <span className="text-[10px] bg-slate-800 text-emerald-400 font-persian px-2 py-0.5 rounded-full border border-slate-700">
                  {selectedScenario.titleFa}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                פרסית מדוברת טהראנית (فارسی عامیانه) • רמה: {level}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              const starter = selectedScenario.starterMessage;
              setMessages([
                {
                  id: 'starter-' + Date.now(),
                  sender: 'assistant',
                  farsi: starter.farsi,
                  fingilish: starter.fingilish,
                  hebrew: starter.hebrew,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  suggestedReplies: [
                    { farsi: 'سلام! ممنون، منم خوبم.', fingilish: 'Salam! Mamnoon, manam khoobam.', hebrew: 'שלום! תודה, גם אני טוב.' },
                    { farsi: 'قربونت برم، همه‌چی عالیه!', fingilish: 'Ghorboonet beram, hame-chi a\'aliye!', hebrew: 'כפרה עליך, הכל מצוין!' }
                  ],
                },
              ]);
            }}
            title="איפוס והתחלת השיחה מחדש"
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">התחל מחדש</span>
          </button>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg) => {
            const isAssistant = msg.sender === 'assistant';
            const isPlaying = currentlyPlayingId === msg.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isAssistant ? 'items-start' : 'items-end'}`}
              >
                <div
                  className={`max-w-2xl rounded-2xl p-5 shadow-lg relative ${
                    isAssistant
                      ? 'bg-slate-800/90 border border-slate-700/80 text-slate-100 rounded-tr-sm'
                      : 'bg-emerald-600 text-white rounded-tl-sm'
                  }`}
                >
                  {/* Persian Spoken Text */}
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-persian text-xl sm:text-2xl leading-relaxed text-right font-medium tracking-wide">
                      {msg.farsi}
                    </p>

                    {/* TTS Audio Button */}
                    <button
                      onClick={() => playPersianAudio(msg.farsi, msg.id)}
                      title={isPlaying ? 'עצור שמע' : 'השמע בפרסית מדוברת'}
                      className={`shrink-0 p-2.5 rounded-xl transition-all ${
                        isPlaying
                          ? 'bg-amber-500 text-slate-950 animate-pulse'
                          : isAssistant
                          ? 'bg-slate-700 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      }`}
                    >
                      {isPlaying ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Fingilish (Latin transliteration) */}
                  {msg.fingilish && (
                    <div className="mt-2.5 pt-2 border-t border-slate-700/60 flex items-center gap-2">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 bg-slate-900/60 px-1.5 py-0.5 rounded">
                        Fingilish
                      </span>
                      <p className="font-mono text-xs text-emerald-300 font-medium tracking-wide">
                        {msg.fingilish}
                      </p>
                    </div>
                  )}

                  {/* Hebrew Translation */}
                  {msg.hebrew && (
                    <div className="mt-1.5 text-xs text-slate-300 font-medium">
                      <span className="text-slate-400">עברית: </span>
                      {msg.hebrew}
                    </div>
                  )}

                  {/* Grammar & Colloquial Correction Alert */}
                  {msg.correction && msg.correction.hasCorrection && (
                    <div className="mt-3 p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs space-y-2">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>טיפ דיוק מדובר (טהראנית עממית):</span>
                      </div>
                      {msg.correction.userOriginal && (
                        <div className="text-slate-300 text-[11px]">
                          <span className="text-slate-400">אמרת: </span>
                          <span className="line-through text-rose-300 font-persian text-sm">
                            {msg.correction.userOriginal}
                          </span>
                        </div>
                      )}
                      {msg.correction.correctedFarsi && (
                        <div className="text-emerald-300 font-semibold">
                          <span className="text-slate-400">עדיף במדוברת: </span>
                          <span className="font-persian text-base text-emerald-300">
                            {msg.correction.correctedFarsi}
                          </span>
                          {msg.correction.correctedFingilish && (
                            <span className="font-mono text-xs text-emerald-400/80 mr-2">
                              ({msg.correction.correctedFingilish})
                            </span>
                          )}
                        </div>
                      )}
                      {msg.correction.hebrewExplanation && (
                        <p className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-amber-500/20">
                          {msg.correction.hebrewExplanation}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Cultural / Slang Nugget */}
                  {msg.culturalNote && (
                    <div className="mt-3 p-2.5 bg-indigo-950/40 border border-indigo-700/40 rounded-xl text-[11px] text-indigo-200 flex items-start gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-indigo-300">הערה תרבותית: </span>
                        {msg.culturalNote}
                      </div>
                    </div>
                  )}

                  <div className="text-[10px] text-slate-400 text-left mt-2 font-mono">
                    {msg.timestamp}
                  </div>
                </div>

                {/* Suggested User Replies (Click to Send) */}
                {isAssistant && msg.suggestedReplies && msg.suggestedReplies.length > 0 && (
                  <div className="mt-3 max-w-2xl w-full">
                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 mb-2">
                      <Zap className="w-3 h-3 text-amber-400" />
                      הצעות לתשובה מהירה (לחץ לשליחה או קריאה):
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {msg.suggestedReplies.map((reply, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(reply.farsi)}
                          className="bg-slate-800 hover:bg-emerald-600 hover:border-emerald-500 border border-slate-700 p-2.5 rounded-xl text-right transition-all group shadow-sm flex flex-col"
                        >
                          <span className="font-persian text-sm font-semibold text-emerald-300 group-hover:text-white">
                            {reply.farsi}
                          </span>
                          <span className="font-mono text-[10px] text-slate-400 group-hover:text-emerald-100">
                            {reply.fingilish}
                          </span>
                          <span className="text-[10px] text-slate-400 group-hover:text-white mt-0.5">
                            {reply.hebrew}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-3 text-slate-400 text-xs p-4 bg-slate-800/40 rounded-xl border border-slate-800 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
              <span>המאמן חושב ומכין תשובה בפרסית מדוברת...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="px-6 py-2.5 bg-rose-950/80 border-t border-rose-800 text-rose-300 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 hover:text-white font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* Recording Status Bar */}
        {isRecording && (
          <div className="px-6 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-semibold text-rose-300">
                {recordingStatusText || 'מקליט... דבר בפרסית מדוברת'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">עוצמה:</span>
              <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-400 transition-all duration-75"
                  style={{ width: `${Math.max(5, audioLevel)}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Persian Virtual Helpers / Keyboard Bar */}
        {showPersianKeyboard && (
          <div className="px-6 py-2 bg-slate-800/80 border-t border-slate-700/80 flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-semibold pl-2">קיצורים:</span>
            {quickPersianLetters.map((item, i) => (
              <button
                key={i}
                onClick={() => setInputText((prev) => prev + (prev.length > 0 ? ' ' : '') + item)}
                className="px-2.5 py-1 bg-slate-700 hover:bg-emerald-600 hover:text-white text-emerald-300 font-persian text-xs rounded-lg transition-colors border border-slate-600/60"
              >
                {item}
              </button>
            ))}
          </div>
        )}

        {/* Input Controls Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2.5">
          {/* Virtual Keyboard Toggle */}
          <button
            onClick={() => setShowPersianKeyboard(!showPersianKeyboard)}
            title="מקלדת עזר למילים נפוצות בפרסית"
            className={`p-2.5 rounded-xl border transition-colors ${
              showPersianKeyboard
                ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
          >
            <Keyboard className="w-5 h-5" />
          </button>

          {/* Text Input */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="הקלד כאן בפרסית או השתמש במיקרופון לדיבור קולי..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-right font-persian"
          />

          {/* Big Voice Microphone Button */}
          {!isRecording ? (
            <button
              onClick={handleStartRecording}
              title="לחץ להקלטת דיבור קולי במיקרופון"
              className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all active:scale-95 shrink-0"
            >
              <Mic className="w-5 h-5" />
              <span className="hidden sm:inline">דבר במיקרופון</span>
            </button>
          ) : (
            <button
              onClick={handleStopRecording}
              title="לחץ לסיום ההקלטה ושליחה"
              className="flex items-center gap-2 px-4 py-3 bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all animate-pulse active:scale-95 shrink-0"
            >
              <MicOff className="w-5 h-5" />
              <span className="hidden sm:inline">סיים ושלח</span>
            </button>
          )}

          {/* Send Text Button */}
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isLoading}
            title="שלח הודעה"
            className="p-3 bg-slate-800 hover:bg-emerald-600 disabled:opacity-40 disabled:hover:bg-slate-800 text-white rounded-xl border border-slate-700 hover:border-emerald-500 transition-colors shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
