import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface AudioReviewScreenProps {
  onBack: () => void;
}

interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
  reviewCount: number;
  lastReviewed: string;
  audioUrl?: string;
}

export function AudioReviewScreen({ onBack }: AudioReviewScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [showMeaning, setShowMeaning] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [autoPlay, setAutoPlay] = useState(true);
  const [filterType, setFilterType] = useState<'not_mastered' | 'all' | 'mastered'>('not_mastered');
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    mastered: 0,
    needReview: 0
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const vocabularyData: VocabularyItem[] = [
    {
      id: '1',
      word: 'pronunciation',
      pronunciation: '/prəˌnʌn.siˈeɪ.ʃən/',
      meaning: 'cách phát âm',
      example: 'The pronunciation of this word is quite difficult.',
      category: 'general',
      difficulty: 'medium',
      mastered: false,
      reviewCount: 3,
      lastReviewed: '2024-12-14',
      audioUrl: 'https://www.soundjay.com/misc/beep-07a.wav' // Mock URL
    },
    {
      id: '2',
      word: 'vocabulary',
      pronunciation: '/vəˈkæb.jə.ler.i/',
      meaning: 'từ vựng',
      example: 'Building vocabulary is essential for language learning.',
      category: 'general',
      difficulty: 'easy',
      mastered: true,
      reviewCount: 8,
      lastReviewed: '2024-12-13',
      audioUrl: 'https://www.soundjay.com/misc/beep-08a.wav'
    },
    {
      id: '3',
      word: 'magnificent',
      pronunciation: '/mæɡˈnɪf.ɪ.sənt/',
      meaning: 'tuyệt vời, lộng lẫy',
      example: 'The view from the mountain was magnificent.',
      category: 'advanced',
      difficulty: 'hard',
      mastered: false,
      reviewCount: 1,
      lastReviewed: '2024-12-15',
      audioUrl: 'https://www.soundjay.com/misc/beep-09a.wav'
    },
    {
      id: '4',
      word: 'entrepreneur',
      pronunciation: '/ˌɑːn.trə.prəˈnɝː/',
      meaning: 'doanh nhân',
      example: 'She is a successful entrepreneur in the tech industry.',
      category: 'business',
      difficulty: 'hard',
      mastered: false,
      reviewCount: 5,
      lastReviewed: '2024-12-12',
      audioUrl: 'https://www.soundjay.com/misc/beep-10a.wav'
    },
    {
      id: '5',
      word: 'comfortable',
      pronunciation: '/ˈkʌmf.tə.bl̩/',
      meaning: 'thoải mái',
      example: 'This chair is very comfortable to sit in.',
      category: 'general',
      difficulty: 'easy',
      mastered: true,
      reviewCount: 12,
      lastReviewed: '2024-12-10',
      audioUrl: 'https://www.soundjay.com/misc/beep-11a.wav'
    }
  ];

  const filteredVocabulary = vocabularyData.filter(item => {
    switch (filterType) {
      case 'not_mastered':
        return !item.mastered;
      case 'mastered':
        return item.mastered;
      default:
        return true;
    }
  });

  const currentItem = filteredVocabulary[currentIndex];

  // Text-to-Speech function
  const speakWord = (text: string, rate: number = playbackSpeed) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = rate;
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const playAudio = () => {
    // Try to play native audio first, fallback to TTS
    if (currentItem.audioUrl && audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
      audioRef.current.play().catch(() => {
        // Fallback to TTS if audio fails
        speakWord(currentItem.word, playbackSpeed);
      });
    } else {
      speakWord(currentItem.word, playbackSpeed);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredVocabulary.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End session
      setSessionStarted(false);
      setCurrentIndex(0);
    }
    setShowMeaning(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setShowMeaning(false);
  };

  const handleMasteryUpdate = (isMastered: boolean) => {
    setSessionStats(prev => ({
      reviewed: prev.reviewed + 1,
      mastered: prev.mastered + (isMastered ? 1 : 0),
      needReview: prev.needReview + (isMastered ? 0 : 1)
    }));

    // Auto-advance after marking
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const startSession = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setShowMeaning(false);
    setSessionStats({ reviewed: 0, mastered: 0, needReview: 0 });
  };

  // Auto-play when item changes
  useEffect(() => {
    if (sessionStarted && currentItem && autoPlay) {
      const timer = setTimeout(() => {
        playAudio();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, sessionStarted, autoPlay]);

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
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
              <h1 className="text-xl">Ôn tập âm thanh</h1>
              <p className="text-green-100 text-sm">Luyện nghe và phát âm từ vựng</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Setup Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎧</div>
                <h2 className="text-2xl mb-2">Bắt đầu ôn tập</h2>
                <p className="text-muted-foreground">
                  Nghe và ôn lại từ vựng đã học
                </p>
              </div>

              {/* Filter Selection */}
              <div>
                <label className="block text-sm mb-3">Loại từ vựng</label>
                <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not_mastered">
                      🔄 Chưa thuộc ({vocabularyData.filter(v => !v.mastered).length})
                    </SelectItem>
                    <SelectItem value="mastered">
                      ✅ Đã thuộc ({vocabularyData.filter(v => v.mastered).length})
                    </SelectItem>
                    <SelectItem value="all">
                      📚 Tất cả ({vocabularyData.length})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Audio Settings */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-3">Tốc độ phát âm</label>
                  <div className="space-y-2">
                    <Slider
                      value={[playbackSpeed]}
                      onValueChange={(value) => setPlaybackSpeed(value[0])}
                      min={0.5}
                      max={2}
                      step={0.1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Chậm (0.5x)</span>
                      <span>Hiện tại: {playbackSpeed}x</span>
                      <span>Nhanh (2x)</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm">Tự động phát âm</label>
                    <p className="text-xs text-muted-foreground">
                      Phát âm tự động khi chuyển từ
                    </p>
                  </div>
                  <Button
                    variant={autoPlay ? "default" : "outline"}
                    size="sm"
                    onClick={() => setAutoPlay(!autoPlay)}
                  >
                    {autoPlay ? "🔊 Bật" : "🔇 Tắt"}
                  </Button>
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Sẵn sàng ôn tập {filteredVocabulary.length} từ vựng
                </p>
                <Button 
                  onClick={startSession}
                  size="lg"
                  className="w-full"
                  disabled={filteredVocabulary.length === 0}
                >
                  <span className="mr-2">🎵</span>
                  Bắt đầu ôn tập
                </Button>
                {filteredVocabulary.length === 0 && (
                  <p className="text-sm text-orange-600 mt-2">
                    Không có từ vựng nào trong danh mục này
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-1 text-red-600">
                  {vocabularyData.filter(v => !v.mastered).length}
                </div>
                <div className="text-xs text-muted-foreground">Chưa thuộc</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-1 text-green-600">
                  {vocabularyData.filter(v => v.mastered).length}
                </div>
                <div className="text-xs text-muted-foreground">Đã thuộc</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-1 text-blue-600">
                  {vocabularyData.reduce((acc, v) => acc + v.reviewCount, 0)}
                </div>
                <div className="text-xs text-muted-foreground">Lần ôn tập</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  if (!currentItem) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-4">Hoàn thành phiên ôn tập!</h2>
            <div className="space-y-2 mb-6">
              <p>Đã ôn: {sessionStats.reviewed}</p>
              <p>Đã thuộc: {sessionStats.mastered}</p>
              <p>Cần ôn thêm: {sessionStats.needReview}</p>
            </div>
            <div className="space-y-2">
              <Button onClick={startSession} className="w-full">
                Ôn tiếp
              </Button>
              <Button variant="outline" onClick={onBack} className="w-full">
                Quay lại
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hidden audio element */}
      <audio ref={audioRef} preload="auto">
        <source src={currentItem.audioUrl} type="audio/mpeg" />
      </audio>

      {/* Header */}
      <div className="bg-green-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSessionStarted(false)}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div>
              <h1 className="text-lg">Ôn tập âm thanh</h1>
              <p className="text-green-100 text-sm">
                {currentIndex + 1} / {filteredVocabulary.length}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {filterType === 'not_mastered' ? '🔄' : filterType === 'mastered' ? '✅' : '📚'}
          </Badge>
        </div>
        <Progress 
          value={(currentIndex + 1) / filteredVocabulary.length * 100} 
          className="mt-4"
        />
      </div>

      {/* Main Content */}
      <div className="p-6 min-h-[calc(100vh-300px)] flex items-center justify-center">
        <Card className="w-full max-w-lg">
          <CardContent className="p-8 text-center space-y-6">
            {/* Word Display */}
            <div className="space-y-4">
              <Badge 
                variant={currentItem.mastered ? "default" : "secondary"}
                className={currentItem.mastered ? "bg-green-600" : "bg-orange-600"}
              >
                {currentItem.mastered ? "✅ Đã thuộc" : "🔄 Chưa thuộc"}
              </Badge>
              
              <h2 className="text-4xl mb-4">{currentItem.word}</h2>
              
              <p className="text-lg text-muted-foreground">
                {currentItem.pronunciation}
              </p>

              {/* Audio Controls */}
              <div className="flex justify-center space-x-3">
                <Button
                  onClick={playAudio}
                  size="lg"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <span className="mr-2">🔊</span>
                  Nghe ({playbackSpeed}x)
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowMeaning(!showMeaning)}
                >
                  {showMeaning ? "👁️ Ẩn nghĩa" : "👁️ Xem nghĩa"}
                </Button>
              </div>
            </div>

            {/* Meaning & Example */}
            {showMeaning && (
              <div className="space-y-4 pt-6 border-t">
                <div>
                  <h3 className="text-xl mb-2">{currentItem.meaning}</h3>
                  <p className="text-sm text-muted-foreground italic">
                    "{currentItem.example}"
                  </p>
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-xs text-muted-foreground">
                  <Badge variant="outline" size="sm">{currentItem.category}</Badge>
                  <Badge variant="outline" size="sm">
                    {currentItem.difficulty === 'easy' ? 'Dễ' : 
                     currentItem.difficulty === 'medium' ? 'TB' : 'Khó'}
                  </Badge>
                  <span>• Ôn {currentItem.reviewCount} lần</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6">
        <div className="max-w-lg mx-auto">
          <p className="text-center text-sm text-muted-foreground mb-4">
            Bạn có thuộc từ này không?
          </p>
          <div className="grid grid-cols-3 gap-3">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex-col h-16"
            >
              <span className="text-lg mb-1">←</span>
              <span className="text-xs">Trước</span>
            </Button>
            
            <div className="grid grid-rows-2 gap-2">
              <Button
                onClick={() => handleMasteryUpdate(false)}
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                size="sm"
              >
                ❌ Chưa thuộc
              </Button>
              <Button
                onClick={() => handleMasteryUpdate(true)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                ✅ Đã thuộc
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleNext}
              disabled={currentIndex === filteredVocabulary.length - 1}
              className="flex-col h-16"
            >
              <span className="text-lg mb-1">→</span>
              <span className="text-xs">Tiếp</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}