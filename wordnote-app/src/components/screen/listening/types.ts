// types.ts
export interface VocabularyItem {
    id: string;
    word: string;
    pronunciation: string;
    meaning: string;
    examples: Array<{id: string, sentence: string, translation: string}>;
    category: string;
    topic: string;
    difficulty: 'easy' | 'medium' | 'hard';
    mastered: boolean;
  }
  
  export interface ListeningConfig {
    categories: string[];
    topics: string[];
    difficulties: string[];
    masteryStatus: string[];
    mode: string[];
    pauseBetweenWords: number;
    pauseBetweenParts: number;
  }
  
  export interface SavedWordList {
    id: string;
    name: string;
    wordIds: string[];
    createdAt: Date;
  }