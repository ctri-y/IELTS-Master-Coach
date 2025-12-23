
export type MistakeType = 'Grammar' | 'Vocabulary' | 'Collocation' | 'Logic' | 'Style';

export interface TranslationFeedback {
  translations: {
    standard: string;
    natural: string;
    advanced: string;
  };
  critique: {
    type: MistakeType;
    issue: string;
    suggestion: string;
  }[];
  estimatedBand: number;
}

export interface WritingCriterion {
  score: number;
  justification: string;
}

export interface WritingFeedback {
  overallBand: number;
  criteria: {
    taskResponse: WritingCriterion;
    coherence: WritingCriterion;
    lexical: WritingCriterion;
    grammar: WritingCriterion;
  };
  sentenceLevel: {
    original: string;
    type: 'strong' | 'weak';
    explanation: string;
    improved?: string;
  }[];
  upgrades: {
    vocabulary: { old: string; improved: string; context: string }[];
    structures: { original: string; improved: string }[];
  };
  revisedParagraphs: {
    original: string;
    revised: string;
  }[];
}

export enum AppMode {
  TRANSLATION = 'TRANSLATION',
  WRITING = 'WRITING'
}
