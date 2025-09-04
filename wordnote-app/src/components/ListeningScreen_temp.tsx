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
import { Settings, Play, Pause, SkipForward, SkipBack, Volume2, Shuffle, Eye, EyeOff, ChevronDown, ChevronUp, Trash2, BookOpen } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';
import { CategoryTopicSelector } from './CategoryTopicSelector';
import { DictionarySearchPopup } from './DictionarySearchPopup';

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

  // Dictionary popup
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

  const categories = ['Harry Potter', 'Luyện TOEIC', 'Daily', 'New', 'Story'];
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

  const startListening = (wordList: VocabularyItem[] = []) => {
    const wordsToPlay = wordList.length > 0 ? wordList : getSelectedWords();
    setSelectedWords(wordsToPlay);
    setCurrentIndex(0);
    setProgress(0);
    setActiveTab('listening');
    setIsPlaying(true);
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

  const handleSaveWordFromDictionary = (word: string, meaning: string, pronunciation: string, category: string) => {
    // Mock function - in real app this would save to database
    console.log('Word saved from dictionary:', { word, meaning, pronunciation, category });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6">
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
              <span className="text-xl">🎵</span>
            </div>
            <div>
              <h1 className="text-xl">Nghe</h1>
              <p className="text-purple-100 text-sm">
                {activeTab === 'listening' && selectedWords.length > 0 
                  ? `${currentIndex + 1}/${selectedWords.length} • ${Math.round(progress)}%`
                  : `${getSelectedWords().length} từ đã chọn`
                }
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Dictionary Icon */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDictionaryPopup(true)}
              className="text-white hover:bg-white/20"
              title="Tra từ điển"
            >
              <BookOpen className="h-6 w-6" />
            </Button>
            
            {activeTab === 'listening' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsBackgroundMode(!isBackgroundMode)}
                className="text-white hover:bg-white/20"
              >
                {isBackgroundMode ? '🔇' : '🎵'} 
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="config">Cấu hình nghe</TabsTrigger>
            <TabsTrigger value="listening">Đang nghe</TabsTrigger>
          </TabsList>

          <TabsContent value="config" className="space-y-6 mt-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Bộ lọc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            </Card>

            {/* Word Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Danh sách từ cần nghe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
            </Card>

            {/* Start Listening Button */}
            <div className="pt-4">
              <Button
                onClick={() => startListening()}
                disabled={getSelectedWords().length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700"
                size="lg"
              >
                Bắt đầu nghe ({getSelectedWords().length} từ)
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="listening" className="space-y-6 mt-6">
            {selectedWords.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">🎵</div>
                  <h3 className="mb-2">Chưa chọn từ để nghe</h3>
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
                      <span className="text-sm">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="mb-2" />
                  </CardContent>
                </Card>

                {/* Current Word */}
                {selectedWords[currentIndex] && (
                  <Card className="text-center">
                    <CardContent className="p-8">
                      <div className="space-y-4">
                        <h1 className="text-4xl font-medium mb-4">
                          {selectedWords[currentIndex].word}
                        </h1>
                        
                        <div className="text-xl text-muted-foreground">
                          {selectedWords[currentIndex].pronunciation}
                        </div>
                        
                        <div className="text-lg text-gray-700">
                          {selectedWords[currentIndex].meaning}
                        </div>
                        
                        {selectedWords[currentIndex].examples.length > 0 && (
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="italic mb-2">
                              "{selectedWords[currentIndex].examples[0].sentence}"
                            </p>
                            <p className="text-gray-600">
                              → {selectedWords[currentIndex].examples[0].translation}
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentIndex > 0) {
                        setCurrentIndex(prev => prev - 1);
                      }
                    }}
                    disabled={currentIndex === 0}
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>
                  
                  <Button
                    onClick={() => setIsPlaying(!isPlaying)}
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (currentIndex < selectedWords.length - 1) {
                        setCurrentIndex(prev => prev + 1);
                      }
                    }}
                    disabled={currentIndex === selectedWords.length - 1}
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>
                </div>

                {/* Back to Config */}
                <Button
                  variant="outline"
                  onClick={() => setActiveTab('config')}
                  className="w-full"
                >
                  Quay lại cấu hình
                </Button>
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
        categories={categories}
      />
    </div>
  );
}