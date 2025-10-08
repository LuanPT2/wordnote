import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Plus, X, Filter, Search, Eye, EyeOff, Edit, Trash2, MoreVertical, ChevronDown, ChevronUp, Volume2, FolderPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';
import { CategoryCreator } from './CategoryCreator';
import { VocabularyItem, Example, Category, VocabularyFilter, VocularySortOptions } from '../../lib/vocabulary-types';
import { vocabularyLibrary } from '../../lib/vocabulary-library';

interface VocabularyManagerProps {
  onItemAdded?: (item: VocabularyItem) => void;
  onItemUpdated?: (item: VocabularyItem) => void;
  onItemDeleted?: (itemId: string) => void;
  initialFilter?: VocabularyFilter;
  showHeader?: boolean;
  className?: string;
}

export function VocabularyManager({ 
  onItemAdded, 
  onItemUpdated, 
  onItemDeleted, 
  initialFilter = {},
  showHeader = true,
  className = ""
}: VocabularyManagerProps) {
  // Core data states
  const [vocabularyList, setVocabularyList] = useState<VocabularyItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  
  // Dialog states
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryCreator, setShowCategoryCreator] = useState(false);
  const [showMoveCategoryDialog, setShowMoveCategoryDialog] = useState(false);
  
  // Filter and search states
  const [searchTerm, setSearchTerm] = useState(initialFilter.searchTerm || '');
  const [showSearch, setShowSearch] = useState(false);
  const [filterCategoryList, setFilterCategoryList] = useState<string[]>(initialFilter.categories || []);
  const [filterDifficulty, setFilterDifficulty] = useState(initialFilter.difficulty || 'all');
  const [filterMastered, setFilterMastered] = useState(initialFilter.mastered || 'all');
  const [sortBy, setSortBy] = useState<VocularySortOptions['field']>('dateAdded');
  const [sortOrder, setSortOrder] = useState<VocularySortOptions['order']>('desc');
  
  // UI states
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(['word', 'pronunciation', 'meaning', 'examples']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  // Form states
  const [newWord, setNewWord] = useState({
    word: '',
    pronunciation: '',
    meaning: '',
    examples: [] as Example[],
    category: '',
    topic: 'general',
    difficulty: 'medium' as const
  });
  const [currentExample, setCurrentExample] = useState({ sentence: '', translation: '' });
  const [editingItem, setEditingItem] = useState<VocabularyItem | null>(null);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  // Update vocabulary list when library changes
  useEffect(() => {
    const filtered = vocabularyLibrary.filterVocabulary({
      searchTerm,
      categories: filterCategoryList.length > 0 ? filterCategoryList : undefined,
      difficulty: filterDifficulty === 'all' ? undefined : filterDifficulty,
      mastered: filterMastered === 'all' ? undefined : filterMastered
    });
    
    const sorted = vocabularyLibrary.sortVocabulary(filtered, { field: sortBy, order: sortOrder });
    setVocabularyList(sorted);
  }, [searchTerm, filterCategoryList, filterDifficulty, filterMastered, sortBy, sortOrder]);

  const loadData = () => {
    const allVocab = vocabularyLibrary.getAllVocabulary();
    const allCategories = vocabularyLibrary.getCategories();
    
    setVocabularyList(allVocab);
    setCategories(allCategories);
    
    // Set default category if none selected
    if (!newWord.category && allCategories.length > 0) {
      setNewWord(prev => ({ ...prev, category: allCategories[0].name }));
    }
  };

  // ========== Word Management ==========
  const handleAddWord = () => {
    if (!newWord.word || !newWord.meaning) return;

    try {
      const item = vocabularyLibrary.addVocabularyItem({
        word: newWord.word,
        pronunciation: newWord.pronunciation,
        meaning: newWord.meaning,
        examples: newWord.examples,
        category: newWord.category,
        topic: newWord.topic,
        difficulty: newWord.difficulty
      });

      loadData();
      onItemAdded?.(item);
      
      // Reset form
      setNewWord({
        word: '',
        pronunciation: '',
        meaning: '',
        examples: [],
        category: categories[0]?.name || '',
        topic: 'general',
        difficulty: 'medium'
      });
      setCurrentExample({ sentence: '', translation: '' });
      setShowAddDialog(false);
    } catch (error) {
      console.error('Error adding word:', error);
    }
  };

  const handleUpdateWord = () => {
    if (!editingItem) return;

    try {
      const updated = vocabularyLibrary.updateVocabularyItem(editingItem.id, editingItem);
      if (updated) {
        loadData();
        onItemUpdated?.(updated);
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Error updating word:', error);
    }
  };

  const handleDeleteWord = (id: string) => {
    try {
      const success = vocabularyLibrary.deleteVocabularyItem(id);
      if (success) {
        loadData();
        onItemDeleted?.(id);
      }
    } catch (error) {
      console.error('Error deleting word:', error);
    }
  };

  // ========== Example Management ==========
  const addExample = () => {
    if (!currentExample.sentence.trim()) return;

    const newExample: Example = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sentence: currentExample.sentence,
      translation: currentExample.translation
    };

    setNewWord(prev => ({
      ...prev,
      examples: [...prev.examples, newExample]
    }));
    
    setCurrentExample({ sentence: '', translation: '' });
  };

  const removeExample = (exampleId: string) => {
    setNewWord(prev => ({
      ...prev,
      examples: prev.examples.filter(ex => ex.id !== exampleId)
    }));
  };

  const addExampleToEditingItem = () => {
    if (!editingItem || !currentExample.sentence.trim()) return;

    const newExample: Example = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      sentence: currentExample.sentence,
      translation: currentExample.translation
    };

    setEditingItem(prev => prev ? ({
      ...prev,
      examples: [...prev.examples, newExample]
    }) : null);
    
    setCurrentExample({ sentence: '', translation: '' });
  };

  const removeExampleFromEditingItem = (exampleId: string) => {
    setEditingItem(prev => prev ? ({
      ...prev,
      examples: prev.examples.filter(ex => ex.id !== exampleId)
    }) : null);
  };

  // ========== Category Management ==========
  const handleCategoryCreated = (category: Category) => {
    setCategories(prev => [...prev, category]);
    
    // If this is the first category or no category is selected, set it as default
    if (!newWord.category) {
      setNewWord(prev => ({ ...prev, category: category.name }));
    }
  };

  // ========== Bulk Operations ==========
  const handleBulkDelete = () => {
    try {
      vocabularyLibrary.executeBulkOperation({
        type: 'delete',
        itemIds: selectedItems
      });
      
      loadData();
      setSelectedItems([]);
      setSelectAll(false);
      
      selectedItems.forEach(id => onItemDeleted?.(id));
    } catch (error) {
      console.error('Error bulk deleting:', error);
    }
  };

  const handleBulkMoveCategory = (newCategory: string) => {
    try {
      vocabularyLibrary.executeBulkOperation({
        type: 'move-category',
        itemIds: selectedItems,
        data: { category: newCategory }
      });
      
      loadData();
      setSelectedItems([]);
      setSelectAll(false);
      setShowMoveCategoryDialog(false);
    } catch (error) {
      console.error('Error bulk moving category:', error);
    }
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(vocabularyList.map(item => item.id));
    }
    setSelectAll(!selectAll);
  };

  const toggleItemSelection = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  // ========== Utility Functions ==========
  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    return vocabularyLibrary.getDifficultyColor(difficulty);
  };

  const getCategoryColor = (category: string) => {
    return vocabularyLibrary.getCategoryColor(category);
  };

  return (
    <div className={`bg-background ${className}`}>
      {/* Header */}
      {showHeader && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-lg font-medium">Quản lý từ vựng</h2>
              <p className="text-sm text-gray-600">
                {vocabularyList.length} từ • {vocabularyList.filter(v => v.mastered).length} đã thuộc
              </p>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCategoryCreator(true)}
              >
                <FolderPlus className="h-4 w-4 mr-2" />
                Danh mục
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Thêm từ vựng
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm từ vựng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="mb-4">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
            {filtersExpanded ? <ChevronUp className="h-4 w-4 ml-2" /> : <ChevronDown className="h-4 w-4 ml-2" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterMastered} onValueChange={setFilterMastered}>
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="mastered">Đã thuộc</SelectItem>
                <SelectItem value="not-mastered">Chưa thuộc</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Ngày thêm</SelectItem>
                <SelectItem value="word">Từ vựng</SelectItem>
                <SelectItem value="reviewCount">Số lần ôn</SelectItem>
                <SelectItem value="difficulty">Độ khó</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sortOrder} onValueChange={(value: any) => setSortOrder(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleContent>
      </Collapsible>

      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
          <span className="text-sm">Đã chọn {selectedItems.length} từ</span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => setShowMoveCategoryDialog(true)}>
              Chuyển danh mục
            </Button>
            <Button variant="destructive" size="sm" onClick={handleBulkDelete}>
              <Trash2 className="h-4 w-4 mr-1" />
              Xóa
            </Button>
          </div>
        </div>
      )}

      {/* Vocabulary List */}
      <div className="space-y-4">
        {vocabularyList.map((item) => (
          <Card key={item.id} className={`transition-colors ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleItemSelection(item.id)}
                  />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-medium">{item.word}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => speakWord(item.word)}
                        className="h-6 w-6 p-0"
                      >
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Badge className={getCategoryColor(item.category)}>
                        {item.category}
                      </Badge>
                      <Badge className={getDifficultyColor(item.difficulty)}>
                        {item.difficulty}
                      </Badge>
                      {item.mastered && (
                        <Badge className="bg-green-100 text-green-800">Đã thuộc</Badge>
                      )}
                    </div>
                    
                    {visibleColumns.includes('pronunciation') && (
                      <p className="text-gray-600 mb-1">{item.pronunciation}</p>
                    )}
                    
                    {visibleColumns.includes('meaning') && (
                      <p className="text-gray-700 mb-2">{item.meaning}</p>
                    )}
                    
                    {visibleColumns.includes('examples') && item.examples.length > 0 && (
                      <div className="space-y-1">
                        {item.examples.map((example) => (
                          <div key={example.id} className="text-sm">
                            <p className="italic">"{example.sentence}"</p>
                            {example.translation && (
                              <p className="text-gray-600">→ {example.translation}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>Ôn tập: {item.reviewCount} lần</span>
                      <span>Ngày thêm: {item.dateAdded}</span>
                      {item.lastReviewed && (
                        <span>Ôn lần cuối: {item.lastReviewed}</span>
                      )}
                    </div>
                  </div>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setEditingItem(item)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Chỉnh sửa
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
            </CardContent>
          </Card>
        ))}
      </div>

      {vocabularyList.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">Không có từ vựng nào phù hợp với bộ lọc</p>
        </div>
      )}

      {/* Add Word Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm từ vựng mới</DialogTitle>
            <DialogDescription>
              Nhập thông tin từ vựng mới bao gồm từ, phiên âm, nghĩa và ví dụ
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-2">Từ vựng *</label>
                <Input
                  placeholder="Nhập từ vựng..."
                  value={newWord.word}
                  onChange={(e) => setNewWord({...newWord, word: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm mb-2">Phiên âm</label>
                <Input
                  placeholder="/phiên âm/"
                  value={newWord.pronunciation}
                  onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">Dịch nghĩa *</label>
              <Textarea
                placeholder="Nhập nghĩa của từ..."
                value={newWord.meaning}
                onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
                rows={2}
              />
            </div>

            {/* Examples */}
            <div>
              <label className="block text-sm mb-2">Ví dụ</label>
              <div className="space-y-3">
                {newWord.examples.map((example, index) => (
                  <div key={example.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-sm font-medium">Ví dụ {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeExample(example.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm italic mb-1">"{example.sentence}"</p>
                    {example.translation && (
                      <p className="text-sm text-muted-foreground">→ {example.translation}</p>
                    )}
                  </div>
                ))}
                
                <div className="space-y-2">
                  <Input
                    placeholder="Nhập câu ví dụ..."
                    value={currentExample.sentence}
                    onChange={(e) => setCurrentExample({...currentExample, sentence: e.target.value})}
                  />
                  <Input
                    placeholder="Nhập bản dịch (tùy chọn)..."
                    value={currentExample.translation}
                    onChange={(e) => setCurrentExample({...currentExample, translation: e.target.value})}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addExample}
                    disabled={!currentExample.sentence.trim()}
                    className="w-full"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm ví dụ
                  </Button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm mb-2">Danh mục</label>
                <div className="flex space-x-2">
                  <Select value={newWord.category} onValueChange={(value) => setNewWord({...newWord, category: value})}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCategoryCreator(true)}
                    className="px-2"
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <Select value={newWord.topic} onValueChange={(value) => setNewWord({...newWord, topic: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Tổng quát</SelectItem>
                  <SelectItem value="academic">Học thuật</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="advanced">Nâng cao</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={newWord.difficulty} onValueChange={(value) => setNewWord({...newWord, difficulty: value as any})}>
                <SelectTrigger>
                  <SelectValue placeholder="Độ khó" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Dễ</SelectItem>
                  <SelectItem value="medium">Trung bình</SelectItem>
                  <SelectItem value="hard">Khó</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                Hủy
              </Button>
              <Button onClick={handleAddWord} disabled={!newWord.word || !newWord.meaning}>
                Thêm từ vựng
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Word Dialog */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa từ vựng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin từ vựng
            </DialogDescription>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Từ vựng *</label>
                  <Input
                    placeholder="Nhập từ vựng..."
                    value={editingItem.word}
                    onChange={(e) => setEditingItem({...editingItem, word: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Phiên âm</label>
                  <Input
                    placeholder="/phiên âm/"
                    value={editingItem.pronunciation}
                    onChange={(e) => setEditingItem({...editingItem, pronunciation: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Dịch nghĩa *</label>
                <Textarea
                  placeholder="Nhập nghĩa của từ..."
                  value={editingItem.meaning}
                  onChange={(e) => setEditingItem({...editingItem, meaning: e.target.value})}
                  rows={2}
                />
              </div>

              {/* Examples for editing */}
              <div>
                <label className="block text-sm mb-2">Ví dụ</label>
                <div className="space-y-3">
                  {editingItem.examples.map((example, index) => (
                    <div key={example.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium">Ví dụ {index + 1}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeExampleFromEditingItem(example.id)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                      <p className="text-sm italic mb-1">"{example.sentence}"</p>
                      {example.translation && (
                        <p className="text-sm text-muted-foreground">→ {example.translation}</p>
                      )}
                    </div>
                  ))}
                  
                  <div className="space-y-2">
                    <Input
                      placeholder="Nhập câu ví dụ..."
                      value={currentExample.sentence}
                      onChange={(e) => setCurrentExample({...currentExample, sentence: e.target.value})}
                    />
                    <Input
                      placeholder="Nhập bản dịch (tùy chọn)..."
                      value={currentExample.translation}
                      onChange={(e) => setCurrentExample({...currentExample, translation: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addExampleToEditingItem}
                      disabled={!currentExample.sentence.trim()}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Thêm ví dụ
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Select value={editingItem.category} onValueChange={(value) => setEditingItem({...editingItem, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={editingItem.topic} onValueChange={(value) => setEditingItem({...editingItem, topic: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chủ đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">Tổng quát</SelectItem>
                    <SelectItem value="academic">Học thuật</SelectItem>
                    <SelectItem value="business">Kinh doanh</SelectItem>
                    <SelectItem value="advanced">Nâng cao</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={editingItem.difficulty} onValueChange={(value) => setEditingItem({...editingItem, difficulty: value as any})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Độ khó" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Dễ</SelectItem>
                    <SelectItem value="medium">Trung bình</SelectItem>
                    <SelectItem value="hard">Khó</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setEditingItem(null)}>
                  Hủy
                </Button>
                <Button onClick={handleUpdateWord} disabled={!editingItem.word || !editingItem.meaning}>
                  Cập nhật
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Move Category Dialog */}
      <Dialog open={showMoveCategoryDialog} onOpenChange={setShowMoveCategoryDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chuyển danh mục</DialogTitle>
            <DialogDescription>
              Chọn danh mục mới cho {selectedItems.length} từ đã chọn
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Select onValueChange={handleBulkMoveCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Creator Dialog */}
      <CategoryCreator
        isOpen={showCategoryCreator}
        onClose={() => setShowCategoryCreator(false)}
        onCategoryCreated={handleCategoryCreated}
      />
    </div>
  );
}