import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, X, Filter, Search, Eye, EyeOff, Edit, Trash2, MoreVertical, ChevronDown, ChevronUp } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CategoryTopicSelector } from './CategoryTopicSelector';

interface VocabularyScreenProps {
  onBack: () => void;
}

interface Example {
  id: string;
  sentence: string;
  translation: string;
}

interface VocabularyItem {
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
}

export function VocabularyScreen({ onBack }: VocabularyScreenProps) {
  const [newWord, setNewWord] = useState({
    word: '',
    pronunciation: '',
    meaning: '',
    examples: [] as Example[],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'medium' as const
  });

  // States for add word dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [suggestedWords, setSuggestedWords] = useState<string[]>([
    'enchanting', 'mystical', 'wondrous', 'magical', 'spellbinding'
  ]);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [filterCategoryList, setFilterCategoryList] = useState<string[]>([]);
  const [filterTopicList, setFilterTopicList] = useState<string[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMastered, setFilterMastered] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');

  // Collapsible states
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(['word', 'pronunciation', 'meaning', 'examples']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Bulk selection
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showMoveCategoryDialog, setShowMoveCategoryDialog] = useState(false);

  // Category management
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([
    'Harry Potter',
    'Luyện TOEIC',
    'Daily',
    'New',
    'Story'
  ]);

  // Example management
  const [currentExample, setCurrentExample] = useState({ sentence: '', translation: '' });

  // Edit mode
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([
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
    },
    {
      id: '3',
      word: 'ambiguous',
      pronunciation: '/æmˈbɪɡ.ju.əs/',
      meaning: 'mơ hồ, không rõ ràng',
      examples: [
        { id: '3-1', sentence: 'His answer was ambiguous and difficult to understand.', translation: 'Câu trả lời của anh ấy mơ hồ và khó hiểu.' }
      ],
      category: 'Daily',
      topic: 'academic',
      difficulty: 'hard',
      dateAdded: '2024-01-13',
      mastered: false,
      reviewCount: 2,
      lastReviewed: '2024-12-15'
    },
    {
      id: '4',
      word: 'magnificent',
      pronunciation: '/mæɡˈnɪf.ɪ.sənt/',
      meaning: 'tráng lệ, hoành tráng',
      examples: [
        { id: '4-1', sentence: 'The view from the mountain was magnificent.', translation: 'Khung cảnh từ núi thật tráng lệ.' }
      ],
      category: 'Harry Potter',
      topic: 'general',
      difficulty: 'medium',
      dateAdded: '2024-01-12',
      mastered: true,
      reviewCount: 12,
      lastReviewed: '2024-12-12'
    },
    {
      id: '5',
      word: 'accomplish',
      pronunciation: '/əˈkʌm.plɪʃ/',
      meaning: 'hoàn thành, đạt được',
      examples: [
        { id: '5-1', sentence: 'She managed to accomplish all her goals this year.', translation: 'Cô ấy đã hoàn thành tất cả mục tiêu trong năm này.' }
      ],
      category: 'Luyện TOEIC',
      topic: 'business',
      difficulty: 'medium',
      dateAdded: '2024-01-11',
      mastered: false,
      reviewCount: 5,
      lastReviewed: '2024-12-11'
    },
    {
      id: '6',
      word: 'perseverance',
      pronunciation: '/ˌpɜː.sɪˈvɪə.rəns/',
      meaning: 'sự kiên trì, bền bỉ',
      examples: [
        { id: '6-1', sentence: 'Success requires talent and perseverance.', translation: 'Thành công đòi hỏi tài năng và sự kiên trì.' }
      ],
      category: 'Daily',
      topic: 'general',
      difficulty: 'hard',
      dateAdded: '2024-01-10',
      mastered: true,
      reviewCount: 7,
      lastReviewed: '2024-12-10'
    },
    {
      id: '7',
      word: 'delightful',
      pronunciation: '/dɪˈlaɪt.fəl/',
      meaning: 'thú vị, dễ thương',
      examples: [
        { id: '7-1', sentence: 'The garden party was absolutely delightful.', translation: 'Bữa tiệc trong vườn thật sự rất thú vị.' }
      ],
      category: 'Story',
      topic: 'general',
      difficulty: 'easy',
      dateAdded: '2024-01-09',
      mastered: true,
      reviewCount: 10,
      lastReviewed: '2024-12-09'
    },
    {
      id: '8',
      word: 'entrepreneur',
      pronunciation: '/ˌɒn.trə.prəˈnɜːr/',
      meaning: 'doanh nhân, người khởi nghiệp',
      examples: [
        { id: '8-1', sentence: 'Every successful entrepreneur faces challenges.', translation: 'Mọi doanh nhân thành công đều phải đối mặt với thử thách.' }
      ],
      category: 'Luyện TOEIC',
      topic: 'business',
      difficulty: 'hard',
      dateAdded: '2024-01-08',
      mastered: false,
      reviewCount: 3,
      lastReviewed: '2024-12-08'
    },
    {
      id: '9',
      word: 'extraordinary',
      pronunciation: '/ɪkˈstrɔː.dɪn.ər.i/',
      meaning: 'phi thường, đặc biệt',
      examples: [
        { id: '9-1', sentence: 'She has an extraordinary talent for music.', translation: 'Cô ấy có tài năng phi thường về âm nhạc.' }
      ],
      category: 'Harry Potter',
      topic: 'advanced',
      difficulty: 'medium',
      dateAdded: '2024-01-07',
      mastered: false,
      reviewCount: 4,
      lastReviewed: '2024-12-07'
    },
    {
      id: '10',
      word: 'collaborate',
      pronunciation: '/kəˈlæb.ə.reɪt/',
      meaning: 'hợp tác, cộng tác',
      examples: [
        { id: '10-1', sentence: 'We need to collaborate to finish this project.', translation: 'Chúng ta cần hợp tác để hoàn thành dự án này.' }
      ],
      category: 'Luyện TOEIC',
      topic: 'business',
      difficulty: 'medium',
      dateAdded: '2024-01-06',
      mastered: true,
      reviewCount: 9,
      lastReviewed: '2024-12-06'
    }
  ]);

  const handleAddWord = () => {
    if (newWord.word && newWord.meaning) {
      const newItem: VocabularyItem = {
        id: Date.now().toString(),
        ...newWord,
        dateAdded: new Date().toISOString().split('T')[0],
        mastered: false,
        reviewCount: 0
      };
      setVocabularyList([newItem, ...vocabularyList]);
      setNewWord({
        word: '',
        pronunciation: '',
        meaning: '',
        examples: [],
        category: 'Harry Potter',
        topic: 'general',
        difficulty: 'medium'
      });
      setCurrentExample({ sentence: '', translation: '' });
    }
  };

  const addExample = () => {
    if (currentExample.sentence.trim()) {
      const newExample: Example = {
        id: Date.now().toString(),
        sentence: currentExample.sentence,
        translation: currentExample.translation
      };
      setNewWord({
        ...newWord,
        examples: [...newWord.examples, newExample]
      });
      setCurrentExample({ sentence: '', translation: '' });
    }
  };

  const removeExample = (exampleId: string) => {
    setNewWord({
      ...newWord,
      examples: newWord.examples.filter(ex => ex.id !== exampleId)
    });
  };

  const addCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName)) {
      setCategories([...categories, newCategoryName]);
      setNewCategoryName('');
      setShowCategoryDialog(false);
    }
  };

  const processBulkAdd = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newWords: VocabularyItem[] = [];
    
    lines.forEach(line => {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 2) {
        const word = parts[0];
        const meaning = parts[1];
        const pronunciation = parts[2] || '';
        
        newWords.push({
          id: (Date.now() + Math.random()).toString(),
          word,
          pronunciation,
          meaning,
          examples: [],
          category: newWord.category,
          topic: newWord.topic,
          difficulty: newWord.difficulty,
          dateAdded: new Date().toISOString().split('T')[0],
          mastered: false,
          reviewCount: 0
        });
      }
    });
    
    setVocabularyList([...newWords, ...vocabularyList]);
    setBulkText('');
    setShowBulkDialog(false);
  };

  const handleDeleteWord = (id: string) => {
    setVocabularyList(vocabularyList.filter(item => item.id !== id));
  };

  const handleBulkDelete = () => {
    setVocabularyList(vocabularyList.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);
  };

  const handleBulkMoveCategory = (newCategory: string) => {
    setVocabularyList(prev =>
      prev.map(item =>
        selectedItems.includes(item.id)
          ? { ...item, category: newCategory }
          : item
      )
    );
    setSelectedItems([]);
    setSelectAll(false);
    setShowMoveCategoryDialog(false);
  };

  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(prev => prev.filter(col => col !== column));
    } else {
      setVisibleColumns(prev => [...prev, column]);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(getFilteredAndSortedList().map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const getFilteredAndSortedList = () => {
    let filtered = vocabularyList.filter(item => {
      const searchMatch = searchTerm === '' || 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = filterCategoryList.length === 0 || filterCategoryList.includes(item.category);
      const topicMatch = filterTopicList.length === 0 || filterTopicList.includes(item.topic);
      const difficultyMatch = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
      const masteredMatch = filterMastered === 'all' || 
        (filterMastered === 'mastered' && item.mastered) ||
        (filterMastered === 'not-mastered' && !item.mastered);
      
      return searchMatch && categoryMatch && topicMatch && difficultyMatch && masteredMatch;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
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
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Harry Potter': return 'bg-red-100 text-red-800';
      case 'Luyện TOEIC': return 'bg-green-100 text-green-800';
      case 'Daily': return 'bg-blue-100 text-blue-800';
      case 'New': return 'bg-purple-100 text-purple-800';
      case 'Story': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📝</span>
            </div>
            <div>
              <h1 className="text-xl">Từ vựng</h1>
              <p className="text-blue-100 text-sm">
                {vocabularyList.length} từ • {vocabularyList.filter(v => v.mastered).length} đã thuộc
              </p>
            </div>
          </div>
          
          {/* Search Icon */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(!showSearch)}
              className="text-white hover:bg-white/20"
            >
              <Search className="h-5 w-5" />
            </Button>
            {showSearch && (
              <div className="absolute top-12 right-0 w-64 z-10">
                <Input
                  placeholder="Tìm kiếm từ vựng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onBlur={() => {
                    if (!searchTerm) setShowSearch(false);
                  }}
                  autoFocus
                  className="bg-white text-black"
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Add Word Button */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-lg font-medium">Danh sách từ vựng</h2>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Thêm từ vựng
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <span>➕</span>
                    <span>Thêm từ vựng</span>
                  </span>
                  <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm nhiều
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Thêm nhiều từ vựng</DialogTitle>
                        <DialogDescription>
                          Nhập nhiều từ vựng cùng lúc, mỗi dòng một từ theo định dạng: từ | nghĩa | phiên âm
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm mb-2">Nhập từ vựng (mỗi dòng: từ | nghĩa | phiên âm)</label>
                          <Textarea
                            placeholder={`serendipity | may mắn tình cờ | /ˌser.ənˈdɪp.ə.ti/\nfascinating | hấp dẫn\nambiguous | mơ hồ`}
                            value={bulkText}
                            onChange={(e) => setBulkText(e.target.value)}
                            rows={8}
                            className="font-mono text-sm"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm mb-2">Gợi ý từ vựng</label>
                          <div className="flex flex-wrap gap-2">
                            {suggestedWords.map((word) => (
                              <Button
                                key={word}
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const newLine = bulkText ? '\n' : '';
                                  setBulkText(prev => prev + newLine + word + ' | ');
                                }}
                              >
                                {word}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                          <Select value={newWord.category} onValueChange={(value) => setNewWord({...newWord, category: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Danh mục" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>{category}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Select value={newWord.topic} onValueChange={(value) => setNewWord({...newWord, topic: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Chủ đề" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="general">Tổng quát</SelectItem>
                              <SelectItem value="academic">Học thuật</SelectItem>
                              <SelectItem value="business">Kinh doanh</SelectItem>
                              <SelectItem value="advanced">Nâng cao</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select value={newWord.difficulty} onValueChange={(value) => setNewWord({...newWord, difficulty: value as any})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Độ khó" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Dễ</SelectItem>
                              <SelectItem value="medium">Trung bình</SelectItem>
                              <SelectItem value="hard">Khó</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
                            Hủy
                          </Button>
                          <Button onClick={processBulkAdd} disabled={!bulkText.trim()}>
                            Thêm {bulkText.split('\n').filter(line => line.trim()).length} từ
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </DialogTitle>
                <DialogDescription>
                  Nhập thông tin từ vựng mới bao gồm từ, phiên âm, nghĩa và ví dụ
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Từ vựng *</label>
                    <Input
                      placeholder="Nhập từ vựng..."
                      value={newWord.word}
                      onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Phiên âm</label>
                    <Input
                      placeholder="/phiên âm/"
                      value={newWord.pronunciation}
                      onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Dịch nghĩa *</label>
                  <Textarea
                    placeholder="Nhập nghĩa của từ..."
                    value={newWord.meaning}
                    onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
                    rows={2}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ví dụ</label>
                  <div className="space-y-3">
                    {newWord.examples.map((example, index) => (
                      <div key={example.id} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-sm font-medium">Ví dụ {index + 1}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExample(example.id)}
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm italic mb-1">"{example.sentence}"</p>
                        {example.translation && (
                          <p className="text-sm text-muted-foreground">→ {example.translation}</p>
                        )}
                      </div>
                    ))}
                    
                    <div className="space-y-2">
                      <Input
                        placeholder="Nhập câu ví dụ..."
                        value={currentExample.sentence}
                        onChange={(e) => setCurrentExample({...currentExample, sentence: e.target.value})}
                      />
                      <Input
                        placeholder="Nhập bản dịch (tùy chọn)..."
                        value={currentExample.translation}
                        onChange={(e) => setCurrentExample({...currentExample, translation: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addExample}
                        disabled={!currentExample.sentence.trim()}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Thêm ví dụ
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Danh mục</label>
                  <div className="flex space-x-2">
                    <Select value={newWord.category} onValueChange={(value) => setNewWord({...newWord, category: value})}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>{category}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                      <DialogTrigger asChild>
                        <Button type="button" variant="outline" size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>Quản lý danh mục</DialogTitle>
                          <DialogDescription>
                            Thêm danh mục mới hoặc xóa danh mục hiện có
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm mb-2">Thêm danh mục mới</label>
                            <Input
                              placeholder="Tên danh mục..."
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm mb-2">Danh mục hiện có</label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {categories.map((category, index) => (
                                <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <span className="text-sm">{category}</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newCategories = categories.filter((_, i) => i !== index);
                                      setCategories(newCategories);
                                    }}
                                    className="h-6 w-6 p-0 text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="flex justify-end space-x-2">
                            <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                              Đóng
                            </Button>
                            <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
                              Thêm
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm mb-2">Chủ đề</label>
                    <Select value={newWord.topic} onValueChange={(value) => setNewWord({...newWord, topic: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn chủ đề" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">Tổng quát</SelectItem>
                        <SelectItem value="academic">Học thuật</SelectItem>
                        <SelectItem value="business">Kinh doanh</SelectItem>
                        <SelectItem value="advanced">Nâng cao</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm mb-2">Độ khó</label>
                    <Select value={newWord.difficulty} onValueChange={(value) => setNewWord({...newWord, difficulty: value as any})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn độ khó" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Dễ</SelectItem>
                        <SelectItem value="medium">Trung bình</SelectItem>
                        <SelectItem value="hard">Khó</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                    Hủy
                  </Button>
                  <Button 
                    onClick={() => {
                      handleAddWord();
                      setShowAddDialog(false);
                    }} 
                    disabled={!newWord.word || !newWord.meaning}
                  >
                    Thêm từ vựng
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters - Collapsible */}
        <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
          <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Bộ lọc</span>
            </div>
            {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm mb-2">Danh mục</label>
                <CategoryTopicSelector
                  type="category"
                  selectedItems={filterCategoryList}
                  onSelectionChange={setFilterCategoryList}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Chủ đề</label>
                <CategoryTopicSelector
                  type="topic"
                  selectedItems={filterTopicList}
                  onSelectionChange={setFilterTopicList}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block text-sm mb-2">Độ khó</label>
                <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả độ khó</SelectItem>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="block text-sm mb-2">Trạng thái</label>
                <Select value={filterMastered} onValueChange={setFilterMastered}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="mastered">Đã thuộc</SelectItem>
                    <SelectItem value="not-mastered">Chưa thuộc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2">Sắp xếp theo</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dateAdded">Ngày thêm</SelectItem>
                    <SelectItem value="word">Từ vựng</SelectItem>
                    <SelectItem value="reviewCount">Số lần ôn</SelectItem>
                    <SelectItem value="difficulty">Độ khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-2">Thứ tự</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Tăng dần</SelectItem>
                    <SelectItem value="desc">Giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm mb-2">Hiển thị cột</label>
                <Popover open={showColumnSelector} onOpenChange={setShowColumnSelector}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      <span>{visibleColumns.length} cột</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Hiển thị cột</div>
                      {[
                        { key: 'word', label: 'Từ vựng' },
                        { key: 'pronunciation', label: 'Phiên âm' },
                        { key: 'meaning', label: 'Nghĩa' },
                        { key: 'examples', label: 'Ví dụ' },
                        { key: 'category', label: 'Danh mục' },
                        { key: 'difficulty', label: 'Độ khó' },
                        { key: 'mastered', label: 'Trạng thái' }
                      ].map((column) => (
                        <div key={column.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={column.key}
                            checked={visibleColumns.includes(column.key)}
                            onCheckedChange={() => toggleColumnVisibility(column.key)}
                          />
                          <label htmlFor={column.key} className="text-sm">
                            {column.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>


        {/* Vocabulary List - Full Height */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={toggleSelectAll}
                />
                <span className="text-sm">Chọn tất cả</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Đã chọn {selectedItems.length}/{getFilteredAndSortedList().length} từ
              </span>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex space-x-2">
                <Dialog open={showMoveCategoryDialog} onOpenChange={setShowMoveCategoryDialog}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Chuyển danh mục
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Chuyển danh mục</DialogTitle>
                      <DialogDescription>
                        Chọn danh mục mới cho {selectedItems.length} từ vựng đã chọn
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Select onValueChange={handleBulkMoveCategory}>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn danh mục mới" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleBulkDelete}
                >
                  Xóa
                </Button>
              </div>
            )}
          </div>

          {/* Vocabulary Cards */}
          <div className="space-y-3">
            {getFilteredAndSortedList().map((item) => (
              <Card key={item.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-1">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => toggleItemSelection(item.id)}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {visibleColumns.includes('word') && (
                            <h3 
                              className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => speakWord(item.word)}
                            >
                              {item.word}
                            </h3>
                          )}
                          {visibleColumns.includes('pronunciation') && item.pronunciation && (
                            <span className="text-sm text-muted-foreground">{item.pronunciation}</span>
                          )}
                          {item.mastered && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              ✓ Đã thuộc
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {visibleColumns.includes('category') && (
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          )}
                          {visibleColumns.includes('difficulty') && (
                            <Badge className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty === 'easy' ? 'Dễ' : item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingItem(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteWord(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {visibleColumns.includes('meaning') && (
                        <p className="text-sm text-muted-foreground mb-2">{item.meaning}</p>
                      )}

                      {visibleColumns.includes('examples') && item.examples.length > 0 && (
                        <div className="space-y-1">
                          {item.examples.map((example, index) => (
                            <div key={example.id} className="text-sm">
                              <p className="italic">"{example.sentence}"</p>
                              {example.translation && (
                                <p className="text-muted-foreground">→ {example.translation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <span>Đã ôn: {item.reviewCount} lần</span>
                        <span>Thêm: {item.dateAdded}</span>
                        {item.lastReviewed && (
                          <span>Ôn cuối: {item.lastReviewed}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFilteredAndSortedList().length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Không tìm thấy từ vựng nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}