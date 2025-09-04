import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Plus, X } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  parent?: string;
  fullPath: string; // ví dụ: "story.animal", "tự do.vietnam"
}

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: (categories: Category[]) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function CategoryManager({ categories, onCategoriesChange, trigger, className }: CategoryManagerProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedParent, setSelectedParent] = useState<string>('');

  // Lấy danh sách danh mục cha (không có parent)
  const getParentCategories = () => {
    return categories.filter(cat => !cat.parent);
  };

  // Lấy danh sách danh mục con theo parent
  const getChildCategories = (parentId: string) => {
    return categories.filter(cat => cat.parent === parentId);
  };

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newId = Date.now().toString();
    let fullPath = '';
    let newCategory: Category;

    if (selectedParent) {
      // Danh mục con
      const parent = categories.find(cat => cat.id === selectedParent);
      if (parent) {
        fullPath = `${parent.name}.${newCategoryName}`;
        newCategory = {
          id: newId,
          name: newCategoryName.trim(),
          parent: selectedParent,
          fullPath
        };
      } else {
        return;
      }
    } else {
      // Danh mục cha
      fullPath = newCategoryName.trim();
      newCategory = {
        id: newId,
        name: newCategoryName.trim(),
        fullPath
      };
    }

    // Kiểm tra trùng lặp
    const exists = categories.some(cat => cat.fullPath.toLowerCase() === fullPath.toLowerCase());
    if (exists) {
      alert('Danh mục này đã tồn tại!');
      return;
    }

    onCategoriesChange([...categories, newCategory]);
    setNewCategoryName('');
    setSelectedParent('');
  };

  const deleteCategory = (categoryId: string) => {
    // Xóa danh mục và tất cả danh mục con của nó
    const toDelete = [categoryId];
    const childrenToDelete = categories.filter(cat => cat.parent === categoryId).map(cat => cat.id);
    toDelete.push(...childrenToDelete);

    const filtered = categories.filter(cat => !toDelete.includes(cat.id));
    onCategoriesChange(filtered);
  };

  const defaultTrigger = (
    <Button type="button" variant="outline" size="sm" className={className}>
      <Plus className="h-4 w-4 mr-2" />
      Quản lý danh mục
    </Button>
  );

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Quản lý danh mục</DialogTitle>
          <DialogDescription>
            Thêm, sửa, xóa danh mục. Bạn có thể tạo danh mục cha và danh mục con (ví dụ: story.animal)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Form thêm danh mục mới */}
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <h4 className="font-medium">Thêm danh mục mới</h4>
            
            <div>
              <label className="block text-sm mb-2">Danh mục cha (tùy chọn)</label>
              <Select value={selectedParent} onValueChange={setSelectedParent}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn danh mục cha (để trống nếu tạo danh mục cha mới)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Không chọn (tạo danh mục cha)</SelectItem>
                  {getParentCategories().map((parent) => (
                    <SelectItem key={parent.id} value={parent.id}>
                      {parent.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm mb-2">
                Tên danh mục {selectedParent ? 'con' : 'cha'}
              </label>
              <Input
                placeholder={selectedParent ? "Ví dụ: animal, vietnam" : "Ví dụ: story, tự do"}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    addCategory();
                  }
                }}
              />
              {selectedParent && (
                <p className="text-xs text-muted-foreground mt-1">
                  Đường dẫn sẽ là: {categories.find(c => c.id === selectedParent)?.name}.{newCategoryName}
                </p>
              )}
            </div>

            <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Thêm danh mục
            </Button>
          </div>

          {/* Danh sách danh mục hiện có */}
          <div className="space-y-4">
            <h4 className="font-medium">Danh mục hiện có</h4>
            
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {getParentCategories().map((parent) => (
                <div key={parent.id} className="space-y-2">
                  {/* Danh mục cha */}
                  <div className="flex items-center justify-between p-3 bg-white border rounded-lg">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium text-blue-600">📁 {parent.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({getChildCategories(parent.id).length} danh mục con)
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteCategory(parent.id)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Danh mục con */}
                  {getChildCategories(parent.id).map((child) => (
                    <div key={child.id} className="flex items-center justify-between p-2 ml-6 bg-gray-50 border rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">📄 {child.fullPath}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCategory(child.id)}
                        className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              ))}

              {/* Danh mục cha không có con */}
              {categories.filter(cat => !cat.parent && getChildCategories(cat.id).length === 0).length === 0 && 
               getParentCategories().length === 0 && (
                <p className="text-center text-muted-foreground py-8">
                  Chưa có danh mục nào. Hãy thêm danh mục mới.
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowDialog(false)}>
              Đóng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Default categories để sử dụng trong các components
export const defaultCategories: Category[] = [
  { id: '1', name: 'Đang ôn', fullPath: 'Đang ôn' },
  { id: '2', name: 'Đã thuộc', fullPath: 'Đã thuộc' },
  { id: '3', name: 'Toeic', fullPath: 'Toeic' },
  { id: '4', name: 'story', fullPath: 'story' },
  { id: '5', name: 'animal', parent: '4', fullPath: 'story.animal' },
  { id: '6', name: 'Harrypotter', parent: '4', fullPath: 'story.Harrypotter' },
  { id: '7', name: 'tự do', fullPath: 'tự do' },
  { id: '8', name: 'vietnam', parent: '7', fullPath: 'tự do.vietnam' }
];