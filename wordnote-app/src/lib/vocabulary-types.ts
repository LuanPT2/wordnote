// Types for vocabulary library
export interface Example {
  id: string;
  sentence: string;
  translation: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: Example[];
  category: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dateAdded: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
  tags?: string[];
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  parentId?: string;
  children?: Category[];
  color?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  description?: string;
  categoryId?: string;
}

export interface VocabularyFilter {
  searchTerm?: string;
  categories?: string[];
  topics?: string[];
  difficulty?: 'all' | 'easy' | 'medium' | 'hard';
  mastered?: 'all' | 'mastered' | 'not-mastered';
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export interface VocularySortOptions {
  field: 'word' | 'dateAdded' | 'reviewCount' | 'difficulty' | 'lastReviewed';
  order: 'asc' | 'desc';
}

export interface BulkOperation {
  type: 'delete' | 'move-category' | 'change-difficulty' | 'mark-mastered' | 'add-tag';
  itemIds: string[];
  data?: any;
}

export interface VocabularyStats {
  total: number;
  mastered: number;
  notMastered: number;
  byDifficulty: Record<string, number>;
  byCategory: Record<string, number>;
  recentlyAdded: number;
  needReview: number;
}

export interface VocabularyExport {
  vocabulary: VocabularyItem[];
  categories: Category[];
  topics: Topic[];
  exportDate: string;
  version: string;
}

// Event types for library communication
export interface VocabularyLibraryEvents {
  onItemAdded: (item: VocabularyItem) => void;
  onItemUpdated: (item: VocabularyItem) => void;
  onItemDeleted: (itemId: string) => void;
  onBulkOperation: (operation: BulkOperation) => void;
  onCategoryAdded: (category: Category) => void;
  onCategoryUpdated: (category: Category) => void;
  onCategoryDeleted: (categoryId: string) => void;
}