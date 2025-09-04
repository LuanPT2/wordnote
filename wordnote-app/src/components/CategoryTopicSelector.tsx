import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import { ChevronDown } from 'lucide-react';

interface CategoryTopicSelectorProps {
  type: 'category' | 'topic';
  selectedItems: string[];
  onSelectionChange: (items: string[]) => void;
  trigger?: React.ReactNode;
  className?: string;
}

export function CategoryTopicSelector({ 
  type, 
  selectedItems, 
  onSelectionChange, 
  trigger,
  className 
}: CategoryTopicSelectorProps) {
  const [open, setOpen] = useState(false);
  
  const categories = ['Harry Potter', 'Luyện TOEIC', 'Daily', 'New', 'Business', 'Story'];
  const topics = ['general', 'academic', 'business', 'advanced', 'intermediate'];
  
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
              className="flex-1"
            >
              Chọn tất cả
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDeselectAll}
              className="flex-1"
            >
              Bỏ chọn tất cả
            </Button>
          </div>

          {/* Selected count */}
          <div className="text-sm text-muted-foreground">
            Đã chọn: {selectedItems.length}/{items.length}
          </div>

          {/* Items list */}
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  checked={selectedItems.includes(item)}
                  onCheckedChange={() => handleToggle(item)}
                />
                <span className="text-sm flex-1">{item}</span>
              </div>
            ))}
          </div>

          {/* Selected badges */}
          {selectedItems.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Đã chọn:</div>
              <div className="flex flex-wrap gap-1">
                {selectedItems.map((item) => (
                  <Badge 
                    key={item} 
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleToggle(item)}
                  >
                    {item} ×
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button onClick={() => setOpen(false)}>
              Xong
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}