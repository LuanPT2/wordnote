import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { getCategories, getTopics } from '../../lib/vocabulary-data';

interface TopicMutiSelectorProps {
  type: 'category' | 'topic';
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function TopicMutiSelector({ 
  type, 
  selectedItems, 
  onSelectionChange, 
  trigger,
  className 
}: TopicMutiSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const categoriesData = getCategories();
  const topicsData = getTopics();
  
  const categories = categoriesData.map(c => c.name);
  const topics = topicsData.map(t => t.name);
  
  const items = type === 'category' ? categories : topics;
  const title = type === 'category' ? 'Chọn danh mục' : 'Chọn chủ đề';
  
  const handleToggle = (item: string) => {
    if (selectedItems.includes(item)) {
      onSelectionChange(selectedItems.filter(i => i !== item));
    } else {
      onSelectionChange([...selectedItems, item]);
    }
  };

  const handleSelectAll = () => {
    onSelectionChange(items);
  };

  const handleDeselectAll = () => {
    onSelectionChange([]);
  };

  const defaultTrigger = (
    <Button variant="outline" className={`justify-between ${className}`}>
      <span>
        {selectedItems.length === 0 
          ? `Chọn ${type === 'category' ? 'danh mục' : 'chủ đề'}`
          : selectedItems.length === items.length
          ? 'Tất cả'
          : `${selectedItems.length} đã chọn`
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Chọn {type === 'category' ? 'danh mục' : 'chủ đề'} mà bạn muốn áp dụng
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

          {/* Selected count */}
          <div className="text-sm text-muted-foreground">
            Đã chọn: {selectedItems.length}/{items.length}
          </div>

          {/* Items list */}
          <div className="space-y-2 max-h-64 overflow-y-auto border-2 border-blue-200 rounded-xl p-4 bg-gradient-to-br from-white to-blue-50">
            <div className="grid grid-cols-2 gap-2">
              {items.map((item) => {
                const isSelected = selectedItems.includes(item);
                const itemData = type === 'category' 
                  ? categoriesData.find(c => c.name === item)
                  : topicsData.find(t => t.name === item);
                const displayName = itemData?.description || item;
                
                return (
                  <button
                    key={item}
                    onClick={() => handleToggle(item)}
                    className={clsx(
                      'px-3 py-2 rounded-lg text-sm font-medium border transition-all duration-200 focus:outline-none transform hover:scale-105',
                      isSelected
                        ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50'
                    )}
                  >
                    {displayName}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected badges */}
          {selectedItems.length > 0 && (
            <div className="space-y-2 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
              <div className="text-sm font-medium text-blue-800 flex items-center space-x-2">
                <span>🎯</span>
                <span>Đã chọn:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {selectedItems.map((item) => {
                  const itemData = type === 'category' 
                    ? categoriesData.find(c => c.name === item)
                    : topicsData.find(t => t.name === item);
                  const displayName = itemData?.description || item;
                  
                  return (
                    <Badge 
                      key={item} 
                      variant="secondary"
                      className="cursor-pointer bg-blue-500 text-white hover:bg-red-500 transition-all duration-200 transform hover:scale-105"
                      onClick={() => handleToggle(item)}
                    >
                      {displayName} ✕
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              onClick={() => setOpen(false)}
              className="bg-green-500 text-white hover:bg-green-600 transition-all duration-200 transform hover:scale-105"
            >
              ✅ Xong ({selectedItems.length})
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}