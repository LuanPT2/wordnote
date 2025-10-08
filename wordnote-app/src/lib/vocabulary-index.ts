// Main vocabulary library exports
export { vocabularyLibrary, VocabularyLibrary } from './vocabulary-library';
export * from './vocabulary-types';

// Component exports
export { VocabularyManager } from '../components/vocabulary/VocabularyManager';
export { CategoryCreator } from '../components/vocabulary/CategoryCreator';

// Utility functions
export const vocabularyUtils = {
  // Quick access functions
  getStats: () => vocabularyLibrary.getStatistics(),
  getCategories: () => vocabularyLibrary.getCategories(),
  getAllVocabulary: () => vocabularyLibrary.getAllVocabulary(),
  
  // Search functions
  searchVocabulary: (term: string) => vocabularyLibrary.filterVocabulary({ searchTerm: term }),
  getVocabularyByCategory: (category: string) => vocabularyLibrary.filterVocabulary({ categories: [category] }),
  getMasteredVocabulary: () => vocabularyLibrary.filterVocabulary({ mastered: 'mastered' }),
  getUnmasteredVocabulary: () => vocabularyLibrary.filterVocabulary({ mastered: 'not-mastered' }),
  
  // Quick add functions
  addQuickWord: (word: string, meaning: string, category = 'New') => {
    return vocabularyLibrary.addVocabularyItem({
      word,
      pronunciation: '',
      meaning,
      examples: [],
      category,
      topic: 'general',
      difficulty: 'medium'
    });
  },
  
  // Export/Import helpers
  exportToJSON: () => {
    const data = vocabularyLibrary.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wordnote-vocabulary-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  },
  
  importFromJSON: (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const success = vocabularyLibrary.importData(data);
          resolve(success);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
};

// Hook-like functions for React components
export const useVocabulary = () => {
  return {
    library: vocabularyLibrary,
    utils: vocabularyUtils,
    
    // Quick actions
    addWord: vocabularyUtils.addQuickWord,
    search: vocabularyUtils.searchVocabulary,
    getStats: vocabularyUtils.getStats,
    
    // Reactive data getters
    getAllVocabulary: () => vocabularyLibrary.getAllVocabulary(),
    getCategories: () => vocabularyLibrary.getCategories(),
    
    // Category management
    createCategory: (name: string, parentId?: string, color?: string) => {
      return vocabularyLibrary.addCategory({
        name,
        parentId,
        color: color || 'bg-blue-100 text-blue-800',
        description: ''
      });
    }
  };
};

// Integration helpers for different screens
export const vocabularyIntegration = {
  // For Practice Screen
  getPracticeWords: (difficulty?: 'easy' | 'medium' | 'hard', limit = 20) => {
    const filter: any = { mastered: 'not-mastered' };
    if (difficulty) filter.difficulty = difficulty;
    
    const words = vocabularyLibrary.filterVocabulary(filter);
    return vocabularyLibrary.sortVocabulary(words, { field: 'reviewCount', order: 'asc' }).slice(0, limit);
  },
  
  // For Listening Screen
  getListeningWords: (category?: string, limit = 15) => {
    const filter: any = {};
    if (category) filter.categories = [category];
    
    const words = vocabularyLibrary.filterVocabulary(filter);
    return vocabularyLibrary.sortVocabulary(words, { field: 'dateAdded', order: 'desc' }).slice(0, limit);
  },
  
  // For Story Screen
  getStoryWords: (limit = 10) => {
    const words = vocabularyLibrary.filterVocabulary({ categories: ['Story'] });
    return vocabularyLibrary.sortVocabulary(words, { field: 'dateAdded', order: 'desc' }).slice(0, limit);
  },
  
  // For Free Study Screen
  getRecentWords: (days = 7, limit = 30) => {
    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - days);
    
    const words = vocabularyLibrary.filterVocabulary({
      dateFrom: dateFrom.toISOString().split('T')[0]
    });
    return vocabularyLibrary.sortVocabulary(words, { field: 'dateAdded', order: 'desc' }).slice(0, limit);
  },
  
  // Mark word as reviewed
  markAsReviewed: (wordId: string) => {
    const word = vocabularyLibrary.getVocabularyItem(wordId);
    if (word) {
      vocabularyLibrary.updateVocabularyItem(wordId, {
        reviewCount: word.reviewCount + 1,
        lastReviewed: new Date().toISOString().split('T')[0]
      });
    }
  },
  
  // Toggle mastered status
  toggleMastered: (wordId: string) => {
    const word = vocabularyLibrary.getVocabularyItem(wordId);
    if (word) {
      vocabularyLibrary.updateVocabularyItem(wordId, {
        mastered: !word.mastered
      });
    }
    return word ? !word.mastered : false;
  }
};

export default {
  library: vocabularyLibrary,
  utils: vocabularyUtils,
  integration: vocabularyIntegration,
  useVocabulary,
  VocabularyManager,
  CategoryCreator
};