export type TabType = 'chat' | 'pronunciation' | 'guide' | 'quiz' | 'project-book';

export type PersianLevel = 'מתחיל (مبتدی)' | 'בינוני (متوسط)' | 'מתקדם (پیشرفته)';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  farsi: string;
  fingilish?: string;
  hebrew?: string;
  timestamp: string;
  audioBase64?: string;
  correction?: {
    hasCorrection: boolean;
    userOriginal?: string;
    correctedFarsi?: string;
    correctedFingilish?: string;
    hebrewExplanation?: string;
  };
  suggestedReplies?: SuggestedReply[];
  culturalNote?: string;
}

export interface SuggestedReply {
  farsi: string;
  fingilish: string;
  hebrew: string;
}

export interface Scenario {
  id: string;
  titleHe: string;
  titleFa: string;
  description: string;
  iconName: string;
  promptContext: string;
  starterMessage: {
    farsi: string;
    fingilish: string;
    hebrew: string;
  };
}

export interface PronunciationExercise {
  id: string;
  category: string;
  farsi: string;
  fingilish: string;
  hebrew: string;
  colloquialTip: string;
  difficulty: 'קל' | 'בינוני' | 'אתגרי';
}

export interface PronunciationResult {
  score: number;
  recognizedFarsi?: string;
  recognizedFingilish?: string;
  isGoodPronunciation: boolean;
  feedbackHebrew: string;
  phoneticTips: string[];
}

export interface ColloquialRule {
  id: string;
  titleHe: string;
  titleFa: string;
  descriptionHe: string;
  formalExample: {
    farsi: string;
    fingilish: string;
    hebrew: string;
  };
  colloquialExample: {
    farsi: string;
    fingilish: string;
    hebrew: string;
  };
  ruleExplanation: string;
  culturalInsight?: string;
}

export interface SlangPhrase {
  id: string;
  phraseFa: string;
  phraseFingilish: string;
  literalTranslationHe: string;
  actualMeaningHe: string;
  category: 'טערוף (تعارف)' | 'סלנג חברים' | 'הבעת חיבה' | 'יומיומי';
  contextExample: string;
}

export interface QuizQuestion {
  id: string;
  questionHe: string;
  questionFa?: string;
  options: {
    textFa: string;
    textFingilish: string;
    textHe: string;
    isCorrect: boolean;
  }[];
  explanationHe: string;
}
