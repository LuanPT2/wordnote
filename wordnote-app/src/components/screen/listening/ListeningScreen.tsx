import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Play, Pause, SkipForward, SkipBack, Eye, EyeOff, BookOpen } from 'lucide-react';
import { ConfigTabContent } from './ConfigTabContent';
import { VocabularyItem, ListeningConfig, SavedWordList } from './types';

interface ListeningScreenProps {
  onBack: () => void;
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

  // Initialize selected words when component mounts
  useEffect(() => {
    const allWordIds = vocabularyList.map(word => word.id);
    setSelectedWordIds(allWordIds);
  }, []);

  const getSelectedWords = () => {
    return vocabularyList.filter(word => selectedWordIds.includes(word.id));
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Harry Potter': return 'bg-red-100 text-red-800';
      case 'Luyện TOEIC': return 'bg-green-100 text-green-800';
      case 'Daily': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDictionaryOpen = () => setShowDictionaryPopup(true);
  const handleCategoryManagerOpen = () => setShowCategoryManager(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
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
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDictionaryOpen}
              className="text-white hover:bg-white/20"
              title="Tra từ điển"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCategoryManagerOpen}
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
              <span>⚙️</span>
              <span>Cấu hình</span>
            </TabsTrigger>
            <TabsTrigger value="listening" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
              <span>🎧</span>
              <span>Luyện nghe</span>
            </TabsTrigger>
          </TabsList>

          {/* CONFIG TAB - TÁCH RA */}
          <TabsContent value="config" className="space-y-6 mt-6">
            <ConfigTabContent
              config={config}
              setConfig={setConfig}
              selectedWordIds={selectedWordIds}
              setSelectedWordIds={setSelectedWordIds}
              vocabularyList={vocabularyList}
              savedLists={savedLists}
              setSavedLists={setSavedLists}
              onStartListening={startListening}
              categories={categories}
              topics={topics}
              showDictionaryPopup={showDictionaryPopup}
              setShowDictionaryPopup={setShowDictionaryPopup}
              showCategoryManager={showCategoryManager}
              setShowCategoryManager={setShowCategoryManager}
              showSaveDialog={showSaveDialog}
              setShowSaveDialog={setShowSaveDialog}
              listName={listName}
              setListName={setListName}
            />
          </TabsContent>

          {/* LISTENING TAB - GIỮ NGUYÊN */}
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

                {/* Progress */}
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
    </div>
  );
}