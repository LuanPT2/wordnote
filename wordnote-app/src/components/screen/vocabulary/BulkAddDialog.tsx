import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus } from 'lucide-react';
import { VocabularyItem } from './VocabularyScreen';
import { CategorySelector } from '../../common/CategorySelector';
import { TopicMutiSelector } from '../../common/TopicMutiSelector';

interface BulkAddDialogProps {
  categories: string[];
  setVocabularyList: React.Dispatch<React.SetStateAction<VocabularyItem[]>>;
  setCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export function BulkAddDialog({ categories, setVocabularyList, setCategories }: BulkAddDialogProps) {
  const [showBulkDialog, setShowBulkDialog] = useState(false);
  const [bulkText, setBulkText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [suggestedWords] = useState<string[]>([
    'enchanting', 'mystical', 'wondrous', 'magical', 'spellbinding'
  ]);

  const processBulkAdd = () => {
    const lines = bulkText.split('\n').filter(line => line.trim());
    const newWords: VocabularyItem[] = [];
    
    lines.forEach(line => {
      const parts = line.split('|').map(part => part.trim());
      if (parts.length >= 2) {
        const word = parts[0];
        const meaning = parts[1];
        const pronunciation = parts[2] || '';
        
        newWords.push({
          id: (Date.now() + Math.random()).toString(),
          word,
          pronunciation,
          meaning,
          examples: [],
          category: selectedCategory || categories[0] || 'Harry Potter',
          topic: selectedTopic || 'general',
          difficulty: 'medium',
          dateAdded: new Date().toISOString().split('T')[0],
          mastered: false,
          reviewCount: 0
        });
      }
    });
    
    setVocabularyList(prev => [...newWords, ...prev]);
    setBulkText('');
    setShowBulkDialog(false);
  };

  return (
    <Dialog open={showBulkDialog} onOpenChange={setShowBulkDialog}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhiều
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-white shadow-2xl">
        <DialogHeader>
          <DialogTitle>Thêm nhiều từ vựng</DialogTitle>
          <DialogDescription>
            Nhập nhiều từ vựng cùng lúc, mỗi dòng một từ theo định dạng: từ | nghĩa | phiên âm
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="block text-sm mb-2">Nhập từ vựng (mỗi dòng: từ | nghĩa | phiên âm)</label>
            <Textarea
              placeholder={`serendipity | may mắn tình cờ | /ˌser.ənˈdɪp.ə.ti/\nfascinating | hấp dẫn\nambiguous | mơ hồ`}
              value={bulkText}
              onChange={(e) => setBulkText(e.target.value)}
              rows={8}
              className="font-mono text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Gợi ý từ vựng</label>
            <div className="flex flex-wrap gap-2">
              {suggestedWords.map((word) => (
                <Button
                  key={word}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newLine = bulkText ? '\n' : '';
                    setBulkText(prev => prev + newLine + word + ' | ');
                  }}
                >
                  {word}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <CategorySelector
              selectedCategories={selectedCategory ? [selectedCategory] : []}
              onSelectionChange={(selectedCategories) => {
                if (selectedCategories.length > 0) {
                  setSelectedCategory(selectedCategories[0]);
                }
              }}
              title="Chọn danh mục cho từ vựng"
              description="Chọn danh mục để phân loại các từ vựng được thêm"
              className="w-full"
            />
            <TopicMutiSelector
              type="topic"
              selectedItems={selectedTopic ? [selectedTopic] : []}
              onSelectionChange={(selectedTopics) => {
                if (selectedTopics.length > 0) {
                  setSelectedTopic(selectedTopics[0]);
                }
              }}
              className="w-full"
            />
            <Select defaultValue="medium">
              <SelectTrigger>
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowBulkDialog(false)}>
              Hủy
            </Button>
            <Button onClick={processBulkAdd} disabled={!bulkText.trim()}>
              Thêm {bulkText.split('\n').filter(line => line.trim()).length} từ
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}