import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Progress } from './ui/progress';
import { ChevronLeft, ChevronRight, Play, Pause, Settings, Eye, EyeOff, ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';
import { Slider } from './ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CategoryTopicSelector } from './CategoryTopicSelector';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { DictionarySearchPopup } from './DictionarySearchPopup';

interface PracticeScreenProps {
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
  reviewCount: number;
}

interface PracticeConfig {
  speed: 'slow' | 'normal' | 'fast';
  categories: string[];
  topics: string[];
  difficulties: string[];
  masteryStatus: string[];
  testMode: boolean;
  showMeaning: boolean;
  showPronunciation: boolean;
  showExamples: boolean;
}

export function PracticeScreen({ onBack }: PracticeScreenProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState<PracticeConfig>({
    speed: 'normal',
    categories: [],
    topics: [],
    difficulties: ['easy', 'medium', 'hard'],
    masteryStatus: ['not-mastered'],
    testMode: false,
    showMeaning: true,
    showPronunciation: true,
    showExamples: true
  });
  
  // States for collapsible sections
  const [settingsExpanded, setSettingsExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [wordListExpanded, setWordListExpanded] = useState(false);
  
  // States for practice screen controls
  const [hideEnglish, setHideEnglish] = useState(false);
  const [hideMeaning, setHideMeaning] = useState(false);
  
  // Reading speed (0.1 to 2.0)
  const [readingSpeed, setReadingSpeed] = useState([0.8]);

  // Practice session states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<VocabularyItem[]>([]);
  const [userInput, setUserInput] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [practiceResults, setPracticeResults] = useState<{correct: number, total: number}>({correct: 0, total: 0});

  // MyNote states
  const [myNotes, setMyNotes] = useState<VocabularyItem[]>([]);
  const [currentNoteIndex, setCurrentNoteIndex] = useState(0);

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);

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
      mastered: false,
      reviewCount: 3
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
      mastered: true,
      reviewCount: 8
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
      mastered: false,
      reviewCount: 2
    }
  ];

  const categories = ['Harry Potter', 'Luyện TOEIC', 'Daily', 'New'];
  const topics = ['general', 'academic', 'business', 'advanced'];

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

  // Initialize selected words when component mounts
  useEffect(() => {
    const filtered = getFilteredWords();
    setSelectedWords(filtered);
  }, []);

  const startPractice = () => {
    const filtered = getFilteredWords();
    setSelectedWords(filtered);
    setCurrentIndex(0);
    setIsPlaying(true);
    setPracticeResults({correct: 0, total: 0});
    setActiveTab('practice');
  };

  const handleWordSelection = (wordId: string) => {
    const word = vocabularyList.find(w => w.id === wordId);
    if (word) {
      const isSelected = selectedWords.some(w => w.id === wordId);
      if (isSelected) {
        setSelectedWords(prev => prev.filter(w => w.id !== wordId));
      } else {
        setSelectedWords(prev => [...prev, word]);
      }
    }
  };

  const nextWord = () => {
    if (currentIndex < selectedWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserInput('');
      setShowAnswer(false);
    }
  };

  const previousWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setUserInput('');
      setShowAnswer(false);
    }
  };

  const checkAnswer = () => {
    const currentWord = selectedWords[currentIndex];
    if (currentWord && userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim()) {
      setPracticeResults(prev => ({
        correct: prev.correct + 1,
        total: prev.total + 1
      }));
    } else {
      setPracticeResults(prev => ({
        total: prev.total + 1,
        correct: prev.correct
      }));
    }
    setShowAnswer(true);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = readingSpeed[0];
      speechSynthesis.speak(utterance);
    }
  };

  const addToMyNotes = (word: VocabularyItem) => {
    if (!myNotes.some(note => note.id === word.id)) {
      setMyNotes(prev => [...prev, word]);
    }
  };

  const removeFromMyNotes = (wordId: string) => {
    setMyNotes(prev => prev.filter(note => note.id !== wordId));
    if (currentNoteIndex >= myNotes.length - 1 && myNotes.length > 1) {
      setCurrentNoteIndex(prev => prev - 1);
    }
  };

  const nextNote = () => {
    if (currentNoteIndex < myNotes.length - 1) {
      setCurrentNoteIndex(prev => prev + 1);
    } else {
      setCurrentNoteIndex(0); // Loop back to first
    }
  };

  const previousNote = () => {
    if (currentNoteIndex > 0) {
      setCurrentNoteIndex(prev => prev - 1);
    } else {
      setCurrentNoteIndex(myNotes.length - 1); // Loop to last
    }
  };

  // Handle swipe gestures for MyNote
  useEffect(() => {
    let startX: number;
    
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;

      if (Math.abs(diffX) > 50) { // Minimum swipe distance
        if (diffX > 0) {
          nextNote(); // Swipe left - next
        } else {
          previousNote(); // Swipe right - previous
        }
      }
    };

    if (activeTab === 'mynote') {
      document.addEventListener('touchstart', handleTouchStart);
      document.addEventListener('touchend', handleTouchEnd);
    }

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeTab, currentNoteIndex, myNotes.length]);

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
      mastered: false,
      reviewCount: 0
    };
    
    // Add to vocabulary list (in a real app, this would be saved to backend)
    console.log('Word saved from dictionary:', newVocabularyItem);
    setShowDictionaryPopup(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-green-600 text-white p-6">
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
              <span className="text-xl">🎯</span>
            </div>
            <div>
              <h1 className="text-xl">Luyện tập</h1>
              <p className="text-green-100 text-sm">
                {activeTab === 'practice' && selectedWords.length > 0 
                  ? `${currentIndex + 1}/${selectedWords.length} • ${Math.round((practiceResults.correct / Math.max(practiceResults.total, 1)) * 100)}% đúng`
                  : activeTab === 'mynote'
                  ? `${myNotes.length} ghi chú`
                  : `${getFilteredWords().length} từ phù hợp`
                }
              </p>
            </div>
          </div>
          
          {/* Dictionary Search Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDictionaryPopup(true)}
            className="text-white hover:bg-white/20"
            title="Tra từ điển"
          >
            <BookOpen className="h-5 w-5" />
          </Button>
        </div>
      </div>



      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Cấu hình</TabsTrigger>
            <TabsTrigger value="practice">Luyện tập</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            {/* Settings - Collapsible */}
            <Collapsible open={settingsExpanded} onOpenChange={setSettingsExpanded}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Cài đặt luyện tập</span>
                      </div>
                      {settingsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div>
                      <label className="block text-sm mb-3">Tốc độ đọc: {readingSpeed[0].toFixed(1)}x</label>
                      <Slider
                        value={readingSpeed}
                        onValueChange={setReadingSpeed}
                        min={0.1}
                        max={2.0}
                        step={0.1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-1">
                        <span>0.1x</span>
                        <span>1.0x</span>
                        <span>2.0x</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Chế độ kiểm tra</label>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={config.testMode}
                          onCheckedChange={(checked) => 
                            setConfig(prev => ({...prev, testMode: !!checked}))
                          }
                        />
                        <span className="text-sm">Bật input để nhập lại từ</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm mb-2">Hiển thị</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={config.showMeaning}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({...prev, showMeaning: !!checked}))
                            }
                          />
                          <span className="text-sm">Hiển thị nghĩa</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={config.showPronunciation}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({...prev, showPronunciation: !!checked}))
                            }
                          />
                          <span className="text-sm">Hiển thị phiên âm</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <Checkbox
                            checked={config.showExamples}
                            onCheckedChange={(checked) => 
                              setConfig(prev => ({...prev, showExamples: !!checked}))
                            }
                          />
                          <span className="text-sm">Hiển thị ví dụ</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Filter Settings - Collapsible */}
            <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between text-left">
                      <span>Bộ lọc từ vựng</span>
                      {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-2">Danh mục ({config.categories.length} đã chọn)</label>
                        <CategoryTopicSelector
                          type="category"
                          selectedItems={config.categories}
                          onSelectionChange={(items) => setConfig(prev => ({...prev, categories: items}))}
                          className="w-full"
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
                        checked={selectedWords.length === getFilteredWords().length && getFilteredWords().length > 0}
                        onCheckedChange={(checked) => {
                          const filtered = getFilteredWords();
                          if (checked) {
                            setSelectedWords(filtered);
                          } else {
                            setSelectedWords([]);
                          }
                        }}
                      />
                      <span className="text-base font-medium">Chọn từ để luyện ({getFilteredWords().length} từ)</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Đã chọn: {selectedWords.length} từ
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
                    {/* Word List - Full Height */}
                    <div className="space-y-3">
                      {getFilteredWords().map((word) => (
                        <Card key={word.id} className="hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={selectedWords.some(w => w.id === word.id)}
                                  onCheckedChange={() => handleWordSelection(word.id)}
                                />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <h4 className="font-medium">{word.word}</h4>
                                    <Badge className={getCategoryColor(word.category)}>
                                      {word.category}
                                    </Badge>
                                    <Badge className={getDifficultyColor(word.difficulty)}>
                                      {word.difficulty === 'easy' ? 'Dễ' : 
                                       word.difficulty === 'medium' ? 'TB' : 'Khó'}
                                    </Badge>
                                    {word.mastered && (
                                      <Badge variant="default" className="bg-green-100 text-green-800">
                                        ✓ Đã thuộc
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-muted-foreground">{word.meaning}</p>
                                  {word.pronunciation && (
                                    <p className="text-xs text-muted-foreground mt-1">{word.pronunciation}</p>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => speakWord(word.word)}
                                  className="h-8 w-8 p-0"
                                >
                                  🔊
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => addToMyNotes(word)}
                                  className="h-8 w-8 p-0"
                                  title="Thêm vào MyNote"
                                >
                                  📝
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      
                      {getFilteredWords().length === 0 && (
                        <Card>
                          <CardContent className="text-center p-8">
                            <div className="text-4xl mb-4">🔍</div>
                            <h3 className="mb-2">Không tìm thấy từ vựng</h3>
                            <p className="text-muted-foreground">
                              Hãy thử điều chỉnh bộ lọc để xem thêm từ vựng.
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>


                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Start Practice Button - Outside of collapsed sections */}
            <div className="pt-4">
              <Button
                onClick={startPractice}
                disabled={selectedWords.length === 0}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Bắt đầu ôn ({selectedWords.length} từ)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="practice" className="space-y-6 mt-6">
            {selectedWords.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="mb-2">Chưa chọn từ để luyện</h3>
                  <p className="text-muted-foreground mb-4">
                    Hãy quay lại tab Cấu hình để chọn từ
                  </p>
                  <Button onClick={() => setActiveTab('config')}>
                    Chọn từ vựng
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Progress */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm">Tiến độ: {currentIndex + 1}/{selectedWords.length}</span>
                      <span className="text-sm">Đúng: {practiceResults.correct}/{practiceResults.total}</span>
                    </div>
                    <Progress value={(currentIndex / selectedWords.length) * 100} className="mb-2" />
                  </CardContent>
                </Card>

                {/* Current Word */}
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="space-y-6">
                      {/* Word Image */}
                      <div className="w-64 h-48 mx-auto rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <ImageWithFallback
                          src={`https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80`}
                          alt={selectedWords[currentIndex]?.word}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Hide/Show Controls */}
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHideEnglish(!hideEnglish)}
                        >
                          {hideEnglish ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                          {hideEnglish ? 'Hiện' : 'Ẩn'} Tiếng Anh
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setHideMeaning(!hideMeaning)}
                        >
                          {hideMeaning ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                          {hideMeaning ? 'Hiện' : 'Ẩn'} Nghĩa
                        </Button>
                      </div>

                      {!hideEnglish && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-center space-x-3">
                            <h2 className="text-3xl font-bold">{selectedWords[currentIndex]?.word}</h2>
                            <Button
                              variant="ghost"
                              size="lg"
                              onClick={() => speakWord(selectedWords[currentIndex]?.word)}
                            >
                              🔊
                            </Button>
                          </div>

                          {config.showPronunciation && selectedWords[currentIndex]?.pronunciation && (
                            <p className="text-lg text-muted-foreground">
                              {selectedWords[currentIndex].pronunciation}
                            </p>
                          )}
                        </div>
                      )}

                      {!hideMeaning && config.showMeaning && (
                        <p className="text-xl text-blue-600">
                          {selectedWords[currentIndex]?.meaning}
                        </p>
                      )}

                      {!hideMeaning && config.showExamples && selectedWords[currentIndex]?.examples.length > 0 && (
                        <div className="space-y-2 max-w-2xl mx-auto">
                          {selectedWords[currentIndex].examples.map((example) => (
                            <div key={example.id} className="p-3 bg-gray-50 rounded-lg text-left">
                              {!hideEnglish && (
                                <p className="italic mb-2">"{example.sentence}"</p>
                              )}
                              {!hideMeaning && example.translation && (
                                <p className="text-sm text-muted-foreground">
                                  → {example.translation}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {config.testMode && (
                        <div className="space-y-3 max-w-md mx-auto">
                          <Input
                            placeholder="Nhập từ vựng..."
                            value={userInput}
                            onChange={(e) => setUserInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !showAnswer) {
                                checkAnswer();
                              }
                            }}
                            disabled={showAnswer}
                          />
                          {!showAnswer ? (
                            <Button onClick={checkAnswer} disabled={!userInput.trim()}>
                              Kiểm tra
                            </Button>
                          ) : (
                            <div className="space-y-2">
                              <div className={`p-3 rounded-lg ${
                                userInput.toLowerCase().trim() === selectedWords[currentIndex]?.word.toLowerCase().trim()
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {userInput.toLowerCase().trim() === selectedWords[currentIndex]?.word.toLowerCase().trim()
                                  ? '✅ Chính xác!'
                                  : `❌ Sai. Đáp án: ${selectedWords[currentIndex]?.word}`
                                }
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center justify-between space-x-4">
                        <Button
                          variant="outline"
                          onClick={previousWord}
                          disabled={currentIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Trước
                        </Button>

                        <Button
                          onClick={() => addToMyNotes(selectedWords[currentIndex])}
                          variant="outline"
                        >
                          💾 Lưu MyNote
                        </Button>

                        <Button
                          variant="outline"
                          onClick={nextWord}
                          disabled={currentIndex === selectedWords.length - 1}
                        >
                          Sau
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
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
    </div>
  );
}