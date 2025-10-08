import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from './ui/dialog';
import { Folder } from 'lucide-react';
import { CategoryBrowser } from './CategoryBrowser';
import { Category, VocabularyItem } from '../lib/vocabulary-types';

interface CategoryManagerProps {
  trigger?: React.ReactNode;
  onCategorySelect?: (category: Category | null) => void;
  onVocabularySelect?: (vocabulary: VocabularyItem[]) => void;
  className?: string;
}

export function CategoryManager({ 
  trigger, 
  onCategorySelect, 
  onVocabularySelect, 
  className 
}: CategoryManagerProps) {
  const [showDialog, setShowDialog] = useState(false);

  const defaultTrigger = (
    <Button type="button" variant="outline" size="sm" className={className}>
      <Folder className="h-4 w-4 mr-2" />
      Quản lý danh mục
    </Button>
  );

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Folder className="h-5 w-5 mr-2" />
            Quản lý Danh mục
          </DialogTitle>
          <DialogDescription>
            Tạo, sửa, xóa danh mục và quản lý từ vựng theo danh mục
          </DialogDescription>
        </DialogHeader>

        <div className="h-[70vh]">
          <CategoryBrowser 
            onCategorySelect={onCategorySelect}
            onVocabularySelect={onVocabularySelect}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}