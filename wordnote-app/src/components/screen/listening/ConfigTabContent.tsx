// ConfigTabContent.tsx - SAU KHI TÁCH ListeningModeSection
import React, { useState, useEffect, useMemo } from 'react';
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
import { TopicMutiSelector } from '../../common/TopicMutiSelector';
import { VocabularyFilter } from '../../common/VocabularyFilter';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { ListeningModeSection } from './ListeningModeSection'; // ← THÊM IMPORT MỚI
import { VocabularyItem, ListeningConfig, SavedWordList } from './types';
import { getCategories } from '../../../lib/vocabulary-data';

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

  const filteredWords = useMemo(() => {
    return vocabularyList.filter(word => {
      const categoryMatch = config.categories.length === 0 || config.categories.includes(word.category);
      const topicMatch = config.topics.length === 0 || config.topics.includes(word.topic);
      const difficultyMatch = config.difficulties.includes(word.difficulty);
      const masteryMatch = config.masteryStatus.includes('all') ||
        (config.masteryStatus.includes('mastered') && word.mastered) ||
        (config.masteryStatus.includes('not-mastered') && !word.mastered);
      
      return categoryMatch && topicMatch && difficultyMatch && masteryMatch;
    });
  }, [vocabularyList, config]);

  const getFilteredWords = () => filteredWords;

  // Update selected word IDs when filtered words change
  useEffect(() => {
    const filteredWordIds = filteredWords.map(word => word.id);
    setSelectedWordIds(filteredWordIds);
  }, [filteredWords, setSelectedWordIds]);

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
    const filteredWordIds = filteredWords.map(word => word.id);
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
    const categoryData = getCategories().find(c => c.name === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
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
      {/* Listening Mode Section - COMPONENT MỚI */}
      <ListeningModeSection
        config={config}
        setConfig={setConfig}
        expanded={modeExpanded}
        onExpandedChange={setModeExpanded}
      />

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
                categoryTitle="Chọn danh mục cho bài nghe"
                categoryDescription="Chọn các danh mục từ vựng cho bài luyện nghe của bạn"
                categoryIcon={<span className="text-lg">🎧</span>}
              />
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
                  disabled={filteredWords.length === 0}
                />
                <span className="text-base font-medium">Danh sách từ cần nghe</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {selectedWordIds.length} từ đã chọn
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
                {filteredWords.map((word) => (
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
                
                {filteredWords.length === 0 && (
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
                        {selectedWordIds.length > 0 ? `${selectedWordIds.length} từ đã chọn` : 'Chọn từ vựng để bắt đầu'}
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