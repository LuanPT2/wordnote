import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Folder } from 'lucide-react';
import { CategoryBrowser } from './CategoryBrowser';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CategoryManagerModal({ isOpen, onClose }: CategoryManagerModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Folder className="h-5 w-5 mr-2" />
            Quản lý Danh mục
          </DialogTitle>
        </DialogHeader>

        <div className="h-[70vh]">
          <CategoryBrowser />
        </div>
      </DialogContent>
    </Dialog>
  );
}