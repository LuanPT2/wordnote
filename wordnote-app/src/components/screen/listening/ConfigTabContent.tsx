// ConfigTabContent.tsx
import React, { useState, useEffect } from 'react';
import { Checkbox } from '../../ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { CategorySelector } from '../../common/CategorySelector';
import { TopicSelector } from '../../common/TopicSelector';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { VocabularyItem, ListeningConfig, SavedWordList } from './types';

interface ConfigTabContentProps {
  config: ListeningConfig;
  setConfig: React.Dispatch<React.SetStateAction<ListeningConfig>>;
  selectedWordIds: string[];
  setSelectedWordIds: React.Dispatch<React.SetStateAction<string[]>>;
  vocabularyList: VocabularyItem[];
  savedLists: SavedWordList[];
  setSavedLists: React.Dispatch<React.SetStateAction<SavedWordList[]>>;
  onStartListening: (wordList?: VocabularyItem[]) => void;
  categories: string[];
  topics: string[];
  showDictionaryPopup: boolean;
  setShowDictionaryPopup: React.Dispatch<React.SetStateAction<boolean>>;
  showCategoryManager: boolean;
  setShowCategoryManager: React.Dispatch<React.SetStateAction<boolean>>;
  showSaveDialog: boolean;
  setShowSaveDialog: React.Dispatch<React.SetStateAction<boolean>>;
  listName: string;
  setListName: React.Dispatch<React.SetStateAction<string>>;
}

export function ConfigTabContent({
  config,
  setConfig,
  selectedWordIds,
  setSelectedWordIds,
  vocabularyList,
  savedLists,
  setSavedLists,
  onStartListening,
  categories,
  topics,
  showDictionaryPopup,
  setShowDictionaryPopup,
  showCategoryManager,
  setShowCategoryManager,
  showSaveDialog,
  setShowSaveDialog,
  listName,
  setListName,
}: ConfigTabContentProps) {
  const [modeExpanded, setModeExpanded] = useState(false);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [wordListExpanded, setWordListExpanded] = useState(false);

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
      setSelectedWordIds(prev => prev.filter(id => !filteredWordIds.includes(id)));
    } else {
      setSelectedWordIds(prev => [...new Set([...prev, ...filteredWordIds])]);
    }
  };

  const areAllFilteredSelected = () => {
    const filteredWordIds = getFilteredWords().map(word => word.id);
    return filteredWordIds.length > 0 && filteredWordIds.every(id => selectedWordIds.includes(id));
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
    onStartListening();
  };

  const startListeningFromSaved = (savedList: SavedWordList) => {
    const words = vocabularyList.filter(word => savedList.wordIds.includes(word.id));
    onStartListening(words);
  };

  const deleteSavedList = (listId: string) => {
    setSavedLists(prev => prev.filter(list => list.id !== listId));
  };

  const handleSaveWordFromDictionary = (
    word: string, 
    meaning: string, 
    pronunciation: string, 
    category: string
  ) => {
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Listening Mode - Collapsible */}
      <Collapsible open={modeExpanded} onOpenChange={setModeExpanded}>
        <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <CollapsibleTrigger className="w-full">
            <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
              <CardTitle className="flex items-center justify-between text-left">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <span className="text-orange-600 text-lg">⚙️</span>
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
                  <TopicSelector
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

      {/* Quick Start Button */}
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

      {/* Modals */}
      <DictionarySearchModal
        isOpen={showDictionaryPopup}
        onClose={() => setShowDictionaryPopup(false)}
        onSaveWord={handleSaveWordFromDictionary}
        categories={categories}
      />
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}