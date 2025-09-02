import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { motion } from 'motion/react';

interface FlashcardScreenProps {
  onBack: () => void;
}

interface FlashcardData {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function FlashcardScreen({ onBack }: FlashcardScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['all']);
  const [difficulty, setDifficulty] = useState<string>('all');
  const [mode, setMode] = useState<'study' | 'test'>('study');

  const flashcards: FlashcardData[] = [
    {
      id: '1',
      word: 'serendipity',
      pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
      meaning: 'may mắn tình cờ, sự tình cờ may mắn',
      example: 'It was pure serendipity that we met at the coffee shop.',
      category: 'advanced',
      difficulty: 'hard'
    },
    {
      id: '2',
      word: 'fascinating',
      pronunciation: '/ˈfæs.ɪ.neɪ.tɪŋ/',
      meaning: 'hấp dẫn, lôi cuốn',
      example: 'The documentary about space was absolutely fascinating.',
      category: 'general',
      difficulty: 'medium'
    },
    {
      id: '3',
      word: 'efficient',
      pronunciation: '/ɪˈfɪʃ.ənt/',
      meaning: 'hiệu quả, có năng suất',
      example: 'This new software is very efficient for managing tasks.',
      category: 'business',
      difficulty: 'medium'
    },
    {
      id: '4',
      word: 'hypothesis',
      pronunciation: '/haɪˈpɑː.θə.sɪs/',
      meaning: 'giả thuyết, giả định',
      example: 'The scientist tested her hypothesis through experiments.',
      category: 'academic',
      difficulty: 'hard'
    },
    {
      id: '5',
      word: 'appreciate',
      pronunciation: '/əˈpriː.ʃi.eɪt/',
      meaning: 'đánh giá cao, cảm kích',
      example: 'I really appreciate your help with this project.',
      category: 'general',
      difficulty: 'easy'
    }
  ];

  const filteredCards = flashcards.filter(card => {
    const categoryMatch = selectedCategories.includes('all') || selectedCategories.includes(card.category);
    const difficultyMatch = difficulty === 'all' || card.difficulty === difficulty;
    return categoryMatch && difficultyMatch;
  });

  const currentCard = filteredCards[currentIndex];

  const categories = [
    { value: 'all', label: 'Tất cả', count: flashcards.length },
    { value: 'general', label: 'Tổng quát', count: flashcards.filter(c => c.category === 'general').length },
    { value: 'business', label: 'Kinh doanh', count: flashcards.filter(c => c.category === 'business').length },
    { value: 'academic', label: 'Học thuật', count: flashcards.filter(c => c.category === 'academic').length },
    { value: 'advanced', label: 'Nâng cao', count: flashcards.filter(c => c.category === 'advanced').length }
  ];

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNext = () => {
    if (currentIndex < filteredCards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // End of session
      setSessionStarted(false);
      setCurrentIndex(0);
    }
    setIsFlipped(false);
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    setIsFlipped(false);
  };

  const handleAnswer = (isCorrect: boolean) => {
    setSessionStats(prev => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrect: prev.incorrect + (isCorrect ? 0 : 1),
      total: prev.total + 1
    }));
    
    setTimeout(() => {
      handleNext();
    }, 500);
  };

  const startSession = () => {
    setSessionStarted(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setSessionStats({ correct: 0, incorrect: 0, total: 0 });
  };

  if (!sessionStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-indigo-600 text-white p-6">
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
              <span className="text-xl">🃏</span>
            </div>
            <div>
              <h1 className="text-xl">Flashcard</h1>
              <p className="text-indigo-100 text-sm">Ôn tập từ vựng hiệu quả</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Setup Card */}
          <Card>
            <CardContent className="p-6 space-y-6">
              <div className="text-center">
                <div className="text-6xl mb-4">🎯</div>
                <h2 className="text-2xl mb-2">Bắt đầu phiên ôn tập</h2>
                <p className="text-muted-foreground">
                  Tùy chỉnh phiên học phù hợp với bạn
                </p>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="block text-sm mb-3">Chế độ học</label>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={mode === 'study' ? 'default' : 'outline'}
                    onClick={() => setMode('study')}
                    className="h-auto p-4 flex-col"
                  >
                    <span className="text-2xl mb-2">📖</span>
                    <span className="text-sm">Học tự do</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Xem và ghi nhớ từ vựng
                    </span>
                  </Button>
                  <Button
                    variant={mode === 'test' ? 'default' : 'outline'}
                    onClick={() => setMode('test')}
                    className="h-auto p-4 flex-col"
                  >
                    <span className="text-2xl mb-2">🧠</span>
                    <span className="text-sm">Kiểm tra</span>
                    <span className="text-xs text-muted-foreground mt-1">
                      Đánh giá độ hiểu biết
                    </span>
                  </Button>
                </div>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm mb-3">Danh mục</label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map(category => (
                    <Button
                      key={category.value}
                      variant={selectedCategories.includes(category.value) ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => {
                        if (category.value === 'all') {
                          setSelectedCategories(['all']);
                        } else {
                          const newSelection = selectedCategories.includes(category.value)
                            ? selectedCategories.filter(c => c !== category.value)
                            : [...selectedCategories.filter(c => c !== 'all'), category.value];
                          setSelectedCategories(newSelection.length ? newSelection : ['all']);
                        }
                      }}
                    >
                      {category.label} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Difficulty Selection */}
              <div>
                <label className="block text-sm mb-3">Độ khó</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { value: 'all', label: 'Tất cả' },
                    { value: 'easy', label: 'Dễ' },
                    { value: 'medium', label: 'TB' },
                    { value: 'hard', label: 'Khó' }
                  ].map(diff => (
                    <Button
                      key={diff.value}
                      variant={difficulty === diff.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setDifficulty(diff.value)}
                    >
                      {diff.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-4">
                  Sẵn sàng ôn tập {filteredCards.length} từ vựng
                </p>
                <Button 
                  onClick={startSession}
                  size="lg"
                  className="w-full"
                  disabled={filteredCards.length === 0}
                >
                  <span className="mr-2">🚀</span>
                  Bắt đầu
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl mb-4">Hoàn thành phiên học!</h2>
            <div className="space-y-2 mb-6">
              <p>Đúng: {sessionStats.correct}/{sessionStats.total}</p>
              <p>Tỷ lệ: {Math.round((sessionStats.correct / sessionStats.total) * 100)}%</p>
            </div>
            <div className="space-y-2">
              <Button onClick={startSession} className="w-full">
                Học tiếp
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
      {/* Header */}
      <div className="bg-indigo-600 text-white p-6">
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
              <h1 className="text-lg">Flashcard</h1>
              <p className="text-indigo-100 text-sm">
                {currentIndex + 1} / {filteredCards.length}
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {mode === 'study' ? '📖 Học' : '🧠 Kiểm tra'}
          </Badge>
        </div>
        <Progress 
          value={(currentIndex + 1) / filteredCards.length * 100} 
          className="mt-4"
        />
      </div>

      <div className="p-6 h-[calc(100vh-200px)] flex items-center justify-center">
        {/* Flashcard */}
        <motion.div
          className="w-full max-w-lg h-80 perspective-1000"
          style={{ perspective: '1000px' }}
        >
          <motion.div
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            transition={{ duration: 0.6 }}
            className="relative w-full h-full preserve-3d cursor-pointer"
            onClick={handleFlip}
          >
            {/* Front */}
            <Card className="absolute inset-0 w-full h-full backface-hidden border-2 border-indigo-200">
              <CardContent className="h-full flex flex-col items-center justify-center p-8 text-center">
                <Badge className={getDifficultyColor(currentCard.difficulty)} size="sm">
                  {currentCard.difficulty === 'easy' ? 'Dễ' : 
                   currentCard.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                </Badge>
                <h2 className="text-3xl mb-4 mt-4">{currentCard.word}</h2>
                {currentCard.pronunciation && (
                  <p className="text-lg text-muted-foreground mb-6">
                    {currentCard.pronunciation}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Nhấn để xem nghĩa
                </p>
              </CardContent>
            </Card>

            {/* Back */}
            <Card 
              className="absolute inset-0 w-full h-full backface-hidden border-2 border-green-200"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <CardContent className="h-full flex flex-col justify-center p-8 text-center">
                <h3 className="text-xl mb-4">{currentCard.meaning}</h3>
                {currentCard.example && (
                  <div className="text-sm text-muted-foreground italic mb-6">
                    <p className="font-medium mb-2">Ví dụ:</p>
                    <p>"{currentCard.example}"</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Nhấn để xem từ vựng
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-6">
        {mode === 'study' ? (
          <div className="flex justify-between items-center max-w-lg mx-auto">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
            >
              ← Trước
            </Button>
            
            <div className="text-center">
              <Button
                variant="outline"
                onClick={handleFlip}
                size="sm"
                className="mb-2"
              >
                {isFlipped ? '🔄 Xem từ' : '🔄 Xem nghĩa'}
              </Button>
            </div>

            <Button
              onClick={handleNext}
              disabled={currentIndex === filteredCards.length - 1}
            >
              Tiếp →
            </Button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            {!isFlipped ? (
              <Button
                onClick={handleFlip}
                className="w-full mb-4"
              >
                Xem đáp án
              </Button>
            ) : (
              <div className="space-y-3">
                <p className="text-center text-sm text-muted-foreground">
                  Bạn có nhớ từ này không?
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleAnswer(false)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    ❌ Chưa nhớ
                  </Button>
                  <Button
                    onClick={() => handleAnswer(true)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    ✅ Đã nhớ
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}