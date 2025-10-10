import React from 'react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { ScrollArea } from '../../ui/scroll-area';
import { Folder, MoveRight, X } from 'lucide-react';
import { VocabularyItem } from '../../../lib/vocabulary-types';

interface DropdownOption {
  id: string;
  name: string;
  level: number;
}

interface CategoryMovePopupProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  selectedCount: number;
  selectedVocabItems: VocabularyItem[];
  dropdownOptions: DropdownOption[];
  targetCategoryId: string;
  onTargetCategoryChange: (id: string) => void;
}

// Popup for moving selected vocabulary to another category
// Keep UI consistent with the inline dialog previously used in CategoryBrowser
export function CategoryMovePopup({
  open,
  onClose,
  onConfirm,
  selectedCount,
  selectedVocabItems,
  dropdownOptions,
  targetCategoryId,
  onTargetCategoryChange,
}: CategoryMovePopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background border rounded-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center text-lg font-semibold">
              <MoveRight className="h-5 w-5 mr-2" />
              Di chuyển từ vựng
            </h3>
            <button
              aria-label="Close"
              className="opacity-90 hover:opacity-100"
              onClick={onClose}
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            Di chuyển {selectedCount} từ vựng được chọn
          </p>
        </div>

        <div className="p-4">
          {/* Preview selected vocabulary */}
          <div className="mb-4 p-3 bg-muted rounded-lg">
            <h4 className="text-sm font-medium mb-2">Từ vựng được chọn:</h4>
            <ScrollArea className="h-48">
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
              value={targetCategoryId}
              onChange={(e) => onTargetCategoryChange(e.target.value)}
              className="w-full p-2 border rounded-lg bg-background focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              <option value="">-- Chọn danh mục --</option>
              {dropdownOptions.map(cat => (
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
              onClick={onConfirm}
              disabled={!targetCategoryId}
              className="flex-1"
            >
              Di chuyển
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryMovePopup;


