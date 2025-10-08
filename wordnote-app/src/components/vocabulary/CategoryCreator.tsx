import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Folder, FolderPlus, Plus, X, ChevronRight } from 'lucide-react';
import { Category } from '../../lib/vocabulary-types';
import { vocabularyLibrary } from '../../lib/vocabulary-library';

interface CategoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
  selectedCategory?: string;
}

export function CategoryCreator({ isOpen, onClose, onCategoryCreated, selectedCategory }: CategoryCreatorProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    parentId: '',
    color: 'bg-blue-100 text-blue-800'
  });
  const [showAdvanced, setShowAdvanced] = useState(false);

  const colorOptions = [
    { value: 'bg-red-100 text-red-800', label: 'Đỏ', color: 'bg-red-100' },
    { value: 'bg-blue-100 text-blue-800', label: 'Xanh dương', color: 'bg-blue-100' },
    { value: 'bg-green-100 text-green-800', label: 'Xanh lá', color: 'bg-green-100' },
    { value: 'bg-yellow-100 text-yellow-800', label: 'Vàng', color: 'bg-yellow-100' },
    { value: 'bg-purple-100 text-purple-800', label: 'Tím', color: 'bg-purple-100' },
    { value: 'bg-orange-100 text-orange-800', label: 'Cam', color: 'bg-orange-100' },
    { value: 'bg-pink-100 text-pink-800', label: 'Hồng', color: 'bg-pink-100' },
    { value: 'bg-indigo-100 text-indigo-800', label: 'Chàm', color: 'bg-indigo-100' },
    { value: 'bg-gray-100 text-gray-800', label: 'Xám', color: 'bg-gray-100' }
  ];

  useEffect(() => {
    if (isOpen) {
      setCategories(vocabularyLibrary.getCategories());
      if (selectedCategory) {
        setNewCategory(prev => ({ ...prev, parentId: selectedCategory }));
      }
    }
  }, [isOpen, selectedCategory]);

  const handleCreateCategory = () => {
    if (!newCategory.name.trim()) return;

    try {
      const category = vocabularyLibrary.addCategory({
        name: newCategory.name.trim(),
        description: newCategory.description.trim(),
        parentId: newCategory.parentId || undefined,
        color: newCategory.color
      });

      onCategoryCreated(category);
      
      // Reset form
      setNewCategory({
        name: '',
        description: '',
        parentId: selectedCategory || '',
        color: 'bg-blue-100 text-blue-800'
      });
      
      onClose();
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const handleQuickCreate = (name: string) => {
    if (!name.trim()) return;

    try {
      const category = vocabularyLibrary.addCategory({
        name: name.trim(),
        description: '',
        parentId: selectedCategory || undefined,
        color: 'bg-blue-100 text-blue-800'
      });

      onCategoryCreated(category);
    } catch (error) {
      console.error('Error creating quick category:', error);
    }
  };

  const renderCategoryHierarchy = (cats: Category[], level = 0) => {
    const rootCategories = cats.filter(cat => !cat.parentId);
    const childCategories = (parentId: string) => cats.filter(cat => cat.parentId === parentId);

    return rootCategories.map(category => (
      <div key={category.id}>
        <div className={`flex items-center space-x-2 py-2 px-${level * 4}`}>
          {level > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          <Folder className="h-4 w-4 text-gray-500" />
          <Badge className={category.color}>{category.name}</Badge>
          {category.description && (
            <span className="text-sm text-gray-500">- {category.description}</span>
          )}
        </div>
        {childCategories(category.id).map(child => (
          <div key={child.id} className={`flex items-center space-x-2 py-1 px-${(level + 1) * 4}`}>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Folder className="h-4 w-4 text-gray-400" />
            <Badge className={child.color}>{child.name}</Badge>
            {child.description && (
              <span className="text-sm text-gray-500">- {child.description}</span>
            )}
          </div>
        ))}
      </div>
    ));
  };

  const getParentCategories = () => {
    return categories.filter(cat => !cat.parentId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <FolderPlus className="h-5 w-5" />
            <span>Tạo danh mục mới</span>
          </DialogTitle>
          <DialogDescription>
            Tạo danh mục để tổ chức từ vựng theo chủ đề hoặc mục đích học tập
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Quick Category Creation */}
          <div className="space-y-3">
            <h3 className="font-medium">Tạo nhanh danh mục</h3>
            <div className="grid grid-cols-2 gap-2">
              {['Từ mới hôm nay', 'Từ khó', 'Cần ôn tập', 'Thi IELTS', 'Conversation', 'Reading'].map((name) => (
                <Button
                  key={name}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickCreate(name)}
                  className="justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {name}
                </Button>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium">Tạo danh mục tùy chỉnh</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAdvanced(!showAdvanced)}
              >
                {showAdvanced ? 'Ẩn tùy chọn' : 'Tùy chọn nâng cao'}
              </Button>
            </div>

            <div className="space-y-4">
              {/* Category Name */}
              <div>
                <label className="block text-sm mb-2">Tên danh mục *</label>
                <Input
                  placeholder="Ví dụ: Từ vựng IELTS Speaking..."
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
              </div>

              {/* Parent Category */}
              {showAdvanced && (
                <>
                  <div>
                    <label className="block text-sm mb-2">Danh mục cha (tùy chọn)</label>
                    <Select 
                      value={newCategory.parentId} 
                      onValueChange={(value) => setNewCategory({ ...newCategory, parentId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục cha..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Không có danh mục cha</SelectItem>
                        {getParentCategories().map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm mb-2">Mô tả (tùy chọn)</label>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về danh mục này..."
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      rows={2}
                    />
                  </div>

                  {/* Color Selection */}
                  <div>
                    <label className="block text-sm mb-2">Màu sắc</label>
                    <div className="grid grid-cols-3 gap-2">
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setNewCategory({ ...newCategory, color: option.value })}
                          className={`flex items-center space-x-2 p-2 rounded border ${
                            newCategory.color === option.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                          }`}
                        >
                          <div className={`w-4 h-4 rounded ${option.color}`} />
                          <span className="text-sm">{option.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Preview */}
              {newCategory.name && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Xem trước:</div>
                  <div className="flex items-center space-x-2">
                    <Folder className="h-4 w-4 text-gray-500" />
                    <Badge className={newCategory.color}>{newCategory.name}</Badge>
                    {newCategory.description && (
                      <span className="text-sm text-gray-500">- {newCategory.description}</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Existing Categories */}
          {categories.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Danh mục hiện có</h3>
              <div className="max-h-40 overflow-y-auto space-y-1">
                {renderCategoryHierarchy(categories)}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button 
              onClick={handleCreateCategory} 
              disabled={!newCategory.name.trim()}
            >
              Tạo danh mục
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}