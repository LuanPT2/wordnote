import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Settings, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Eye, EyeOff, ChevronDown, ChevronUp, Trash2, BookOpen, Search } from 'lucide-react';
import { CategoryManagerModal } from './CategoryManagerModal';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CategoryTopicSelector } from './CategoryTopicSelector';
import { DictionarySearchPopup } from './DictionarySearchPopup';
import { CategorySelector } from './common/CategorySelector';

interface ListeningScreenProps {
  onBack: () => void;
}

interface VocabularyItem {
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

interface ListeningConfig {
  categories: string[];
  topics: string[];
  difficulties: string[];
  masteryStatus: string[];
  mode: string[];
  pauseBetweenWords: number; // seconds between words
  pauseBetweenParts: number; // seconds between word and meaning/example
}

interface SavedWordList {
  id: string;
  name: string;
  wordIds: string[];
  createdAt: Date;
}

export function ListeningScreen({ onBack }: ListeningScreenProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState<ListeningConfig>({
    categories: [],
    topics: [],
    difficulties: ['easy', 'medium', 'hard'],
    masteryStatus: ['not-mastered'],
    mode: ['word'],
    pauseBetweenWords: 3,
    pauseBetweenParts: 1
  });
  
  // Expandable states
  const [modeExpanded, setModeExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [wordListExpanded, setWordListExpanded] = useState(false);

  // Word selection states
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);

  // Listening session states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<VocabularyItem[]>([]);
  const [showText, setShowText] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBackgroundMode, setIsBackgroundMode] = useState(false);

  // Dialog states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [listName, setListName] = useState('');

  // Saved lists
  const [savedLists, setSavedLists] = useState<SavedWordList[]>([]);

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);
  // Category manager modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Mock vocabulary data
  const vocabularyList: VocabularyItem[] = [
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
      mastered: false
    },
    {
      id: '2',
      word: 'fascinating',
      pronunciation: '/ˈfæs.ɪ.neɪ.tɪŋ/',
      meaning: 'hấp dẫn, lôi cuốn',
      examples: [
        { id: '2-1', sentence: 'The documentary about space was absolutely fascinating.', translation: 'Bộ phim tài liệu về vũ trụ thực sự rất hấp dẫn.' }
      ],
      category: 'Luyện TOEIC',
      topic: 'general',
      difficulty: 'medium',
      mastered: true
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
      mastered: false
    }
  ];

  const categories = ['Harry Potter', 'Luyện TOEIC', 'Daily', 'New'];
  const topics = ['general', 'academic', 'business', 'advanced'];

  // Mock background images
  useEffect(() => {
    const images = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ];
    setBackgroundImages(images);
  }, []);

  const getFilteredWords = () => {
    return vocabularyList.filter(word => {
      const categoryMatch = config.categories.length === 0 || config.categories.includes(word.category);
      const topicMatch = config.topics.length === 0 || config.topics.includes(word.topic);
      const difficultyMatch = config.difficulties.includes(word.difficulty);
      const masteryMatch = config.masteryStatus.includes('all') ||
        (config.masteryStatus.includes('mastered') && word.mastered) ||
        (config.masteryStatus.includes('not-mastered') && !word.mastered);
      
      return categoryMatch && topicMatch && difficultyMatch && masteryMatch;
    });
  };

  const getSelectedWords = () => {
    return vocabularyList.filter(word => selectedWordIds.includes(word.id));
  };

  // Initialize selected words when component mounts
  useEffect(() => {
    const allWordIds = vocabularyList.map(word => word.id);
    setSelectedWordIds(allWordIds);
  }, []);

  const toggleWordSelection = (wordId: string) => {
    setSelectedWordIds(prev => 
      prev.includes(wordId) 
        ? prev.filter(id => id !== wordId)
        : [...prev, wordId]
    );
  };

  const toggleSelectAllFiltered = () => {
    const filteredWords = getFilteredWords();
    const filteredWordIds = filteredWords.map(word => word.id);
    const allFilteredSelected = filteredWordIds.every(id => selectedWordIds.includes(id));
    
    if (allFilteredSelected) {
      // Deselect all filtered words
      setSelectedWordIds(prev => prev.filter(id => !filteredWordIds.includes(id)));
    } else {
      // Select all filtered words
      setSelectedWordIds(prev => [...new Set([...prev, ...filteredWordIds])]);
    }
  };

  const areAllFilteredSelected = () => {
    const filteredWordIds = getFilteredWords().map(word => word.id);
    return filteredWordIds.length > 0 && filteredWordIds.every(id => selectedWordIds.includes(id));
  };

  const startListening = (wordList: VocabularyItem[] = []) => {
    const wordsToPlay = wordList.length > 0 ? wordList : getSelectedWords();
    setSelectedWords(wordsToPlay);
    setCurrentIndex(0);
    setProgress(0);
    setActiveTab('listening');
    setIsPlaying(true);
    
    // Start the listening session
    playCurrentWord(wordsToPlay, 0);
  };

  const handleStartListeningWithSave = () => {
    const selectedWordsCount = getSelectedWords().length;
    if (selectedWordsCount === 0) return;
    
    setListName(`Danh sách ${selectedWordsCount} từ`);
    setShowSaveDialog(true);
  };

  const saveAndStartListening = () => {
    if (listName.trim()) {
      const newList: SavedWordList = {
        id: Date.now().toString(),
        name: listName.trim(),
        wordIds: selectedWordIds,
        createdAt: new Date()
      };
      setSavedLists(prev => [newList, ...prev]);
    }
    
    setShowSaveDialog(false);
    setListName('');
    startListening();
  };

  const startListeningFromSaved = (savedList: SavedWordList) => {
    const words = vocabularyList.filter(word => savedList.wordIds.includes(word.id));
    startListening(words);
  };

  const deleteSavedList = (listId: string) => {
    setSavedLists(prev => prev.filter(list => list.id !== listId));
  };

  const playCurrentWord = (wordList: VocabularyItem[], index: number) => {
    if (index >= wordList.length) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const word = wordList[index];
    setCurrentIndex(index);
    setProgress((index / wordList.length) * 100);

    // Change background image
    setCurrentImageIndex(Math.floor(Math.random() * backgroundImages.length));

    // Build texts to speak based on selected modes
    let textsToSpeak: string[] = [];
    
    if (config.mode.includes('word')) {
      textsToSpeak.push(word.word);
    }
    if (config.mode.includes('pronunciation') && word.pronunciation) {
      textsToSpeak.push(word.pronunciation);
    }
    if (config.mode.includes('meaning')) {
      textsToSpeak.push(word.meaning);
    }
    if (config.mode.includes('examples') && word.examples.length > 0) {
      textsToSpeak.push(word.examples[0].sentence);
    }
    if (config.mode.includes('example-translation') && word.examples.length > 0 && word.examples[0].translation) {
      textsToSpeak.push(word.examples[0].translation);
    }

    // Play texts with pauses
    let textIndex = 0;
    
    const playNextText = () => {
      if (textIndex < textsToSpeak.length) {
        speakText(textsToSpeak[textIndex], () => {
          textIndex++;
          if (textIndex < textsToSpeak.length) {
            setTimeout(playNextText, config.pauseBetweenParts * 1000);
          } else {
            // Move to next word after pause
            setTimeout(() => {
              if (isPlaying) {
                playCurrentWord(wordList, index + 1);
              }
            }, config.pauseBetweenWords * 1000);
          }
        });
      }
    };

    playNextText();
  };

  const speakText = (text: string, onComplete?: () => void) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = text === text.toLowerCase() && /^[a-zA-Z\s.,!?]+$/.test(text) ? 'en-US' : 'vi-VN';
      utterance.rate = 0.8;
      
      if (onComplete) {
        utterance.onend = onComplete;
      }
      
      speechSynthesis.speak(utterance);
    } else if (onComplete) {
      // Fallback if speech synthesis not available
      setTimeout(onComplete, 2000);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && selectedWords.length > 0) {
      playCurrentWord(selectedWords, currentIndex);
    } else {
      speechSynthesis.cancel();
    }
  };

  const nextWord = () => {
    speechSynthesis.cancel();
    if (currentIndex < selectedWords.length - 1) {
      playCurrentWord(selectedWords, currentIndex + 1);
    }
  };

  const previousWord = () => {
    speechSynthesis.cancel();
    if (currentIndex > 0) {
      playCurrentWord(selectedWords, currentIndex - 1);
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
      mastered: false
    };
    
    // Add to vocabulary list (in a real app, this would be saved to backend)
    console.log('Word saved from dictionary:', newVocabularyItem);
    setShowDictionaryPopup(false);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Harry Potter': return 'bg-red-100 text-red-800';
      case 'Luyện TOEIC': return 'bg-green-100 text-green-800';
      case 'Daily': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ←
          </Button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🎧</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Luyện nghe từ vựng</h1>
            <p className="text-purple-100 text-sm mt-1 flex items-center space-x-2">
              {activeTab === 'listening' && selectedWords.length > 0 ? (
                <>
                  <span>🎵 {currentIndex + 1}/{selectedWords.length}</span>
                  <span>•</span>
                  <span>📊 {Math.round(progress)}%</span>
                </>
              ) : (
                <span>📚 {getSelectedWords().length} từ sẵn sàng</span>
              )}
            </p>
          </div>


          {/* Header Actions */}
          <div className="flex items-center space-x-2">
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

      <div className="p-6 bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white/50 backdrop-blur-sm border shadow-sm">
            <TabsTrigger value="config" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <Settings className="h-4 w-4" />
              <span>Cấu hình</span>
            </TabsTrigger>
            <TabsTrigger value="listening" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span>🎧</span>
              <span>Luyện nghe</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            {/* Listening Mode - Collapsible */}
            <Collapsible open={modeExpanded} onOpenChange={setModeExpanded}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <Settings className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-lg">Chế độ nghe</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">
                          {config.mode.length} đã chọn
                        </span>
                        {modeExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div>
                      <label className="block text-sm mb-3">Nội dung nghe (có thể chọn nhiều)</label>
                      <div className="space-y-2">
                        {[
                          { value: 'word', label: 'Từ vựng' },
                          { value: 'pronunciation', label: 'Phiên âm' },
                          { value: 'meaning', label: 'Nghĩa' },
                          { value: 'examples', label: 'Ví dụ' },
                          { value: 'example-translation', label: 'Dịch ví dụ' }
                        ].map((option) => (
                          <label key={option.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={config.mode.includes(option.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    mode: [...prev.mode, option.value]
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    mode: prev.mode.filter(m => m !== option.value)
                                  }));
                                }
                              }}
                            />
                            <span className="text-sm">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Thời gian giữa từ và nghĩa/ví dụ</label>
                        <Select value={config.pauseBetweenParts.toString()} onValueChange={(value) => setConfig(prev => ({...prev, pauseBetweenParts: parseInt(value)}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">Không dừng</SelectItem>
                            <SelectItem value="1">1 giây</SelectItem>
                            <SelectItem value="2">2 giây</SelectItem>
                            <SelectItem value="3">3 giây</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">Thời gian giữa các từ</label>
                        <Select value={config.pauseBetweenWords.toString()} onValueChange={(value) => setConfig(prev => ({...prev, pauseBetweenWords: parseInt(value)}))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 giây</SelectItem>
                            <SelectItem value="2">2 giây</SelectItem>
                            <SelectItem value="3">3 giây</SelectItem>
                            <SelectItem value="5">5 giây</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Filters - Collapsible */}
            <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <span className="text-purple-600 text-lg">🔍</span>
                        </div>
                        <span className="text-lg">Bộ lọc từ vựng</span>
                      </div>
                      <div className="p-1 hover:bg-muted rounded-md transition-colors">
                        {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Danh mục ({config.categories.length} đã chọn)</label>
                        <CategorySelector
                          selectedCategories={config.categories}
                          onSelectionChange={(items) => setConfig(prev => ({...prev, categories: items}))}
                          className="w-full"
                          title="Chọn danh mục cho bài nghe"
                          description="Chọn các danh mục từ vựng cho bài luyện nghe của bạn"
                          icon={<span className="text-lg">🎧</span>}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-2">Chủ đề ({config.topics.length} đã chọn)</label>
                        <CategoryTopicSelector
                          type="topic"
                          selectedItems={config.topics}
                          onSelectionChange={(items) => setConfig(prev => ({...prev, topics: items}))}
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Độ khó</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['easy', 'medium', 'hard'].map((difficulty) => (
                          <label key={difficulty} className="flex items-center space-x-2">
                            <Checkbox
                              checked={config.difficulties.includes(difficulty)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    difficulties: [...prev.difficulties, difficulty]
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    difficulties: prev.difficulties.filter(d => d !== difficulty)
                                  }));
                                }
                              }}
                            />
                            <span className="text-sm">
                              {difficulty === 'easy' ? 'Dễ' : difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Trạng thái học</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: 'mastered', label: 'Đã thuộc' },
                          { value: 'not-mastered', label: 'Chưa thuộc' }
                        ].map((status) => (
                          <label key={status.value} className="flex items-center space-x-2">
                            <Checkbox
                              checked={config.masteryStatus.includes(status.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setConfig(prev => ({
                                    ...prev,
                                    masteryStatus: [...prev.masteryStatus, status.value]
                                  }));
                                } else {
                                  setConfig(prev => ({
                                    ...prev,
                                    masteryStatus: prev.masteryStatus.filter(s => s !== status.value)
                                  }));
                                }
                              }}
                            />
                            <span className="text-sm">{status.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Word Selection - Collapsible */}
            <Collapsible open={wordListExpanded} onOpenChange={setWordListExpanded}>
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={areAllFilteredSelected()}
                        onCheckedChange={toggleSelectAllFiltered}
                        disabled={getFilteredWords().length === 0}
                      />
                      <span className="text-base font-medium">Danh sách từ cần nghe</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {getSelectedWords().length} từ đã chọn
                    </span>
                  </div>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-center py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {wordListExpanded ? (
                        <>
                          <span>Thu gọn danh sách</span>
                          <ChevronUp className="h-4 w-4 ml-2" />
                        </>
                      ) : (
                        <>
                          <span>Mở rộng danh sách</span>
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </div>
                  </CollapsibleTrigger>
                </CardHeader>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">

                    {/* Simple Word List */}
                    <div className="space-y-2 max-h-80 overflow-y-auto">
                      {getFilteredWords().map((word) => (
                        <div key={word.id} className="flex items-center space-x-3 p-2 border rounded hover:bg-gray-50">
                          <Checkbox
                            checked={selectedWordIds.includes(word.id)}
                            onCheckedChange={() => toggleWordSelection(word.id)}
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium">{word.word}</span>
                              <Badge className={getCategoryColor(word.category)} variant="secondary">
                                {word.category}
                              </Badge>
                              <Badge className={getDifficultyColor(word.difficulty)} variant="secondary">
                                {word.difficulty === 'easy' ? 'Dễ' : word.difficulty === 'medium' ? 'TB' : 'Khó'}
                              </Badge>
                              {word.mastered && (
                                <Badge variant="default" className="bg-green-100 text-green-800">
                                  ✓
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {getFilteredWords().length === 0 && (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>Không có từ vựng phù hợp với bộ lọc.</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Quick Start Options */}
            <div className="pt-6">
              <Card className="border-0 shadow-xl bg-gradient-to-r from-purple-500 to-violet-500 text-white overflow-hidden">
                <CardContent className="p-0">
                  <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
                    <DialogTrigger asChild>
                      <Button 
                        onClick={handleStartListeningWithSave}
                        disabled={getSelectedWords().length === 0}
                        className="w-full h-16 bg-transparent hover:bg-white/10 text-white text-lg font-semibold rounded-none shadow-none border-0 disabled:opacity-50 disabled:bg-transparent"
                        size="lg"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-white/20 rounded-lg">
                            <span className="text-2xl">🎧</span>
                          </div>
                          <div className="text-left">
                            <div>Bắt đầu luyện nghe</div>
                            <div className="text-sm opacity-90">
                              {getSelectedWords().length > 0 ? `${getSelectedWords().length} từ đã chọn` : 'Chọn từ vựng để bắt đầu'}
                            </div>
                          </div>
                        </div>
                      </Button>
                    </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Đặt tên danh sách từ vựng</DialogTitle>
                      <DialogDescription>
                        Đặt tên cho danh sách {getSelectedWords().length} từ vựng đã chọn để dễ dàng nghe lại sau này.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <Input
                        placeholder="Nhập tên danh sách..."
                        value={listName}
                        onChange={(e) => setListName(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            saveAndStartListening();
                          }
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                        Hủy
                      </Button>
                      <Button onClick={saveAndStartListening} disabled={!listName.trim()}>
                        Tiếp tục
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                </CardContent>
              </Card>
            </div>

            {/* Saved Lists */}
            {savedLists.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Danh sách đã lưu</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {savedLists.map((savedList) => {
                    const wordCount = savedList.wordIds.length;
                    const validWordsCount = savedList.wordIds.filter(id => 
                      vocabularyList.some(word => word.id === id)
                    ).length;
                    
                    return (
                      <Card key={savedList.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{savedList.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {validWordsCount} từ • {new Date(savedList.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => startListeningFromSaved(savedList)}
                                disabled={validWordsCount === 0}
                              >
                                Nghe
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => deleteSavedList(savedList.id)}
                                className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="listening" className="space-y-6 mt-6">
            {selectedWords.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="mb-2">Chưa chọn từ để nghe</h3>
                  <p className="text-muted-foreground mb-4">
                    Hãy quay lại cấu hình để chọn từ
                  </p>
                  <Button onClick={() => setActiveTab('config')}>
                    Cấu hình nghe
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Background Image */}
                <div 
                  className="relative h-48 rounded-lg overflow-hidden"
                  style={{
                    backgroundImage: backgroundImages.length > 0 
                      ? `url(${backgroundImages[currentImageIndex]})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute inset-0 flex items-center justify-center text-white text-center">
                    <div className="space-y-2">
                      <div className="text-4xl mb-4">🎵</div>
                      <h2 className="text-2xl font-bold">Đang nghe...</h2>
                      <p className="text-sm opacity-90">
                        Thư giãn và tập trung vào từ vựng
                      </p>
                    </div>
                  </div>
                </div>

                {/* Progress - Compact */}
                <div className="bg-white/80 backdrop-blur p-2 rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span>{currentIndex + 1}/{selectedWords.length}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-1" />
                </div>

                {/* Current Word Display */}
                {selectedWords[currentIndex] && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <div className="space-y-6">
                        {showText && (
                          <div>
                            <h2 className="text-4xl font-bold mb-2">{selectedWords[currentIndex].word}</h2>
                            {selectedWords[currentIndex].pronunciation && (
                              <p className="text-lg text-muted-foreground">
                                {selectedWords[currentIndex].pronunciation}
                              </p>
                            )}
                          </div>
                        )}

                        {showTranslation && (
                          <p className="text-2xl text-blue-600">
                            {selectedWords[currentIndex].meaning}
                          </p>
                        )}

                        {showExamples && selectedWords[currentIndex].examples.length > 0 && (
                          <div className="space-y-3 max-w-2xl mx-auto">
                            {selectedWords[currentIndex].examples.map((example) => (
                              <div key={example.id} className="p-4 bg-gray-50 rounded-lg">
                                <p className="italic mb-2">"{example.sentence}"</p>
                                {example.translation && (
                                  <p className="text-sm text-muted-foreground">
                                    → {example.translation}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center justify-center space-x-2">
                          <Badge className={getCategoryColor(selectedWords[currentIndex].category)}>
                            {selectedWords[currentIndex].category}
                          </Badge>
                          <Badge className={getDifficultyColor(selectedWords[currentIndex].difficulty)}>
                            {selectedWords[currentIndex].difficulty === 'easy' ? 'Dễ' : 
                             selectedWords[currentIndex].difficulty === 'medium' ? 'TB' : 'Khó'}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Audio Controls */}
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center space-x-4 mb-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={previousWord}
                        disabled={currentIndex === 0}
                      >
                        <SkipBack className="h-5 w-5" />
                      </Button>
                      
                      <Button
                        size="lg"
                        onClick={togglePlayPause}
                        className="rounded-full w-16 h-16"
                      >
                        {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={nextWord}
                        disabled={currentIndex === selectedWords.length - 1}
                      >
                        <SkipForward className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Display Options */}
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowText(!showText)}
                      >
                        {showText ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showText ? 'Ẩn' : 'Hiện'} Từ
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTranslation(!showTranslation)}
                      >
                        {showTranslation ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showTranslation ? 'Ẩn' : 'Hiện'} Nghĩa
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowExamples(!showExamples)}
                      >
                        {showExamples ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
                        {showExamples ? 'Ẩn' : 'Hiện'} Ví dụ
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dictionary Search Popup */}
      <DictionarySearchPopup
        isOpen={showDictionaryPopup}
        onClose={() => setShowDictionaryPopup(false)}
        onSaveWord={handleSaveWordFromDictionary}
        categories={['Harry Potter', 'Luyện TOEIC', 'Daily', 'New', 'Story']}
      />
      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}