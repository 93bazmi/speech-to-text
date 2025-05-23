export interface Language {
  code: string;
  name: string;
  nativeName?: string;
}

export interface TranscriptSegment {
  text: string;
  timestamp: number;
  isFinal: boolean;
}

export interface TranscriptHistory {
  id: string;
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
  timestamp: number;
}