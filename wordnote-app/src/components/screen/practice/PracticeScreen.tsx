import React, { useState, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { DifficultyMutiSelector } from '../../common/DifficultyMutiSelector';
import { StatusStudiesMutiSelector } from '../../common/StatusStudiesMutiSelector';
import { Checkbox } from '../../ui/checkbox';
import { Progress } from '../../ui/progress';
import { ChevronLeft, ChevronRight, Play, Pause, Settings, Eye, EyeOff, ChevronDown, ChevronUp, BookOpen, Search } from 'lucide-react';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { Slider } from '../../ui/slider';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { TopicMutiSelector } from '../../common/TopicMutiSelector';
import { CategorySelector } from '../../common/CategorySelector';
import { TrainingTypesSelector, TrainingType } from '../../common/TrainingTypesSelector';
import { VocabularyFilter } from '../../common/VocabularyFilter';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { ListeningFillMode } from './modes/ListeningFillMode';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { Header } from '../../common/Header';

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
  const [trainingTypes, setTrainingTypes] = useState<TrainingType[]>(['listening-fill']);
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
  const [hideExamples, setHideExamples] = useState(false);
  
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

  const getSubtitle = () => {
    if (activeTab === 'practice' && selectedWords.length > 0) {
      return `📖 ${currentIndex + 1}/${selectedWords.length} • ✅ ${Math.round((practiceResults.correct / Math.max(practiceResults.total, 1)) * 100)}% đúng`;
    } else if (activeTab === 'mynote') {
      return `📝 ${myNotes.length} ghi chú`;
    } else {
      return `📚 ${getFilteredWords().length} từ sẵn sàng`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header
        title="Luyện tập từ vựng"
        subtitle={getSubtitle()}
        screenType="practice"
        onBack={onBack}
        categories={['Harry Potter', 'Luyện TOEIC', 'Daily', 'New', 'Story']}
        showDictionaryPopup={showDictionaryPopup}
        setShowDictionaryPopup={setShowDictionaryPopup}
        showCategoryManager={showCategoryManager}
        setShowCategoryManager={setShowCategoryManager}
        onSaveWord={handleSaveWordFromDictionary}
      />



      <div className="p-6 bg-gradient-to-b from-muted/30 to-background min-h-screen">
        <div className="space-y-6 mt-6">
          {!isPlaying && (
            <>
            {/* Settings - Collapsible */}
            <Collapsible open={settingsExpanded} onOpenChange={setSettingsExpanded}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Settings className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-lg">Cài đặt luyện tập</span>
                      </div>
                      <div className="p-1 hover:bg-muted rounded-md transition-colors">
                        {settingsExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
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

            {/* Training Types + Filter Settings - Collapsible */}
            <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
                    <CardTitle className="flex items-center justify-between text-left">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <span className="text-purple-600">🔍</span>
                        </div>
                        <span className="text-lg">Loại luyện tập & Bộ lọc từ vựng</span>
                      </div>
                      <div className="p-1 hover:bg-muted rounded-md transition-colors">
                        {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="space-y-6 pt-0">
                    <VocabularyFilter
                      value={{
                        categories: config.categories,
                        topics: config.topics,
                        difficulties: config.difficulties as any,
                        masteryStatus: config.masteryStatus as any,
                      }}
                      onChange={(v) => setConfig(prev => ({
                        ...prev,
                        categories: v.categories,
                        topics: v.topics,
                        difficulties: v.difficulties,
                        masteryStatus: v.masteryStatus,
                      }))}
                      categoryTitle="Chọn danh mục luyện tập"
                      categoryDescription="Chọn các danh mục từ vựng mà bạn muốn luyện tập"
                      categoryIcon={<span className="text-lg">🎯</span>}
                    />
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>

            {/* Word Selection - Collapsible */}
            <Collapsible open={wordListExpanded} onOpenChange={setWordListExpanded}>
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-orange-100 rounded-lg">
                        <span className="text-orange-600">📝</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium">Chọn từ để luyện</h3>
                        <p className="text-sm text-muted-foreground">{getFilteredWords().length} từ phù hợp với bộ lọc</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-primary">{selectedWords.length} từ</div>
                      <div className="text-xs text-muted-foreground">đã chọn</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 mb-2">
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
                    <span className="text-sm">Chọn tất cả từ vựng</span>
                  </div>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-center py-3 px-4 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors border border-dashed">
                      {wordListExpanded ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-2" />
                          <span>Thu gọn danh sách từ vựng</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-2" />
                          <span>Xem danh sách từ vựng</span>
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

            {/* Training Types - Outside of collapsed sections */}
            <div className="pt-2">
              <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-4">
                  <TrainingTypesSelector selected={trainingTypes} onChange={setTrainingTypes} />
                </CardContent>
              </Card>
            </div>

            {/* Start Practice Button - Outside of collapsed sections */}
            <div className="pt-6">
              <Card className="border-0 shadow-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white overflow-hidden">
                <CardContent className="p-0">
                  <Button
                    onClick={startPractice}
                    disabled={selectedWords.length === 0}
                    className="w-full h-16 bg-transparent hover:bg-white/10 text-white text-lg font-semibold rounded-none shadow-none border-0 disabled:opacity-50 disabled:bg-transparent"
                    size="lg"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <span className="text-2xl">🚀</span>
                      </div>
                      <div className="text-left">
                        <div>Bắt đầu luyện tập</div>
                        <div className="text-sm opacity-90">
                          {selectedWords.length > 0 ? `${selectedWords.length} từ đã chọn` : 'Chọn từ vựng để bắt đầu'}
                        </div>
                      </div>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            </div>
            </>
          )}

          {isPlaying && (
            <Tabs value="practice">
              <ListeningFillMode
                startPractice={startPractice}
                setActiveTab={setActiveTab}
                speakWord={speakWord}
                addToMyNotes={addToMyNotes}
                previousWord={previousWord}
                nextWord={nextWord}
                checkAnswer={checkAnswer}
                selectedWords={selectedWords}
                currentIndex={currentIndex}
                practiceResults={practiceResults}
                hideEnglish={hideEnglish}
                setHideEnglish={setHideEnglish}
                hideMeaning={hideMeaning}
                setHideMeaning={setHideMeaning}
                hideExamples={hideExamples}
                setHideExamples={setHideExamples}
                config={{
                  showPronunciation: config.showPronunciation,
                  showMeaning: config.showMeaning,
                  showExamples: config.showExamples,
                }}
                userInput={userInput}
                setUserInput={setUserInput}
                showAnswer={showAnswer}
              />
            </Tabs>
          )}

        </div>
      </div>

      {/* Dictionary Search Popup */}
      <DictionarySearchModal
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