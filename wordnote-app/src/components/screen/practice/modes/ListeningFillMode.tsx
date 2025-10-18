import React from 'react';
import { Card, CardContent } from '../../../ui/card';
import { Button } from '../../../ui/button';
import { Progress } from '../../../ui/progress';
import { Input } from '../../../ui/input';
import { TabsContent } from '../../../ui/tabs';
import { Eye, EyeOff, ChevronLeft, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../../../figma/ImageWithFallback';

interface ExampleItem { id: string; sentence: string; translation?: string }
export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation?: string;
  meaning: string;
  examples: ExampleItem[];
  category: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

interface PracticeResults { correct: number; total: number }

interface ListeningFillModeProps {
  // actions
  startPractice: () => void;
  setActiveTab: (tab: string) => void;
  speakWord: (text: string) => void;
  addToMyNotes: (word: VocabularyItem) => void;
  previousWord: () => void;
  nextWord: () => void;
  checkAnswer: () => void;

  // state values
  selectedWords: VocabularyItem[];
  currentIndex: number;
  practiceResults: PracticeResults;
  hideEnglish: boolean;
  setHideEnglish: (v: boolean) => void;
  hideMeaning: boolean;
  setHideMeaning: (v: boolean) => void;
  hideExamples: boolean;
  setHideExamples: (v: boolean) => void;
  config: { showPronunciation: boolean; showMeaning: boolean; showExamples: boolean };
  userInput: string;
  setUserInput: (val: string) => void;
  showAnswer: boolean;
}

export function ListeningFillMode(props: ListeningFillModeProps) {
  const {
    startPractice,
    setActiveTab,
    speakWord,
    addToMyNotes,
    previousWord,
    nextWord,
    checkAnswer,
    selectedWords,
    currentIndex,
    practiceResults,
    hideEnglish,
    setHideEnglish,
    hideMeaning,
    setHideMeaning,
    hideExamples,
    setHideExamples,
    config,
    userInput,
    setUserInput,
    showAnswer,
  } = props;

  return (
    <>
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

      <TabsContent value="practice" className="space-y-6 mt-6">
        {selectedWords.length === 0 ? (
          <Card>
            <CardContent className="text-center p-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="mb-2">Chưa chọn từ để luyện</h3>
              <p className="text-muted-foreground mb-4">Hãy quay lại tab Cấu hình để chọn từ</p>
              <Button onClick={() => setActiveTab('config')}>Chọn từ vựng</Button>
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
                <Progress value={(currentIndex / Math.max(selectedWords.length, 1)) * 100} className="mb-2" />
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
                    <Button variant="outline" size="sm" onClick={() => setHideEnglish(!hideEnglish)}>
                      {hideEnglish ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {hideEnglish ? 'Hiện' : 'Ẩn'} Tiếng Anh
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setHideMeaning(!hideMeaning)}>
                      {hideMeaning ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                      {hideMeaning ? 'Hiện' : 'Ẩn'} Nghĩa
                    </Button>
                    {config.showExamples && (
                      <Button variant="outline" size="sm" onClick={() => setHideExamples(!hideExamples)}>
                        {hideExamples ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
                        {hideExamples ? 'Hiện' : 'Ẩn'} Ví dụ
                      </Button>
                    )}
                  </div>

                  {!hideEnglish && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-center space-x-3">
                        <h2 className="text-3xl font-bold">{selectedWords[currentIndex]?.word}</h2>
                      </div>
                      {config.showPronunciation && selectedWords[currentIndex]?.pronunciation && (
                        <p className="text-lg text-muted-foreground">
                          {selectedWords[currentIndex]?.pronunciation}
                        </p>
                      )}
                    </div>
                  )}

                  {!hideMeaning && (
                    <p className="text-xl text-blue-600">{selectedWords[currentIndex]?.meaning}</p>
                  )}

                  {config.showExamples && !hideExamples && selectedWords[currentIndex]?.examples?.length > 0 && (
                    <div className="space-y-3 max-w-2xl mx-auto">
                      {selectedWords[currentIndex].examples.map((example) => (
                        <div key={example.id} className="p-4 bg-gray-50 rounded-lg">
                          <p className="italic mb-2">"{example.sentence}"</p>
                          {example.translation && (
                            <p className="text-sm text-muted-foreground">→ {example.translation}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3 max-w-md mx-auto">
                    <Input
                      placeholder="Nhập từ vựng..."
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter' && !showAnswer) { checkAnswer(); } }}
                      disabled={showAnswer}
                    />
                    {!showAnswer ? (
                      <Button onClick={checkAnswer} disabled={!userInput.trim()}>
                        Kiểm tra
                      </Button>
                    ) : (
                      <div className={`p-3 rounded-lg ${userInput.toLowerCase().trim() === selectedWords[currentIndex]?.word.toLowerCase().trim() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {userInput.toLowerCase().trim() === selectedWords[currentIndex]?.word.toLowerCase().trim()
                          ? '✅ Chính xác!'
                          : `❌ Sai. Đáp án: ${selectedWords[currentIndex]?.word}`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between space-x-4">
                    <Button variant="outline" onClick={previousWord} disabled={currentIndex === 0}>
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Trước
                    </Button>

                    <Button variant="outline" onClick={() => addToMyNotes(selectedWords[currentIndex])}>
                      💾 Lưu MyNote
                    </Button>

                    <Button variant="outline" onClick={nextWord} disabled={currentIndex === selectedWords.length - 1}>
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
    </>
  );
}
