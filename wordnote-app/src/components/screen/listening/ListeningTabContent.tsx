import React from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Play, Pause, SkipForward, SkipBack, Eye, EyeOff, List, Trash2, ArrowLeft } from 'lucide-react';
import { VocabularyItem, SavedWordList } from './types';

interface ListeningTabContentProps {
  selectedWords: VocabularyItem[];
  currentIndex: number;
  progress: number;
  isPlaying: boolean;
  showText: boolean;
  showTranslation: boolean;
  showExamples: boolean;
  backgroundImages: string[];
  currentImageIndex: number;
  currentListId: string | null;
  savedLists: SavedWordList[];
  setActiveTab: (tab: string) => void;
  togglePlayPause: () => void;
  nextWord: () => void;
  previousWord: () => void;
  setShowText: (value: boolean) => void;
  setShowTranslation: (value: boolean) => void;
  setShowExamples: (value: boolean) => void;
  handleSwitchList: (listId: string) => void;
  deleteSavedList: (listId: string) => void;
  getDifficultyColor: (difficulty: string) => string;
  getCategoryColor: (category: string) => string;
}

export function ListeningTabContent({
  selectedWords,
  currentIndex,
  progress,
  isPlaying,
  showText,
  showTranslation,
  showExamples,
  backgroundImages,
  currentImageIndex,
  currentListId,
  savedLists,
  setActiveTab,
  togglePlayPause,
  nextWord,
  previousWord,
  setShowText,
  setShowTranslation,
  setShowExamples,
  handleSwitchList,
  deleteSavedList,
  getDifficultyColor,
  getCategoryColor
}: ListeningTabContentProps) {
  return (
    <div className="space-y-6 mt-6">
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
          {/* List Selector */}
          <div className="p-6 pb-4">
            <div className="bg-white rounded-2xl shadow-lg p-4 border-2 border-purple-100">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-shrink-0">
                  <List className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-gray-700">Danh sách:</span>
                </div>
                <Select 
                  value={currentListId || 'new'} 
                  onValueChange={handleSwitchList}
                >
                  <SelectTrigger className="flex-1 h-12 bg-gradient-to-r from-purple-50 to-violet-50 border-2 border-purple-200 rounded-xl">
                    <SelectValue placeholder="Chọn hoặc tạo danh sách mới" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">➕</span>
                        <span>Tạo danh sách mới</span>
                      </div>
                    </SelectItem>
                    {savedLists.map((list) => (
                      <SelectItem key={list.id} value={list.id}>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">🎧</span>
                          <div className="flex flex-col">
                            <span>{list.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {list.wordIds.length} từ • {new Date(list.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {currentListId && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSavedList(currentListId)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 h-10 w-10 p-0 rounded-xl flex-shrink-0"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

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

          <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab('config')}
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Quay lại cấu hình
                </Button>
        </>
      )}
    </div>
  );
}