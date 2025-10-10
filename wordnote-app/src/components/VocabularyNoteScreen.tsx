import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Plus, X, Filter, SortAsc, BookOpen, Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { DictionarySearchPopup } from './DictionarySearchPopup';
import { CategoryManagerModal } from './CategoryManagerModal';

interface VocabularyNoteScreenProps {
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
  category: string; // Danh mục mới
  topic: string; // Chủ đề (cũ danh mục)
  difficulty: 'easy' | 'medium' | 'hard';
  dateAdded: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export function VocabularyNoteScreen({ onBack }: VocabularyNoteScreenProps) {
  const [activeTab, setActiveTab] = useState('add');
  const [newWord, setNewWord] = useState({
    word: '',
    pronunciation: '',
    meaning: '',
    examples: [] as Example[],
    category: 'all', // Danh mục mới
    topic: 'general', // Chủ đề (cũ danh mục)
    difficulty: 'medium' as const
  });

  // Filter states
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTopic, setFilterTopic] = useState('all');
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMastered, setFilterMastered] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');

  // Category management
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState([
    'Tất cả',
    'Harry Potter',
    'Luyện TOEIC',
    'Daily Conversation'
  ]);

  // Example management
  const [currentExample, setCurrentExample] = useState({ sentence: '', translation: '' });

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);
  // Category manager modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);

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
      category: 'Daily Conversation',
      topic: 'academic',
      difficulty: 'hard',
      dateAdded: '2024-01-13',
      mastered: false,
      reviewCount: 2,
      lastReviewed: '2024-12-15'
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
        category: 'all',
        topic: 'general',
        difficulty: 'medium'
      });
      setCurrentExample({ sentence: '', translation: '' });
      setActiveTab('list');
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

  const handleDeleteWord = (id: string) => {
    setVocabularyList(vocabularyList.filter(item => item.id !== id));
  };

  const toggleMastery = (id: string) => {
    setVocabularyList(prev => 
      prev.map(item => 
        item.id === id 
          ? { 
              ...item, 
              mastered: !item.mastered,
              reviewCount: item.reviewCount + 1,
              lastReviewed: new Date().toISOString().split('T')[0]
            }
          : item
      )
    );
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

  const getTopicColor = (topic: string) => {
    switch (topic) {
      case 'general': return 'bg-blue-100 text-blue-800';
      case 'academic': return 'bg-purple-100 text-purple-800';
      case 'business': return 'bg-orange-100 text-orange-800';
      case 'advanced': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Harry Potter': return 'bg-red-100 text-red-800';
      case 'Luyện TOEIC': return 'bg-green-100 text-green-800';
      case 'Daily Conversation': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Handle saving word from dictionary popup
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

  // Filter and sort logic
  const getFilteredAndSortedList = () => {
    let filtered = vocabularyList.filter(item => {
      const categoryMatch = filterCategory === 'all' || item.category === filterCategory;
      const topicMatch = filterTopic === 'all' || item.topic === filterTopic;
      const difficultyMatch = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
      const masteredMatch = filterMastered === 'all' || 
        (filterMastered === 'mastered' && item.mastered) ||
        (filterMastered === 'not-mastered' && !item.mastered);
      
      return categoryMatch && topicMatch && difficultyMatch && masteredMatch;
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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
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
            <h1 className="text-xl">Ghi chú từ vựng</h1>
            <p className="text-blue-100 text-sm">
              {vocabularyList.length} từ • {vocabularyList.filter(v => v.mastered).length} đã thuộc
            </p>
          </div>

               
          {/* Header Actions */}
          <div className="ml-auto flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDictionaryPopup(true)}
              className="text-white hover:bg-white/20"
              title="Tra từ điển"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
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
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="add">Thêm từ mới</TabsTrigger>
            <TabsTrigger value="list">Danh sách từ</TabsTrigger>
          </TabsList>

          <TabsContent value="add" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <span>➕</span>
                  <span>Thêm từ vựng mới</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div>
                  <label className="block text-sm mb-2">Nghĩa *</label>
                  <Textarea
                    placeholder="Nhập nghĩa của từ..."
                    value={newWord.meaning}
                    onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-2">Ví dụ</label>
                  <div className="space-y-3">
                    {/* Current examples */}
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
                    
                    {/* Add new example */}
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

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-2">Danh mục</label>
                    <div className="flex space-x-2">
                      <Select value={newWord.category} onValueChange={(value) => setNewWord({...newWord, category: value})}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Chọn danh mục" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tất cả</SelectItem>
                          {categories.filter(cat => cat !== 'Tất cả').map((category) => (
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
                            <DialogTitle>Thêm danh mục mới</DialogTitle>
                            <DialogDescription>
                              Tạo danh mục mới để phân loại từ vựng của bạn
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <Input
                              placeholder="Tên danh mục..."
                              value={newCategoryName}
                              onChange={(e) => setNewCategoryName(e.target.value)}
                            />
                            <div className="flex justify-end space-x-2">
                              <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                                Hủy
                              </Button>
                              <Button onClick={addCategory}>
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
                </div>

                <Button 
                  onClick={handleAddWord}
                  className="w-full"
                  disabled={!newWord.word || !newWord.meaning}
                >
                  <span className="mr-2">✅</span>
                  Thêm từ vựng
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="list" className="space-y-4 mt-6">
            {/* Filters and Sort */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="flex items-center space-x-2">
                    <Filter className="h-4 w-4" />
                    <span>Bộ lọc & Sắp xếp</span>
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setFilterCategory('all');
                      setFilterTopic('all');
                      setFilterDifficulty('all');
                      setFilterMastered('all');
                      setSortBy('dateAdded');
                      setSortOrder('desc');
                    }}
                  >
                    Đặt lại
                  </Button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả danh mục</SelectItem>
                      {categories.filter(cat => cat !== 'Tất cả').map((category) => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filterTopic} onValueChange={setFilterTopic}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chủ đề" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả chủ đề</SelectItem>
                      <SelectItem value="general">Tổng quát</SelectItem>
                      <SelectItem value="academic">Học thuật</SelectItem>
                      <SelectItem value="business">Kinh doanh</SelectItem>
                      <SelectItem value="advanced">Nâng cao</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
                    <SelectTrigger>
                      <SelectValue placeholder="Độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả độ khó</SelectItem>
                      <SelectItem value="easy">Dễ</SelectItem>
                      <SelectItem value="medium">Trung bình</SelectItem>
                      <SelectItem value="hard">Khó</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={filterMastered} onValueChange={setFilterMastered}>
                    <SelectTrigger>
                      <SelectValue placeholder="Trạng thái" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả</SelectItem>
                      <SelectItem value="mastered">Đã thuộc</SelectItem>
                      <SelectItem value="not-mastered">Chưa thuộc</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-3">
                  <SortAsc className="h-4 w-4" />
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sắp xếp theo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dateAdded">Ngày thêm</SelectItem>
                      <SelectItem value="word">Từ vựng</SelectItem>
                      <SelectItem value="reviewCount">Số lần ôn</SelectItem>
                      <SelectItem value="difficulty">Độ khó</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asc">Tăng dần</SelectItem>
                      <SelectItem value="desc">Giảm dần</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {getFilteredAndSortedList().length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="mb-2">Chưa có từ vựng nào</h3>
                  <p className="text-muted-foreground mb-4">
                    Hãy thêm từ vựng đầu tiên của bạn
                  </p>
                  <Button onClick={() => setActiveTab('add')}>
                    Thêm từ mới
                  </Button>
                </CardContent>
              </Card>
            ) : (
              getFilteredAndSortedList().map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg">{item.word}</h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => speakWord(item.word)}
                            className="p-1 h-8 w-8"
                          >
                            🔊
                          </Button>
                          <Badge 
                            variant={item.mastered ? "default" : "secondary"}
                            className={item.mastered ? "bg-green-600" : "bg-orange-600"}
                          >
                            {item.mastered ? "✅ Đã thuộc" : "🔄 Chưa thuộc"}
                          </Badge>
                          <Badge className={getDifficultyColor(item.difficulty)}>
                            {item.difficulty === 'easy' ? 'Dễ' : 
                             item.difficulty === 'medium' ? 'TB' : 'Khó'}
                          </Badge>
                          <Badge className={getCategoryColor(item.category)}>
                            {item.category}
                          </Badge>
                          <Badge className={getTopicColor(item.topic)}>
                            {item.topic === 'general' ? 'Tổng quát' :
                             item.topic === 'academic' ? 'Học thuật' :
                             item.topic === 'business' ? 'Kinh doanh' : 'Nâng cao'}
                          </Badge>
                        </div>
                        {item.pronunciation && (
                          <p className="text-sm text-muted-foreground mb-2">
                            {item.pronunciation}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMastery(item.id)}
                          className={item.mastered ? "text-orange-600 hover:bg-orange-50" : "text-green-600 hover:bg-green-50"}
                        >
                          {item.mastered ? "🔄" : "✅"}
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDeleteWord(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          🗑️
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="font-medium text-sm">Nghĩa: </span>
                        <span className="text-sm">{item.meaning}</span>
                      </div>
                      {item.examples.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Ví dụ:</span>
                          <div className="space-y-2 mt-1">
                            {item.examples.map((example, index) => (
                              <div key={example.id} className="pl-3 border-l-2 border-gray-200">
                                <p className="text-sm italic">"{example.sentence}"</p>
                                {example.translation && (
                                  <p className="text-xs text-muted-foreground mt-1">→ {example.translation}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="text-xs text-muted-foreground pt-2 border-t flex justify-between">
                        <span>Thêm: {new Date(item.dateAdded).toLocaleDateString('vi-VN')}</span>
                        <span>
                          Ôn {item.reviewCount} lần
                          {item.lastReviewed && ` • Lần cuối: ${new Date(item.lastReviewed).toLocaleDateString('vi-VN')}`}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>


        </Tabs>
      </div>

      {/* Dictionary Search Popup */}
      <DictionarySearchPopup
        isOpen={showDictionaryPopup}
        onClose={() => setShowDictionaryPopup(false)}
        onSaveWord={handleSaveWordFromDictionary}
        categories={categories.filter(cat => cat !== 'Tất cả')}
      />
      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}