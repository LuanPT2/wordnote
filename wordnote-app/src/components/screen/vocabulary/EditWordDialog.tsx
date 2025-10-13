import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { CategorySelector } from '../../common/CategorySelector';
import { TopicSelector } from '../../common/TopicSelector';

interface Example {
  id: string;
  sentence: string;
  translation: string;
}

interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: Example[];
  category: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  dateAdded: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

interface EditWordDialogProps {
  editingItem: VocabularyItem | null;
  onClose: () => void;
  onSave: (updatedItem: VocabularyItem) => void;
  categories: string[];
}

export function EditWordDialog({ editingItem, onClose, onSave, categories }: EditWordDialogProps) {
  const [formData, setFormData] = useState<VocabularyItem | null>(null);

  useEffect(() => {
    if (editingItem) {
      setFormData({ ...editingItem });
    }
  }, [editingItem]);

  const handleInputChange = (field: keyof VocabularyItem, value: string | boolean) => {
    if (formData) {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleExampleChange = (index: number, field: keyof Example, value: string) => {
    if (formData) {
      const updatedExamples = [...formData.examples];
      updatedExamples[index] = { ...updatedExamples[index], [field]: value };
      setFormData({ ...formData, examples: updatedExamples });
    }
  };

  const handleSave = () => {
    if (formData) {
      onSave(formData);
    }
  };

  if (!editingItem || !formData) return null;

  return (
    <Dialog open={!!editingItem} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa từ vựng</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="word">Từ vựng</Label>
            <Input
              id="word"
              value={formData.word}
              onChange={(e) => handleInputChange('word', e.target.value)}
              placeholder="Nhập từ vựng"
            />
          </div>
          <div>
            <Label htmlFor="pronunciation">Phát âm</Label>
            <Input
              id="pronunciation"
              value={formData.pronunciation}
              onChange={(e) => handleInputChange('pronunciation', e.target.value)}
              placeholder="Nhập phát âm (IPA)"
            />
          </div>
          <div>
            <Label htmlFor="meaning">Nghĩa</Label>
            <Input
              id="meaning"
              value={formData.meaning}
              onChange={(e) => handleInputChange('meaning', e.target.value)}
              placeholder="Nhập nghĩa"
            />
          </div>
          <div>
            <Label htmlFor="category">Danh mục</Label>
            <CategorySelector
              selectedCategories={formData.category ? [formData.category] : []}
              onSelectionChange={(selectedCategories) => {
                if (selectedCategories.length > 0) {
                  handleInputChange('category', selectedCategories[0]);
                }
              }}
              title="Chọn danh mục cho từ vựng"
              description="Chọn một danh mục để phân loại từ vựng này"
            />
          </div>
          <div>
            <Label htmlFor="topic">Chủ đề</Label>
            <TopicSelector
              type="topic"
              selectedItems={formData.topic ? [formData.topic] : []}
              onSelectionChange={(selectedTopics) => {
                if (selectedTopics.length > 0) {
                  handleInputChange('topic', selectedTopics[0]);
                }
              }}
            />
          </div>
          <div>
            <Label htmlFor="difficulty">Độ khó</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange('difficulty', value as 'easy' | 'medium' | 'hard')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Ví dụ</Label>
            {formData.examples.map((example, index) => (
              <div key={example.id} className="space-y-2 mt-2">
                <Input
                  value={example.sentence}
                  onChange={(e) => handleExampleChange(index, 'sentence', e.target.value)}
                  placeholder="Nhập câu ví dụ"
                />
                <Input
                  value={example.translation}
                  onChange={(e) => handleExampleChange(index, 'translation', e.target.value)}
                  placeholder="Nhập bản dịch"
                />
              </div>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="mastered"
              checked={formData.mastered}
              onChange={(e) => handleInputChange('mastered', e.target.checked)}
            />
            <Label htmlFor="mastered">Đã thuộc</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button onClick={handleSave}>Lưu</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}