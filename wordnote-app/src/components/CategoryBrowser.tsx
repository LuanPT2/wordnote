import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import { Checkbox } from './ui/checkbox';
import { 
  Folder, 
  FolderOpen, 
  Plus, 
  Save, 
  X, 
  MoveRight,
  FileText,
  Trash2
} from 'lucide-react';
import { vocabularyLibrary } from '../lib/vocabulary-library';
import { Category, VocabularyItem } from '../lib/vocabulary-types';

interface CategoryNode extends Category {
  children: CategoryNode[];
  vocabularyCount: number;
  level: number;
}

interface CategoryBrowserProps {
  onCategorySelect?: (category: Category | null) => void;
  onVocabularySelect?: (vocabulary: VocabularyItem[]) => void;
  className?: string;
}

const COLOR_OPTIONS = [
  'bg-red-100 text-red-800',
  'bg-green-100 text-green-800', 
  'bg-blue-100 text-blue-800',
  'bg-yellow-100 text-yellow-800',
  'bg-purple-100 text-purple-800',
  'bg-pink-100 text-pink-800',
  'bg-orange-100 text-orange-800',
  'bg-indigo-100 text-indigo-800',
  'bg-gray-100 text-gray-800'
];

export function CategoryBrowser({ onCategorySelect, onVocabularySelect, className = '' }: CategoryBrowserProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedVocabulary, setSelectedVocabulary] = useState<Set<string>>(new Set());
  
  // Create/Edit states
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editCategoryName, setEditCategoryName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  // Move vocabulary states
  const [showMoveDialog, setShowMoveDialog] = useState(false);
  const [targetCategoryForMove, setTargetCategoryForMove] = useState('');

  // Modal states for create/edit
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    buildCategoryTree();
  }, [categories, vocabulary, expandedCategories]);

  useEffect(() => {
    // Default: show all vocabulary when no category is selected
    if (!selectedCategory) {
      onVocabularySelect?.(vocabulary);
    }
  }, [vocabulary, selectedCategory, onVocabularySelect]);

  const loadData = () => {
    const cats = vocabularyLibrary.getCategories();
    const vocab = vocabularyLibrary.getAllVocabulary();
    setCategories(cats);
    setVocabulary(vocab);
  };

  const buildCategoryTree = () => {
    const buildTree = (parentId?: string, level: number = 0): CategoryNode[] => {
      return categories
        .filter(cat => cat.parentId === parentId)
        .map(cat => {
          const vocabularyCount = vocabulary.filter(v => v.category === cat.name).length;
          const children = buildTree(cat.id, level + 1);
          return {
            ...cat,
            children,
            vocabularyCount,
            level
          };
        })
        .sort((a, b) => a.name.localeCompare(b.name));
    };

    setCategoryTree(buildTree());
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const handleCategoryClick = (category: CategoryNode) => {
    // If has children, toggle expand
    if (category.children.length > 0) {
      toggleCategory(category.id);
    }
    
    // Always select the category to show its vocabulary
    setSelectedCategory(category);
    onCategorySelect?.(category);
    
    // Get vocabulary for this category
    const categoryVocab = vocabulary.filter(v => v.category === category.name);
    onVocabularySelect?.(categoryVocab);
  };

  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    vocabularyLibrary.addCategory({
      name: newCategoryName.trim(),
      color: selectedColor,
      parentId: selectedCategory?.id
    });
    
    setNewCategoryName('');
    setShowCategoryModal(false);
    loadData();
  };

  const handleEditCategory = () => {
    if (!editCategoryName.trim() || !selectedCategory) return;
    
    vocabularyLibrary.updateCategory(selectedCategory.id, {
      name: editCategoryName.trim(),
      color: selectedColor
    });
    
    setEditCategoryName('');
    setShowCategoryModal(false);
    loadData();
  };

  const openCreateModal = () => {
    setModalMode('create');
    setNewCategoryName('');
    setSelectedColor(COLOR_OPTIONS[0]);
    setShowCategoryModal(true);
  };

  const openEditModal = () => {
    if (!selectedCategory) return;
    setModalMode('edit');
    setEditCategoryName(selectedCategory.name);
    setSelectedColor(selectedCategory.color || COLOR_OPTIONS[0]);
    setShowCategoryModal(true);
  };

  const handleDeleteCategory = () => {
    if (!selectedCategory) return;
    
    if (confirm(`Bạn có chắc chắn muốn xóa danh mục "${selectedCategory.name}"? Tất cả từ vựng trong danh mục này sẽ được chuyển về danh mục gốc.`)) {
      vocabularyLibrary.deleteCategory(selectedCategory.id);
      setSelectedCategory(null);
      loadData();
    }
  };

  // Helper function to build hierarchical category list for dropdown
  const buildCategoryDropdownList = () => {
    const buildList = (parentId?: string, level: number = 0): Array<{id: string, name: string, level: number}> => {
      const children = categories
        .filter(cat => cat.parentId === parentId && cat.name !== selectedCategory?.name)
        .sort((a, b) => a.name.localeCompare(b.name));
      
      let result: Array<{id: string, name: string, level: number}> = [];
      
      children.forEach(cat => {
        result.push({
          id: cat.id,
          name: cat.name,
          level
        });
        
        // Add children recursively
        const grandChildren = buildList(cat.id, level + 1);
        result = result.concat(grandChildren);
      });
      
      return result;
    };

    return buildList();
  };

  const handleVocabularySelect = (vocabId: string, checked: boolean) => {
    const newSelected = new Set(selectedVocabulary);
    if (checked) {
      newSelected.add(vocabId);
    } else {
      newSelected.delete(vocabId);
    }
    setSelectedVocabulary(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    const currentVocabulary = selectedCategory 
      ? vocabulary.filter(v => v.category === selectedCategory.name)
      : vocabulary;
    
    if (checked) {
      const allIds = new Set(currentVocabulary.map(v => v.id));
      setSelectedVocabulary(allIds);
    } else {
      setSelectedVocabulary(new Set());
    }
  };

  const handleMoveVocabulary = () => {
    if (!targetCategoryForMove || selectedVocabulary.size === 0) return;
    
    const targetCategory = categories.find(cat => cat.id === targetCategoryForMove);
    if (!targetCategory) return;

    vocabularyLibrary.executeBulkOperation({
      type: 'move-category',
      itemIds: Array.from(selectedVocabulary),
      data: { category: targetCategory.name }
    });

    setSelectedVocabulary(new Set());
    setShowMoveDialog(false);
    setTargetCategoryForMove('');
    loadData();
  };

  const renderCategoryTree = (nodes: CategoryNode[]): React.ReactNode => {
    return nodes.map(node => {
      const isExpanded = expandedCategories.has(node.id);
      const hasChildren = node.children.length > 0;
      const isSelected = selectedCategory?.id === node.id;

      return (
        <div key={node.id}>
          <div 
            className={`flex items-center py-2 px-3 cursor-pointer hover:bg-muted/50 rounded-lg transition-colors ${
              isSelected ? 'bg-primary/10 border border-primary/20' : ''
            }`}
            onClick={() => handleCategoryClick(node)}
            style={{ paddingLeft: `${12 + node.level * 10}px` }}
          >
            {hasChildren ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 mr-2 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 mr-2 text-muted-foreground" />
              )
            ) : (
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm">{node.name}</span>
                <Badge className={`text-xs ${node.color || 'bg-gray-100 text-gray-800'}`}>
                  {node.vocabularyCount}
                </Badge>
              </div>
            </div>
          </div>
          
          {hasChildren && isExpanded && (
            <div>
              {renderCategoryTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  const renderVocabularyList = () => {
    const currentVocabulary = selectedCategory 
      ? vocabulary.filter(v => v.category === selectedCategory.name)
      : vocabulary;
    
    if (currentVocabulary.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{selectedCategory ? 'Không có từ vựng nào trong danh mục này' : 'Chưa có từ vựng nào'}</p>
        </div>
      );
    }

    const isAllSelected = currentVocabulary.length > 0 && 
      currentVocabulary.every(v => selectedVocabulary.has(v.id));
    const isIndeterminate = !isAllSelected && 
      currentVocabulary.some(v => selectedVocabulary.has(v.id));

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-4">
          {selectedVocabulary.size > 0 && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowMoveDialog(true)}
              className="flex items-center"
            >
              <MoveRight className="h-4 w-4 mr-1" />
              Di chuyển
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <Checkbox
            checked={isAllSelected}
            indeterminate={isIndeterminate}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm">
            Chọn tất cả {`(${selectedVocabulary.size}/${currentVocabulary.length})`}
          </span>
        </div>

        <ScrollArea className="h-[450px]">
          <div className="space-y-1">
            {currentVocabulary.map(item => (
              <div 
                key={item.id}
                className="flex items-center space-x-3 p-2 border rounded-lg hover:bg-muted/50"
              >
                <Checkbox
                  checked={selectedVocabulary.has(item.id)}
                  onCheckedChange={(checked) => handleVocabularySelect(item.id, checked as boolean)}
                />
                <div className="flex-1">
                  <span className="font-medium">{item.word}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    );
  };

  const renderCategoryModal = () => {
    if (!showCategoryModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-background border rounded-lg w-full max-w-lg max-h-[90vh] overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
            <h3 className="flex items-center text-xl font-semibold">
              {modalMode === 'create' ? (
                <>
                  <Plus className="h-6 w-6 mr-3" />
                  Tạo danh mục mới
                </>
              ) : (
                <>
                  <Folder className="h-6 w-6 mr-3" />
                  Sửa danh mục
                </>
              )}
            </h3>
            <p className="text-green-100 text-sm mt-2">
              {modalMode === 'create' 
                ? (selectedCategory 
                    ? `Tạo danh mục con trong "${selectedCategory.name}"` 
                    : 'Tạo danh mục gốc mới')
                : `Chỉnh sửa danh mục "${selectedCategory?.name}"`
              }
            </p>
          </div>
          
          <div className="p-6">
            <div className="space-y-6">
              {/* Category Name Input */}
              <div>
                <label className="block text-sm font-medium mb-3">
                  {modalMode === 'create' ? 'Tên danh mục mới' : 'Tên danh mục'}
                </label>
                <Input
                  value={modalMode === 'create' ? newCategoryName : editCategoryName}
                  onChange={(e) => modalMode === 'create' 
                    ? setNewCategoryName(e.target.value) 
                    : setEditCategoryName(e.target.value)
                  }
                  placeholder="Nhập tên danh mục"
                  className="text-lg p-4"
                />
              </div>

              {/* Color Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Màu sắc</label>
                <div className="grid grid-cols-5 gap-3">
                  {COLOR_OPTIONS.map(color => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-xl border-4 ${color} ${
                        selectedColor === color ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                      } hover:scale-105 transition-transform`}
                    />
                  ))}
                </div>
              </div>

              {/* Preview */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="text-sm font-medium mb-2">Xem trước:</h4>
                <div className="flex items-center space-x-2">
                  <Folder className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">
                    {modalMode === 'create' ? newCategoryName || 'Tên danh mục...' : editCategoryName}
                  </span>
                  <Badge className={`text-xs ${selectedColor}`}>
                    0
                  </Badge>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <Button
                  onClick={modalMode === 'create' ? handleCreateCategory : handleEditCategory}
                  disabled={modalMode === 'create' ? !newCategoryName.trim() : !editCategoryName.trim()}
                  className="flex-1 py-3"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {modalMode === 'create' ? 'Tạo danh mục' : 'Lưu thay đổi'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 py-3"
                >
                  <X className="h-4 w-4 mr-2" />
                  Hủy
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMoveDialog = () => {
    if (!showMoveDialog) return null;

    const selectedVocabItems = vocabulary.filter(v => selectedVocabulary.has(v.id));

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-background border rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <h3 className="flex items-center text-lg font-semibold">
              <MoveRight className="h-5 w-5 mr-2" />
              Di chuyển từ vựng
            </h3>
            <p className="text-blue-100 text-sm mt-1">
              Di chuyển {selectedVocabulary.size} từ vựng được chọn
            </p>
          </div>
          
          <div className="p-4">
            {/* Preview selected vocabulary */}
            <div className="mb-4 p-3 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Từ vựng được chọn:</h4>
              <ScrollArea className="max-h-[120px]">
                <div className="space-y-1">
                  {selectedVocabItems.map(item => (
                    <div key={item.id} className="text-xs text-muted-foreground">
                      • {item.word}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Chọn danh mục đích:
              </label>
              <select
                value={targetCategoryForMove}
                onChange={(e) => setTargetCategoryForMove(e.target.value)}
                className="w-full p-2 border rounded-lg bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="">-- Chọn danh mục --</option>
                {buildCategoryDropdownList().map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {'  '.repeat(cat.level)}
                    {cat.level > 0 ? '└─ ' : ''}
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <Button
                onClick={handleMoveVocabulary}
                disabled={!targetCategoryForMove}
                className="flex-1"
              >
                Di chuyển
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowMoveDialog(false);
                  setTargetCategoryForMove('');
                }}
                className="flex-1"
              >
                Hủy
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`flex h-full ${className}`}>
      {/* Left Panel - Category Tree */}
      <div className="w-1/2 pr-4 border-r">
        <div className="flex items-center justify-between mb-4">
          <div className="flex space-x-2">
            {selectedCategory && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openEditModal}
                >
                  Sửa
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleDeleteCategory}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button
              size="sm"
              onClick={openCreateModal}
            >
              <Plus className="h-4 w-4 mr-1" />
            </Button>
          </div>
        </div>



        <ScrollArea className="h-[500px]">
          {categoryTree.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có danh mục nào</p>
            </div>
          ) : (
            <div className="space-y-1">
              {renderCategoryTree(categoryTree)}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Right Panel - Vocabulary List */}
      <div className="w-1/2 pl-4">
        {renderVocabularyList()}
      </div>

      {renderMoveDialog()}
      {renderCategoryModal()}
    </div>
  );
}