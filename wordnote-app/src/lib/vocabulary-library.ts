import { 
  VocabularyItem, 
  Category, 
  Topic, 
  VocabularyFilter, 
  VocularySortOptions, 
  BulkOperation, 
  VocabularyStats, 
  VocabularyExport,
  Example
} from './vocabulary-types';

export class VocabularyLibrary {
  private vocabulary: VocabularyItem[] = [];
  private categories: Category[] = [];
  private topics: Topic[] = [];
  private storageKey = 'wordnote-vocabulary-library';

  constructor() {
    this.loadFromStorage();
    this.initializeDefaultData();
    this.seedSampleData();
  }

  private seedSampleData() {
    // Only seed if we don't have enough vocabulary
    if (this.vocabulary.length >= 50) return;

    const sampleCategories = [
      { name: 'Business', color: 'bg-blue-100 text-blue-800' },
      { name: 'Technology', color: 'bg-green-100 text-green-800' },
      { name: 'Travel', color: 'bg-purple-100 text-purple-800' },
      { name: 'Food', color: 'bg-orange-100 text-orange-800' },
      { name: 'Education', color: 'bg-red-100 text-red-800' }
    ];

    const sampleWords = {
      'Business': [
        'profit', 'revenue', 'strategy', 'marketing', 'budget', 'investment', 'portfolio', 
        'shareholder', 'competitor', 'acquisition', 'franchise', 'partnership', 'negotiation',
        'contract', 'proposal', 'presentation', 'meeting', 'deadline', 'teamwork', 'leadership'
      ],
      'Technology': [
        'algorithm', 'database', 'software', 'hardware', 'network', 'security', 'encryption',
        'programming', 'debugging', 'interface', 'framework', 'automation', 'innovation',
        'digital', 'artificial', 'intelligence', 'machine', 'learning', 'blockchain', 'cloud'
      ],
      'Travel': [
        'destination', 'journey', 'adventure', 'explore', 'vacation', 'tourist', 'passport',
        'luggage', 'flight', 'hotel', 'booking', 'itinerary', 'sightseeing', 'culture',
        'landmark', 'monument', 'gallery', 'museum', 'souvenir', 'backpack'
      ],
      'Food': [
        'delicious', 'recipe', 'ingredient', 'cooking', 'kitchen', 'restaurant', 'chef',
        'cuisine', 'flavor', 'spicy', 'sweet', 'bitter', 'sour', 'appetizer', 'dessert',
        'beverage', 'nutrition', 'healthy', 'organic', 'vegetarian'
      ],
      'Education': [
        'knowledge', 'learning', 'student', 'teacher', 'classroom', 'homework', 'assignment',
        'examination', 'graduation', 'diploma', 'scholarship', 'library', 'research',
        'thesis', 'academic', 'curriculum', 'semester', 'lecture', 'tutorial', 'workshop'
      ]
    };

    // Add categories if they don't exist
    sampleCategories.forEach(cat => {
      if (!this.categories.find(c => c.name === cat.name)) {
        this.addCategory(cat);
      }
    });

    // Add vocabulary
    Object.entries(sampleWords).forEach(([category, words]) => {
      words.forEach((word, index) => {
        if (!this.vocabulary.find(v => v.word === word)) {
          this.addVocabularyItem({
            word,
            pronunciation: `/${word}/`,
            meaning: `Meaning of ${word}`,
            examples: [`Example sentence with ${word}.`],
            category,
            topic: 'general',
            difficulty: index < 7 ? 'easy' : index < 14 ? 'medium' : 'hard',
            mastered: Math.random() > 0.7 // 30% chance of being mastered
          });
        }
      });
    });
  }

  // ========== Storage Management ==========
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        const data = JSON.parse(stored);
        this.vocabulary = data.vocabulary || [];
        this.categories = data.categories || [];
        this.topics = data.topics || [];
      }
    } catch (error) {
      console.error('Error loading vocabulary from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = {
        vocabulary: this.vocabulary,
        categories: this.categories,
        topics: this.topics,
        lastUpdated: new Date().toISOString()
      };
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving vocabulary to storage:', error);
    }
  }

  private initializeDefaultData(): void {
    if (this.categories.length === 0) {
      const defaultCategories: Category[] = [
        {
          id: 'harry-potter',
          name: 'Harry Potter',
          color: 'bg-red-100 text-red-800',
          description: 'Từ vựng từ truyện Harry Potter',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'toeic',
          name: 'Luyện TOEIC',
          color: 'bg-green-100 text-green-800',
          description: 'Từ vựng TOEIC',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'daily',
          name: 'Daily',
          color: 'bg-blue-100 text-blue-800',
          description: 'Từ vựng hàng ngày',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'new',
          name: 'New',
          color: 'bg-purple-100 text-purple-800',
          description: 'Từ vựng mới',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'story',
          name: 'Story',
          color: 'bg-orange-100 text-orange-800',
          description: 'Từ vựng từ câu chuyện',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
      this.categories = defaultCategories;
      this.saveToStorage();
    }

    if (this.topics.length === 0) {
      const defaultTopics: Topic[] = [
        { id: 'general', name: 'Tổng quát', description: 'Chủ đề tổng quát' },
        { id: 'academic', name: 'Học thuật', description: 'Từ vựng học thuật' },
        { id: 'business', name: 'Kinh doanh', description: 'Từ vựng kinh doanh' },
        { id: 'advanced', name: 'Nâng cao', description: 'Từ vựng nâng cao' }
      ];
      this.topics = defaultTopics;
      this.saveToStorage();
    }

    // Initialize with sample data if empty
    if (this.vocabulary.length === 0) {
      const sampleVocabulary: VocabularyItem[] = [
        {
          id: '1',
          word: 'serendipity',
          pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
          meaning: 'may mắn tình cờ, sự tình cờ may mắn',
          examples: [
            { id: '1-1', sentence: 'It was pure serendipity that we met at the coffee shop.', translation: 'Thật là may mắn tình cờ khi chúng ta gặp nhau ở quán cà phê.' }
          ],
          category: 'Harry Potter',
          topic: 'advanced',
          difficulty: 'hard',
          dateAdded: '2024-01-15',
          mastered: false,
          reviewCount: 3,
          lastReviewed: '2024-12-14'
        },
        {
          id: '2',
          word: 'fascinating',
          pronunciation: '/ˈfæs.ɪ.neɪ.tɪŋ/',
          meaning: 'hấp dẫn, lôi cuốn',
          examples: [
            { id: '2-1', sentence: 'The documentary about space was absolutely fascinating.', translation: 'Bộ phim tài liệu về vũ trụ thực sự rất hấp dẫn.' },
            { id: '2-2', sentence: 'I find history fascinating.', translation: 'Tôi thấy lịch sử rất thú vị.' }
          ],
          category: 'Luyện TOEIC',
          topic: 'general',
          difficulty: 'medium',
          dateAdded: '2024-01-14',
          mastered: true,
          reviewCount: 8,
          lastReviewed: '2024-12-13'
        }
      ];
      this.vocabulary = sampleVocabulary;
      this.saveToStorage();
    }
  }

  // ========== Vocabulary CRUD Operations ==========
  addVocabularyItem(item: Omit<VocabularyItem, 'id' | 'dateAdded' | 'reviewCount' | 'mastered'>): VocabularyItem {
    const newItem: VocabularyItem = {
      ...item,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      dateAdded: new Date().toISOString().split('T')[0],
      reviewCount: 0,
      mastered: false
    };
    
    this.vocabulary.unshift(newItem);
    this.saveToStorage();
    return newItem;
  }

  updateVocabularyItem(itemId: string, updates: Partial<VocabularyItem>): VocabularyItem | null {
    const index = this.vocabulary.findIndex(item => item.id === itemId);
    if (index === -1) return null;

    this.vocabulary[index] = { ...this.vocabulary[index], ...updates };
    this.saveToStorage();
    return this.vocabulary[index];
  }

  deleteVocabularyItem(itemId: string): boolean {
    const initialLength = this.vocabulary.length;
    this.vocabulary = this.vocabulary.filter(item => item.id !== itemId);
    const deleted = this.vocabulary.length < initialLength;
    if (deleted) this.saveToStorage();
    return deleted;
  }

  getVocabularyItem(itemId: string): VocabularyItem | null {
    return this.vocabulary.find(item => item.id === itemId) || null;
  }

  // ========== Category Management ==========
  addCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>): Category {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.categories.push(newCategory);
    this.saveToStorage();
    return newCategory;
  }

  updateCategory(categoryId: string, updates: Partial<Category>): Category | null {
    const index = this.categories.findIndex(cat => cat.id === categoryId);
    if (index === -1) return null;

    this.categories[index] = { 
      ...this.categories[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.saveToStorage();
    return this.categories[index];
  }

  deleteCategory(categoryId: string): boolean {
    const initialLength = this.categories.length;
    this.categories = this.categories.filter(cat => cat.id !== categoryId);
    
    // Also remove from vocabulary items
    this.vocabulary = this.vocabulary.map(item => 
      item.category === categoryId ? { ...item, category: 'New' } : item
    );
    
    const deleted = this.categories.length < initialLength;
    if (deleted) this.saveToStorage();
    return deleted;
  }

  getCategories(): Category[] {
    return [...this.categories];
  }

  getCategoriesHierarchy(): Category[] {
    const rootCategories = this.categories.filter(cat => !cat.parentId);
    return rootCategories.map(root => ({
      ...root,
      children: this.categories.filter(cat => cat.parentId === root.id)
    }));
  }

  getCategoryByName(name: string): Category | null {
    return this.categories.find(cat => cat.name === name) || null;
  }

  // ========== Topic Management ==========
  addTopic(topic: Omit<Topic, 'id'>): Topic {
    const newTopic: Topic = {
      ...topic,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    this.topics.push(newTopic);
    this.saveToStorage();
    return newTopic;
  }

  getTopics(): Topic[] {
    return [...this.topics];
  }

  getTopicsByCategory(categoryId: string): Topic[] {
    return this.topics.filter(topic => topic.categoryId === categoryId);
  }

  // ========== Search and Filter ==========
  filterVocabulary(filter: VocabularyFilter = {}): VocabularyItem[] {
    return this.vocabulary.filter(item => {
      // Search term filter
      if (filter.searchTerm) {
        const searchLower = filter.searchTerm.toLowerCase();
        const searchMatch = 
          item.word.toLowerCase().includes(searchLower) ||
          item.meaning.toLowerCase().includes(searchLower) ||
          item.pronunciation.toLowerCase().includes(searchLower) ||
          item.examples.some(ex => 
            ex.sentence.toLowerCase().includes(searchLower) ||
            ex.translation.toLowerCase().includes(searchLower)
          );
        if (!searchMatch) return false;
      }

      // Category filter
      if (filter.categories && filter.categories.length > 0) {
        if (!filter.categories.includes(item.category)) return false;
      }

      // Topic filter
      if (filter.topics && filter.topics.length > 0) {
        if (!filter.topics.includes(item.topic)) return false;
      }

      // Difficulty filter
      if (filter.difficulty && filter.difficulty !== 'all') {
        if (item.difficulty !== filter.difficulty) return false;
      }

      // Mastered filter
      if (filter.mastered && filter.mastered !== 'all') {
        if (filter.mastered === 'mastered' && !item.mastered) return false;
        if (filter.mastered === 'not-mastered' && item.mastered) return false;
      }

      // Date range filter
      if (filter.dateFrom) {
        if (item.dateAdded < filter.dateFrom) return false;
      }
      if (filter.dateTo) {
        if (item.dateAdded > filter.dateTo) return false;
      }

      // Tags filter
      if (filter.tags && filter.tags.length > 0) {
        if (!item.tags || !filter.tags.some(tag => item.tags!.includes(tag))) return false;
      }

      return true;
    });
  }

  sortVocabulary(items: VocabularyItem[], options: VocularySortOptions): VocabularyItem[] {
    return [...items].sort((a, b) => {
      let aValue: any, bValue: any;

      switch (options.field) {
        case 'word':
          aValue = a.word.toLowerCase();
          bValue = b.word.toLowerCase();
          break;
        case 'dateAdded':
          aValue = new Date(a.dateAdded);
          bValue = new Date(b.dateAdded);
          break;
        case 'reviewCount':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        case 'lastReviewed':
          aValue = a.lastReviewed ? new Date(a.lastReviewed) : new Date(0);
          bValue = b.lastReviewed ? new Date(b.lastReviewed) : new Date(0);
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return options.order === 'asc' ? -1 : 1;
      if (aValue > bValue) return options.order === 'asc' ? 1 : -1;
      return 0;
    });
  }

  searchAndSort(filter: VocabularyFilter, sort: VocularySortOptions): VocabularyItem[] {
    const filtered = this.filterVocabulary(filter);
    return this.sortVocabulary(filtered, sort);
  }

  // ========== Bulk Operations ==========
  executeBulkOperation(operation: BulkOperation): boolean {
    try {
      switch (operation.type) {
        case 'delete':
          this.vocabulary = this.vocabulary.filter(item => !operation.itemIds.includes(item.id));
          break;

        case 'move-category':
          this.vocabulary = this.vocabulary.map(item =>
            operation.itemIds.includes(item.id)
              ? { ...item, category: operation.data.category }
              : item
          );
          break;

        case 'change-difficulty':
          this.vocabulary = this.vocabulary.map(item =>
            operation.itemIds.includes(item.id)
              ? { ...item, difficulty: operation.data.difficulty }
              : item
          );
          break;

        case 'mark-mastered':
          this.vocabulary = this.vocabulary.map(item =>
            operation.itemIds.includes(item.id)
              ? { ...item, mastered: operation.data.mastered }
              : item
          );
          break;

        case 'add-tag':
          this.vocabulary = this.vocabulary.map(item => {
            if (operation.itemIds.includes(item.id)) {
              const tags = item.tags || [];
              if (!tags.includes(operation.data.tag)) {
                return { ...item, tags: [...tags, operation.data.tag] };
              }
            }
            return item;
          });
          break;

        default:
          return false;
      }

      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error executing bulk operation:', error);
      return false;
    }
  }

  // ========== Statistics ==========
  getStatistics(): VocabularyStats {
    const total = this.vocabulary.length;
    const mastered = this.vocabulary.filter(item => item.mastered).length;
    const notMastered = total - mastered;

    const byDifficulty = this.vocabulary.reduce((acc, item) => {
      acc[item.difficulty] = (acc[item.difficulty] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byCategory = this.vocabulary.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const recentlyAdded = this.vocabulary.filter(item => 
      new Date(item.dateAdded) >= oneWeekAgo
    ).length;

    const needReview = this.vocabulary.filter(item => 
      !item.mastered && (!item.lastReviewed || 
        new Date(item.lastReviewed) < oneWeekAgo)
    ).length;

    return {
      total,
      mastered,
      notMastered,
      byDifficulty,
      byCategory,
      recentlyAdded,
      needReview
    };
  }

  // ========== Import/Export ==========
  exportData(): VocabularyExport {
    return {
      vocabulary: this.vocabulary,
      categories: this.categories,
      topics: this.topics,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
  }

  importData(data: VocabularyExport): boolean {
    try {
      if (data.vocabulary) this.vocabulary = data.vocabulary;
      if (data.categories) this.categories = data.categories;
      if (data.topics) this.topics = data.topics;
      
      this.saveToStorage();
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // ========== Utility Methods ==========
  getAllVocabulary(): VocabularyItem[] {
    return [...this.vocabulary];
  }

  clearAllData(): void {
    this.vocabulary = [];
    this.categories = [];
    this.topics = [];
    localStorage.removeItem(this.storageKey);
    this.initializeDefaultData();
  }

  addExample(itemId: string, example: Omit<Example, 'id'>): boolean {
    const item = this.getVocabularyItem(itemId);
    if (!item) return false;

    const newExample: Example = {
      ...example,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };

    item.examples.push(newExample);
    this.updateVocabularyItem(itemId, { examples: item.examples });
    return true;
  }

  removeExample(itemId: string, exampleId: string): boolean {
    const item = this.getVocabularyItem(itemId);
    if (!item) return false;

    const updatedExamples = item.examples.filter(ex => ex.id !== exampleId);
    this.updateVocabularyItem(itemId, { examples: updatedExamples });
    return true;
  }

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(cat => cat.name === categoryName);
    return category?.color || 'bg-gray-100 text-gray-800';
  }

  getDifficultyColor(difficulty: string): string {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  private seedSampleData2(): void {
    // Only seed if there's very little data
    if (this.vocabulary.length > 10) return;

    // Add sample categories
    const categories = [
      { name: 'Business', color: 'bg-blue-100 text-blue-800' },
      { name: 'Technology', color: 'bg-green-100 text-green-800' },
      { name: 'Travel', color: 'bg-purple-100 text-purple-800' },
      { name: 'Food', color: 'bg-orange-100 text-orange-800' },
      { name: 'Education', color: 'bg-indigo-100 text-indigo-800' }
    ];

    categories.forEach(cat => {
      if (!this.categories.find(c => c.name === cat.name)) {
        this.addCategory(cat);
      }
    });

    // Sample vocabulary for each category
    const sampleVocab = [
      // Business (20 words)
      { word: 'management', meaning: 'quản lý', pronunciation: '/ˈmænɪdʒmənt/', category: 'Business' },
      { word: 'strategy', meaning: 'chiến lược', pronunciation: '/ˈstrætədʒi/', category: 'Business' },
      { word: 'profit', meaning: 'lợi nhuận', pronunciation: '/ˈprɒfɪt/', category: 'Business' },
      { word: 'revenue', meaning: 'doanh thu', pronunciation: '/ˈrevənjuː/', category: 'Business' },
      { word: 'investment', meaning: 'đầu tư', pronunciation: '/ɪnˈvestmənt/', category: 'Business' },
      { word: 'budget', meaning: 'ngân sách', pronunciation: '/ˈbʌdʒɪt/', category: 'Business' },
      { word: 'marketing', meaning: 'tiếp thị', pronunciation: '/ˈmɑːkɪtɪŋ/', category: 'Business' },
      { word: 'competition', meaning: 'cạnh tranh', pronunciation: '/ˌkɒmpəˈtɪʃən/', category: 'Business' },
      { word: 'customer', meaning: 'khách hàng', pronunciation: '/ˈkʌstəmə/', category: 'Business' },
      { word: 'contract', meaning: 'hợp đồng', pronunciation: '/ˈkɒntrækt/', category: 'Business' },
      { word: 'negotiation', meaning: 'đàm phán', pronunciation: '/nɪˌɡəʊʃiˈeɪʃən/', category: 'Business' },
      { word: 'partnership', meaning: 'đối tác', pronunciation: '/ˈpɑːtnəʃɪp/', category: 'Business' },
      { word: 'deadline', meaning: 'hạn chót', pronunciation: '/ˈdedlaɪn/', category: 'Business' },
      { word: 'target', meaning: 'mục tiêu', pronunciation: '/ˈtɑːɡɪt/', category: 'Business' },
      { word: 'achievement', meaning: 'thành tích', pronunciation: '/əˈtʃiːvmənt/', category: 'Business' },
      { word: 'proposal', meaning: 'đề xuất', pronunciation: '/prəˈpəʊzəl/', category: 'Business' },
      { word: 'analysis', meaning: 'phân tích', pronunciation: '/əˈnæləsɪs/', category: 'Business' },
      { word: 'efficiency', meaning: 'hiệu quả', pronunciation: '/ɪˈfɪʃənsi/', category: 'Business' },
      { word: 'expansion', meaning: 'mở rộng', pronunciation: '/ɪkˈspænʃən/', category: 'Business' },
      { word: 'innovation', meaning: 'đổi mới', pronunciation: '/ˌɪnəˈveɪʃən/', category: 'Business' },

      // Technology (20 words)
      { word: 'algorithm', meaning: 'thuật toán', pronunciation: '/ˈælɡərɪðəm/', category: 'Technology' },
      { word: 'database', meaning: 'cơ sở dữ liệu', pronunciation: '/ˈdeɪtəbeɪs/', category: 'Technology' },
      { word: 'software', meaning: 'phần mềm', pronunciation: '/ˈsɒftweə/', category: 'Technology' },
      { word: 'hardware', meaning: 'phần cứng', pronunciation: '/ˈhɑːdweə/', category: 'Technology' },
      { word: 'programming', meaning: 'lập trình', pronunciation: '/ˈprəʊɡræmɪŋ/', category: 'Technology' },
      { word: 'artificial intelligence', meaning: 'trí tuệ nhân tạo', pronunciation: '/ˌɑːtɪˈfɪʃəl ɪnˈtelɪdʒəns/', category: 'Technology' },
      { word: 'cybersecurity', meaning: 'an ninh mạng', pronunciation: '/ˈsaɪbəsɪˌkjʊərɪti/', category: 'Technology' },
      { word: 'cloud computing', meaning: 'điện toán đám mây', pronunciation: '/klaʊd kəmˈpjuːtɪŋ/', category: 'Technology' },
      { word: 'blockchain', meaning: 'chuỗi khối', pronunciation: '/ˈblɒktʃeɪn/', category: 'Technology' },
      { word: 'machine learning', meaning: 'học máy', pronunciation: '/məˈʃiːn ˈlɜːnɪŋ/', category: 'Technology' },
      { word: 'network', meaning: 'mạng lưới', pronunciation: '/ˈnetwɜːk/', category: 'Technology' },
      { word: 'server', meaning: 'máy chủ', pronunciation: '/ˈsɜːvə/', category: 'Technology' },
      { word: 'interface', meaning: 'giao diện', pronunciation: '/ˈɪntəfeɪs/', category: 'Technology' },
      { word: 'encryption', meaning: 'mã hóa', pronunciation: '/ɪnˈkrɪpʃən/', category: 'Technology' },
      { word: 'bandwidth', meaning: 'băng thông', pronunciation: '/ˈbændwɪdθ/', category: 'Technology' },
      { word: 'protocol', meaning: 'giao thức', pronunciation: '/ˈprəʊtəkɒl/', category: 'Technology' },
      { word: 'debugging', meaning: 'gỡ lỗi', pronunciation: '/diːˈbʌɡɪŋ/', category: 'Technology' },
      { word: 'optimization', meaning: 'tối ưu hóa', pronunciation: '/ˌɒptɪmaɪˈzeɪʃən/', category: 'Technology' },
      { word: 'automation', meaning: 'tự động hóa', pronunciation: '/ˌɔːtəˈmeɪʃən/', category: 'Technology' },
      { word: 'integration', meaning: 'tích hợp', pronunciation: '/ˌɪntɪˈɡreɪʃən/', category: 'Technology' },

      // Travel (20 words)
      { word: 'destination', meaning: 'điểm đến', pronunciation: '/ˌdestɪˈneɪʃən/', category: 'Travel' },
      { word: 'itinerary', meaning: 'lịch trình', pronunciation: '/aɪˈtɪnərəri/', category: 'Travel' },
      { word: 'accommodation', meaning: 'chỗ ở', pronunciation: '/əˌkɒməˈdeɪʃən/', category: 'Travel' },
      { word: 'reservation', meaning: 'đặt chỗ', pronunciation: '/ˌrezəˈveɪʃən/', category: 'Travel' },
      { word: 'passport', meaning: 'hộ chiếu', pronunciation: '/ˈpɑːspɔːt/', category: 'Travel' },
      { word: 'visa', meaning: 'thị thực', pronunciation: '/ˈviːzə/', category: 'Travel' },
      { word: 'luggage', meaning: 'hành lý', pronunciation: '/ˈlʌɡɪdʒ/', category: 'Travel' },
      { word: 'boarding pass', meaning: 'thẻ lên máy bay', pronunciation: '/ˈbɔːdɪŋ pɑːs/', category: 'Travel' },
      { word: 'customs', meaning: 'hải quan', pronunciation: '/ˈkʌstəmz/', category: 'Travel' },
      { word: 'immigration', meaning: 'nhập cư', pronunciation: '/ˌɪmɪˈɡreɪʃən/', category: 'Travel' },
      { word: 'departure', meaning: 'khởi hành', pronunciation: '/dɪˈpɑːtʃə/', category: 'Travel' },
      { word: 'arrival', meaning: 'đến nơi', pronunciation: '/əˈraɪvəl/', category: 'Travel' },
      { word: 'terminal', meaning: 'nhà ga', pronunciation: '/ˈtɜːmɪnəl/', category: 'Travel' },
      { word: 'gate', meaning: 'cổng', pronunciation: '/ɡeɪt/', category: 'Travel' },
      { word: 'delay', meaning: 'chậm trễ', pronunciation: '/dɪˈleɪ/', category: 'Travel' },
      { word: 'cancellation', meaning: 'hủy bỏ', pronunciation: '/ˌkænsəˈleɪʃən/', category: 'Travel' },
      { word: 'tourist', meaning: 'du khách', pronunciation: '/ˈtʊərɪst/', category: 'Travel' },
      { word: 'sightseeing', meaning: 'tham quan', pronunciation: '/ˈsaɪtsiːɪŋ/', category: 'Travel' },
      { word: 'souvenir', meaning: 'quà lưu niệm', pronunciation: '/ˌsuːvəˈnɪə/', category: 'Travel' },
      { word: 'adventure', meaning: 'phiêu lưu', pronunciation: '/ədˈventʃə/', category: 'Travel' },

      // Food (20 words)
      { word: 'cuisine', meaning: 'ẩm thực', pronunciation: '/kwɪˈziːn/', category: 'Food' },
      { word: 'ingredient', meaning: 'nguyên liệu', pronunciation: '/ɪnˈɡriːdiənt/', category: 'Food' },
      { word: 'recipe', meaning: 'công thức', pronunciation: '/ˈresɪpi/', category: 'Food' },
      { word: 'flavor', meaning: 'hương vị', pronunciation: '/ˈfleɪvə/', category: 'Food' },
      { word: 'delicious', meaning: 'ngon', pronunciation: '/dɪˈlɪʃəs/', category: 'Food' },
      { word: 'nutritious', meaning: 'bổ dưỡng', pronunciation: '/njuːˈtrɪʃəs/', category: 'Food' },
      { word: 'appetite', meaning: 'sự thèm ăn', pronunciation: '/ˈæpɪtaɪt/', category: 'Food' },
      { word: 'vegetarian', meaning: 'ăn chay', pronunciation: '/ˌvedʒəˈteəriən/', category: 'Food' },
      { word: 'spicy', meaning: 'cay', pronunciation: '/ˈspaɪsi/', category: 'Food' },
      { word: 'sweet', meaning: 'ngọt', pronunciation: '/swiːt/', category: 'Food' },
      { word: 'sour', meaning: 'chua', pronunciation: '/ˈsaʊə/', category: 'Food' },
      { word: 'bitter', meaning: 'đắng', pronunciation: '/ˈbɪtə/', category: 'Food' },
      { word: 'salty', meaning: 'mặn', pronunciation: '/ˈsɔːlti/', category: 'Food' },
      { word: 'organic', meaning: 'hữu cơ', pronunciation: '/ɔːˈɡænɪk/', category: 'Food' },
      { word: 'fresh', meaning: 'tươi', pronunciation: '/freʃ/', category: 'Food' },
      { word: 'seasoning', meaning: 'gia vị', pronunciation: '/ˈsiːzənɪŋ/', category: 'Food' },
      { word: 'portion', meaning: 'phần ăn', pronunciation: '/ˈpɔːʃən/', category: 'Food' },
      { word: 'beverage', meaning: 'đồ uống', pronunciation: '/ˈbevərɪdʒ/', category: 'Food' },
      { word: 'dessert', meaning: 'món tráng miệng', pronunciation: '/dɪˈzɜːt/', category: 'Food' },
      { word: 'appetite', meaning: 'khẩu vị', pronunciation: '/ˈæpɪtaɪt/', category: 'Food' },

      // Education (20 words)
      { word: 'curriculum', meaning: 'chương trình học', pronunciation: '/kəˈrɪkjələm/', category: 'Education' },
      { word: 'scholarship', meaning: 'học bổng', pronunciation: '/ˈskɒləʃɪp/', category: 'Education' },
      { word: 'assignment', meaning: 'bài tập', pronunciation: '/əˈsaɪnmənt/', category: 'Education' },
      { word: 'examination', meaning: 'kỳ thi', pronunciation: '/ɪɡˌzæmɪˈneɪʃən/', category: 'Education' },
      { word: 'graduation', meaning: 'tốt nghiệp', pronunciation: '/ˌɡrædjuˈeɪʃən/', category: 'Education' },
      { word: 'degree', meaning: 'bằng cấp', pronunciation: '/dɪˈɡriː/', category: 'Education' },
      { word: 'research', meaning: 'nghiên cứu', pronunciation: '/rɪˈsɜːtʃ/', category: 'Education' },
      { word: 'knowledge', meaning: 'kiến thức', pronunciation: '/ˈnɒlɪdʒ/', category: 'Education' },
      { word: 'tutorial', meaning: 'hướng dẫn', pronunciation: '/tjuːˈtɔːriəl/', category: 'Education' },
      { word: 'lecture', meaning: 'bài giảng', pronunciation: '/ˈlektʃə/', category: 'Education' },
      { word: 'seminar', meaning: 'hội thảo', pronunciation: '/ˈsemɪnɑː/', category: 'Education' },
      { word: 'workshop', meaning: 'hội thảo thực hành', pronunciation: '/ˈwɜːkʃɒp/', category: 'Education' },
      { word: 'library', meaning: 'thư viện', pronunciation: '/ˈlaɪbrəri/', category: 'Education' },
      { word: 'laboratory', meaning: 'phòng thí nghiệm', pronunciation: '/ləˈbɒrətəri/', category: 'Education' },
      { word: 'textbook', meaning: 'sách giáo khoa', pronunciation: '/ˈtekstbʊk/', category: 'Education' },
      { word: 'enrollment', meaning: 'nhập học', pronunciation: '/ɪnˈrəʊlmənt/', category: 'Education' },
      { word: 'certificate', meaning: 'chứng chỉ', pronunciation: '/səˈtɪfɪkət/', category: 'Education' },
      { word: 'assessment', meaning: 'đánh giá', pronunciation: '/əˈsesmənt/', category: 'Education' },
      { word: 'academic', meaning: 'học thuật', pronunciation: '/ˌækəˈdemɪk/', category: 'Education' },
      { word: 'achievement', meaning: 'thành tích', pronunciation: '/əˈtʃiːvmənt/', category: 'Education' }
    ];

    sampleVocab.forEach(vocab => {
      if (!this.vocabulary.find(v => v.word === vocab.word)) {
        this.addVocabularyItem({
          ...vocab,
          examples: [],
          topic: 'general',
          difficulty: 'medium',
          mastered: Math.random() > 0.7 // 30% chance of being mastered
        });
      }
    });
  }
}

// Export singleton instance
export const vocabularyLibrary = new VocabularyLibrary();