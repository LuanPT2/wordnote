import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { ChevronDown, ChevronRight, Folder, FolderOpen, FileText } from 'lucide-react';
import { vocabularyLibrary } from '../../lib/vocabulary-library';
import { Category } from '../../lib/vocabulary-types';
import { getCategories } from '../../lib/vocabulary-data';

interface CategoryNode extends Category {
  children: CategoryNode[];                   
  level: number;
  expanded?: boolean;
}

interface CategorySelectorProps {
  selectedCategories: string[];
  onSelectionChange: (categories: string[]) => void;
  trigger?: React.ReactNode;
  className?: string;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export function CategorySelector({ 
  selectedCategories, 
  onSelectionChange, 
  trigger,
  className,
  title = "Chọn danh mục",
  description = "Chọn các danh mục từ vựng mà bạn muốn áp dụng. Bạn có thể mở rộng các thư mục để xem danh mục con.",
  icon = <Folder className="h-5 w-5 text-blue-600" />
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTree, setCategoryTree] = useState<CategoryNode[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCategories();
  }, [open]);

  const loadCategories = async () => {
    try {
      const data = getCategories();
      setCategories(data);
      setCategoryTree(buildCategoryTree(data));
    } catch (error) {
      console.error('Error loading categories:', error);
      // Fallback to mock data
      const mockCategories: Category[] = [
        { id: '1', name: 'Harry Potter', color: '#ef4444' },
        { id: '2', name: 'Từ vựng cơ bản', color: '#22c55e', parentId: '1' },
        { id: '3', name: 'Từ vựng nâng cao', color: '#3b82f6', parentId: '1' },
        { id: '4', name: 'Luyện TOEIC', color: '#f59e0b' },
        { id: '5', name: 'Reading', color: '#06b6d4', parentId: '4' },
        { id: '6', name: 'Listening', color: '#8b5cf6', parentId: '4' },
        { id: '7', name: 'Speaking', color: '#ec4899', parentId: '4' },
        { id: '8', name: 'Daily Conversation', color: '#10b981' },
        { id: '9', name: 'Business English', color: '#f97316' },
        { id: '10', name: 'Meetings', color: '#84cc16', parentId: '9' },
        { id: '11', name: 'Presentations', color: '#6366f1', parentId: '9' },
        { id: '12', name: 'Academic Writing', color: '#8b5cf6' },
        { id: '13', name: 'Research Papers', color: '#06b6d4', parentId: '12' },
        { id: '14', name: 'Essay Writing', color: '#f59e0b', parentId: '12' }
      ];
      setCategories(mockCategories);
      setCategoryTree(buildCategoryTree(mockCategories));
    }
  };

  const buildCategoryTree = (cats: Category[]): CategoryNode[] => {
    const buildNode = (parentId?: string, level: number = 0): CategoryNode[] => {
      return cats
        .filter(cat => cat.parentId === parentId)
        .map(cat => ({
          ...cat,
          children: buildNode(cat.id, level + 1),
          level,
          expanded: expandedCategories.has(cat.id)
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    };
    
    return buildNode();
  };

  const toggleExpand = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
    setCategoryTree(buildCategoryTree(categories));
  };

  const handleToggle = (categoryName: string) => {
    if (selectedCategories.includes(categoryName)) {
      onSelectionChange(selectedCategories.filter(c => c !== categoryName));
    } else {
      onSelectionChange([...selectedCategories, categoryName]);
    }
  };

  const getAllCategoryNames = (nodes: CategoryNode[]): string[] => {
    let names: string[] = [];
    nodes.forEach(node => {
      names.push(node.name);
      if (node.children.length > 0) {
        names = names.concat(getAllCategoryNames(node.children));
      }
    });
    return names;
  };

  const handleSelectAll = () => {
    const allNames = getAllCategoryNames(categoryTree);
    onSelectionChange(allNames);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const expandAll = () => {
    const allIds = categories.map(c => c.id);
    setExpandedCategories(new Set(allIds));
    setCategoryTree(buildCategoryTree(categories));
  };

  const collapseAll = () => {
    setExpandedCategories(new Set());
    setCategoryTree(buildCategoryTree(categories));
  };

  const renderCategoryTree = (nodes: CategoryNode[]): React.ReactNode => {
    return nodes.map(node => {
      const hasChildren = node.children.length > 0;
      const isExpanded = expandedCategories.has(node.id);
      const isSelected = selectedCategories.includes(node.name);
      
      return (
        <div key={node.id} className="space-y-1">
          <div 
            className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors ${isSelected ? 'bg-primary/5' : ''}`}
            style={{ paddingLeft: `${node.level * 16 + 8}px` }}
          >
            {hasChildren ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleExpand(node.id)}
                className="h-6 w-6 p-0 hover:bg-transparent"
              >
                {isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )}
              </Button>
            ) : (
              <div className="h-6 w-6" />
            )}
            
            {hasChildren ? (
              isExpanded ? <FolderOpen className="h-4 w-4 text-muted-foreground" /> : <Folder className="h-4 w-4 text-muted-foreground" />
            ) : (
              <FileText className="h-4 w-4 mr-2 text-muted-foreground" />
            )}
            
            <Checkbox
              checked={isSelected}
              onCheckedChange={() => handleToggle(node.name)}
              className="data-[state=checked]:bg-primary"
            />
            
            <span 
              className={`text-sm flex-1 cursor-pointer ${isSelected ? 'font-medium text-primary' : 'text-foreground'}`}
              onClick={() => handleToggle(node.name)}
            >
              {node.name}
            </span>
          </div>
          
          {hasChildren && isExpanded && (
            <div className="space-y-1">
              {renderCategoryTree(node.children)}
            </div>
          )}
        </div>
      );
    });
  };

  const defaultTrigger = (
    <Button variant="outline" className={`justify-between ${className}`}>
      <span>
        {selectedCategories.length === 0 
          ? 'Chọn danh mục'
          : selectedCategories.length === getAllCategoryNames(categoryTree).length
          ? 'Tất cả danh mục'
          : `${selectedCategories.length} danh mục`
        }
      </span>
      <ChevronDown className="h-4 w-4" />
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            {icon}
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Quick actions */}
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSelectAll}
              className="flex-1 bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 transition-all duration-200"
            >
              ✨ Chọn tất cả
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeselectAll}
              className="flex-1 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 transition-all duration-200"
            >
              🗑️ Bỏ chọn tất cả
            </Button>
          </div>

          {/* Selected count and expand controls */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Đã chọn: {selectedCategories.length}/{getAllCategoryNames(categoryTree).length}
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={expandAll}
                className="text-xs bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
              >
                📂 Mở rộng tất cả
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={collapseAll}
                className="text-xs bg-purple-500 text-white hover:bg-purple-600 transition-all duration-200"
              >
                📁 Thu gọn tất cả
              </Button>
            </div>
          </div>

          {/* Category tree */}
          <ScrollArea className="h-[300px] border-2 border-gradient-to-r from-blue-200 to-purple-200 rounded-xl p-4 bg-gradient-to-br from-white to-blue-50">
            <div className="space-y-1">
              {categoryTree.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
                    <Folder className="h-8 w-8 text-blue-500" />
                  </div>
                  <p className="text-lg font-medium">Chưa có danh mục nào</p>
                  <p className="text-sm text-gray-500">Hãy thêm danh mục để bắt đầu</p>
                </div>
              ) : (
                renderCategoryTree(categoryTree)
              )}
            </div>
          </ScrollArea>

          {/* Selected badges */}
          {selectedCategories.length > 0 && (
            <div className="space-y-2 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="text-sm font-medium text-green-800 flex items-center space-x-2">
                <span>🎯</span>
                <span>Danh mục đã chọn:</span>
              </div>
              <ScrollArea className="max-h-24">
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.map((category) => (
                    <Badge 
                      key={category} 
                      variant="secondary"
                      className="cursor-pointer bg-green-500 text-white hover:bg-red-500 transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleToggle(category)}
                    >
                      {category} ✕
                    </Badge>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button 
              onClick={() => setOpen(false)}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              Xong ({selectedCategories.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}