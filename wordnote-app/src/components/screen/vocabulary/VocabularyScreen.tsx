
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { BookOpen, Folder, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { AddWordDialog } from './AddWordModal';
import { BulkAddDialog } from './BulkAddDialog';
import { VocabularyFiltersPanel } from './VocabularyFiltersPanel';
import { EditWordDialog } from './EditWordDialog';

interface VocabularyScreenProps {
  onBack: () => void;
}

interface Example {
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
}

export function VocabularyScreen({ onBack }: VocabularyScreenProps) {
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
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

  // Category management
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categories, setCategories] = useState([
    'Harry Potter',
    'Luyện TOEIC',
    'Daily',
    'New',
    'Story'
  ]);

  // Edit mode
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);

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

  const handleDeleteWord = (id: string) => {
    setVocabularyList(vocabularyList.filter(item => item.id !== id));
  };

  const handleEditWord = (updatedItem: VocabularyItem) => {
    setVocabularyList(vocabularyList.map(item => item.id === updatedItem.id ? updatedItem : item));
    setEditingItem(null);
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

  const handleSaveWordFromDictionary = (word: string, meaning: string, pronunciation: string, category: string) => {
    const newVocabularyItem: VocabularyItem = {
      id: Date.now().toString(),
      word,
      pronunciation,
      meaning,
      examples: [],
      category,
      topic: 'general',
      difficulty: 'medium',
      dateAdded: new Date().toISOString().split('T')[0],
      mastered: false,
      reviewCount: 0
    };
    
    setVocabularyList(prev => [newVocabularyItem, ...prev]);
    setShowDictionaryPopup(false);
  };

  const handleAddCategory = (newCategory: string) => {
    setCategories(prev => [...prev, newCategory]);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6 shrink-0">
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
          
          {/* Search and Dictionary Icons */}
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDictionaryPopup(true)}
                  className="text-white hover:bg-white/20"
                  title="Tra từ điển"
                >
                  <BookOpen className="h-5 w-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Dictionary Search</DialogTitle>
                </DialogHeader>
                <DictionarySearchModal
                  isOpen={showDictionaryPopup}
                  onClose={() => setShowDictionaryPopup(false)}
                  onSaveWord={handleSaveWordFromDictionary}
                  categories={categories}
                />
              </DialogContent>
            </Dialog>
            
            {/* Category Manager */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCategoryManager(true)}
                  className="text-white hover:bg-white/20"
                  title="Quản lý danh mục"
                >
                  <img
                    src="https://unpkg.com/heroicons@2.1.1/24/outline/folder.svg"
                    alt="Categories"
                    className="h-5 w-5 invert"
                  />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Category Manager</DialogTitle>
                </DialogHeader>
                <CategoryManagerModal
                  isOpen={showCategoryManager}
                  onClose={() => setShowCategoryManager(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Add Word Button */}
        <div className="mb-6 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-medium">Danh sách từ vựng</h2>
          <div className="flex space-x-2">
            <AddWordDialog
              categories={categories}
              onAddWord={(newWord) => setVocabularyList([newWord, ...vocabularyList])}
              onAddCategory={handleAddCategory}
            />
            <BulkAddDialog
              categories={categories}
              setVocabularyList={setVocabularyList}
              setCategories={setCategories}
            />
          </div>
        </div>

        {/* Filters - Collapsible */}
        <div className="mb-6 shrink-0">
          <VocabularyFiltersPanel
            filterCategoryList={filterCategoryList}
            filterTopicList={filterTopicList}
            filterDifficulty={filterDifficulty}
            filterMastered={filterMastered}
            sortBy={sortBy}
            sortOrder={sortOrder}
            visibleColumns={visibleColumns}
            showColumnSelector={showColumnSelector}
            filtersExpanded={filtersExpanded}
            setFilterCategoryList={setFilterCategoryList}
            setFilterTopicList={setFilterTopicList}
            setFilterDifficulty={setFilterDifficulty}
            setFilterMastered={setFilterMastered}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            setVisibleColumns={setVisibleColumns}
            setShowColumnSelector={setShowColumnSelector}
            setFiltersExpanded={setFiltersExpanded}
          />
        </div>

        {/* Vocabulary List - Scrollable */}
        <div 
          className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {/* Vocabulary Cards */}
          <div className="space-y-3">
            {getFilteredAndSortedList().map((item) => (
              <Card key={item.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
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

      {/* Edit Word Dialog */}
      <EditWordDialog
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEditWord}
        categories={categories}
      />
    </div>
  );
}
