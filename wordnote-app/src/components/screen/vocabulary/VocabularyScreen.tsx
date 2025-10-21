import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { MoreVertical, Edit, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../ui/dropdown-menu';
import { AddWordDialog } from './AddWordModal';
import { BulkAddDialog } from './BulkAddDialog';
import { VocabularyFilters } from './VocabularyFilters';
import { EditWordDialog } from './EditWordDialog';
import { Header } from '../../common/Header';
import { 
  getVocabularyList, 
  getCategories, 
  getTopics, 
  getVocabularyStats,
  VocabularyItem,
  addVocabularyItem,
  updateVocabularyItem,
  deleteVocabularyItem
} from '../../../lib/vocabulary-data';

interface VocabularyScreenProps {
  onBack: () => void;
}

interface Example {
  id: string;
  sentence: string;
  translation: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: Example[];
  category: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dateAdded: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export function VocabularyScreen({ onBack }: VocabularyScreenProps) {
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoryList, setFilterCategoryList] = useState<string[]>([]);
  const [filterTopicList, setFilterTopicList] = useState<string[]>([]);
  const [filterDifficulty, setFilterDifficulty] = useState('all');
  const [filterMastered, setFilterMastered] = useState('all');
  const [sortBy, setSortBy] = useState('dateAdded');
  const [sortOrder, setSortOrder] = useState('desc');

  // Collapsible states
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  // Column visibility
  const [visibleColumns, setVisibleColumns] = useState(['word', 'pronunciation', 'meaning', 'examples']);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Category management
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  const [categories, setCategories] = useState(getCategories().map(c => c.name));

  // Edit mode
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);

  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>(getVocabularyList());

  const handleDeleteWord = (id: string) => {
    deleteVocabularyItem(id);
    setVocabularyList(getVocabularyList());
  };

  const handleEditWord = (updatedItem: VocabularyItem) => {
    updateVocabularyItem(updatedItem.id, updatedItem);
    setVocabularyList(getVocabularyList());
    setEditingItem(null);
  };

  const handleAddWord = (newWord: VocabularyItem) => {
    addVocabularyItem(newWord);
    setVocabularyList(getVocabularyList());
  };

  const getFilteredAndSortedList = () => {
    let filtered = vocabularyList.filter(item => {
      const searchMatch = searchTerm === '' || 
        item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.meaning.toLowerCase().includes(searchTerm.toLowerCase());
      const categoryMatch = filterCategoryList.length === 0 || filterCategoryList.includes(item.category);
      const topicMatch = filterTopicList.length === 0 || filterTopicList.includes(item.topic);
      const difficultyMatch = filterDifficulty === 'all' || item.difficulty === filterDifficulty;
      const masteredMatch = filterMastered === 'all' || 
        (filterMastered === 'mastered' && item.mastered) ||
        (filterMastered === 'not-mastered' && !item.mastered);
      
      return searchMatch && categoryMatch && topicMatch && difficultyMatch && masteredMatch;
    });

    return filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'word':
          aValue = a.word.toLowerCase();
          bValue = b.word.toLowerCase();
          break;
        case 'dateAdded':
          aValue = new Date(a.dateAdded);
          bValue = new Date(b.dateAdded);
          break;
        case 'reviewCount':
          aValue = a.reviewCount;
          bValue = b.reviewCount;
          break;
        case 'difficulty':
          const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
          aValue = difficultyOrder[a.difficulty];
          bValue = difficultyOrder[b.difficulty];
          break;
        default:
          return 0;
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
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
    const categoryData = getCategories().find(c => c.name === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

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
      dateAdded: new Date().toISOString().split('T')[0],
      mastered: false,
      reviewCount: 0
    };
    
    setVocabularyList(prev => [newVocabularyItem, ...prev]);
    setShowDictionaryPopup(false);
  };

  const handleAddCategory = (newCategory: string) => {
    setCategories(prev => [...prev, newCategory]);
  };

  const subtitle = `${vocabularyList.length} từ • ${vocabularyList.filter(v => v.mastered).length} đã thuộc`;

  return (
    <div className="h-screen bg-background flex flex-col">
      <Header
        title="Từ vựng"
        subtitle={subtitle}
        screenType="vocabulary"
        onBack={onBack}
        categories={categories}
        showDictionaryPopup={showDictionaryPopup}
        setShowDictionaryPopup={setShowDictionaryPopup}
        showCategoryManager={showCategoryManager}
        setShowCategoryManager={setShowCategoryManager}
        onSaveWord={handleSaveWordFromDictionary}
      />

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Add Word Button */}
        <div className="mb-6 flex justify-between items-center shrink-0">
          <h2 className="text-lg font-medium">Danh sách từ vựng</h2>
          <div className="flex space-x-2">
            <AddWordDialog
              categories={categories}
              onAddWord={(newWord) => setVocabularyList([newWord, ...vocabularyList])}
              onAddCategory={handleAddCategory}
            />
            <BulkAddDialog
              categories={categories}
              setVocabularyList={setVocabularyList}
              setCategories={setCategories}
            />
          </div>
        </div>

        {/* Filters - Collapsible */}
        <div className="mb-6 shrink-0">
          <VocabularyFilters
            filterCategoryList={filterCategoryList}
            filterTopicList={filterTopicList}
            filterDifficulty={filterDifficulty}
            filterMastered={filterMastered}
            sortBy={sortBy}
            sortOrder={sortOrder}
            visibleColumns={visibleColumns}
            showColumnSelector={showColumnSelector}
            filtersExpanded={filtersExpanded}
            setFilterCategoryList={setFilterCategoryList}
            setFilterTopicList={setFilterTopicList}
            setFilterDifficulty={setFilterDifficulty}
            setFilterMastered={setFilterMastered}
            setSortBy={setSortBy}
            setSortOrder={setSortOrder}
            setVisibleColumns={setVisibleColumns}
            setShowColumnSelector={setShowColumnSelector}
            setFiltersExpanded={setFiltersExpanded}
          />
        </div>

        {/* Vocabulary List - Scrollable */}
        <div 
          className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto"
          style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-y' }}
        >
          {/* Vocabulary Cards */}
          <div className="space-y-3">
            {getFilteredAndSortedList().map((item) => (
              <Card key={item.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {visibleColumns.includes('word') && (
                            <h3 
                              className="font-medium cursor-pointer hover:text-blue-600"
                              onClick={() => speakWord(item.word)}
                            >
                              {item.word}
                            </h3>
                          )}
                          {visibleColumns.includes('pronunciation') && item.pronunciation && (
                            <span className="text-sm text-muted-foreground">{item.pronunciation}</span>
                          )}
                          {item.mastered && (
                            <Badge variant="default" className="bg-green-100 text-green-800">
                              ✓ Đã thuộc
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          {visibleColumns.includes('category') && (
                            <Badge className={getCategoryColor(item.category)}>
                              {item.category}
                            </Badge>
                          )}
                          {visibleColumns.includes('difficulty') && (
                            <Badge className={getDifficultyColor(item.difficulty)}>
                              {item.difficulty === 'easy' ? 'Dễ' : item.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                            </Badge>
                          )}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setEditingItem(item)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteWord(item.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {visibleColumns.includes('meaning') && (
                        <p className="text-sm text-muted-foreground mb-2">{item.meaning}</p>
                      )}

                      {visibleColumns.includes('examples') && item.examples.length > 0 && (
                        <div className="space-y-1">
                          {item.examples.map((example, index) => (
                            <div key={example.id} className="text-sm">
                              <p className="italic">"{example.sentence}"</p>
                              {example.translation && (
                                <p className="text-muted-foreground">→ {example.translation}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between mt-3 pt-2 border-t text-xs text-muted-foreground">
                        <span>Đã ôn: {item.reviewCount} lần</span>
                        <span>Thêm: {item.dateAdded}</span>
                        {item.lastReviewed && (
                          <span>Ôn cuối: {item.lastReviewed}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {getFilteredAndSortedList().length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <p>Không tìm thấy từ vựng nào phù hợp.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Word Dialog */}
      <EditWordDialog
        editingItem={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleEditWord}
        categories={categories}
      />
    </div>
  );
}