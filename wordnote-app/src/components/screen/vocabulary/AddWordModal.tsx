import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Plus, X } from 'lucide-react';

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

interface AddWordDialogProps {
  categories: string[];
  onAddWord: (newWord: VocabularyItem) => void;
  onAddCategory: (newCategory: string) => void;
}

export function AddWordDialog({ categories, onAddWord, onAddCategory }: AddWordDialogProps) {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newWord, setNewWord] = useState({
    word: '',
    pronunciation: '',
    meaning: '',
    examples: [] as Example[],
    category: categories[0] || 'Harry Potter',
    topic: 'general',
    difficulty: 'medium' as const
  });
  const [currentExample, setCurrentExample] = useState({ sentence: '', translation: '' });

  const handleAddWord = () => {
    if (newWord.word && newWord.meaning) {
      const newItem: VocabularyItem = {
        id: Date.now().toString(),
        ...newWord,
        dateAdded: new Date().toISOString().split('T')[0],
        mastered: false,
        reviewCount: 0
      };
      onAddWord(newItem);
      setNewWord({
        word: '',
        pronunciation: '',
        meaning: '',
        examples: [],
        category: categories[0] || 'Harry Potter',
        topic: 'general',
        difficulty: 'medium'
      });
      setCurrentExample({ sentence: '', translation: '' });
      setShowAddDialog(false);
    }
  };

  const addExample = () => {
    if (currentExample.sentence.trim()) {
      const newExample: Example = {
        id: Date.now().toString(),
        sentence: currentExample.sentence,
        translation: currentExample.translation
      };
      setNewWord({
        ...newWord,
        examples: [...newWord.examples, newExample]
      });
      setCurrentExample({ sentence: '', translation: '' });
    }
  };

  const removeExample = (exampleId: string) => {
    setNewWord({
      ...newWord,
      examples: newWord.examples.filter(ex => ex.id !== exampleId)
    });
  };

  const addCategory = () => {
    if (newCategoryName.trim() && !categories.includes(newCategoryName)) {
      onAddCategory(newCategoryName);
      setNewCategoryName('');
      setShowCategoryDialog(false);
    }
  };

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm từ vựng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>➕</span>
            <span>Thêm từ vựng</span>
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin từ vựng mới bao gồm từ, phiên âm, nghĩa và ví dụ
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Từ vựng *</label>
              <Input
                placeholder="Nhập từ vựng..."
                value={newWord.word}
                onChange={(e) => setNewWord({...newWord, word: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Phiên âm</label>
              <Input
                placeholder="/phiên âm/"
                value={newWord.pronunciation}
                onChange={(e) => setNewWord({...newWord, pronunciation: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Dịch nghĩa *</label>
            <Textarea
              placeholder="Nhập nghĩa của từ..."
              value={newWord.meaning}
              onChange={(e) => setNewWord({...newWord, meaning: e.target.value})}
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm mb-2">Ví dụ</label>
            <div className="space-y-3">
              {newWord.examples.map((example, index) => (
                <div key={example.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Ví dụ {index + 1}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExample(example.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm italic mb-1">"{example.sentence}"</p>
                  {example.translation && (
                    <p className="text-sm text-muted-foreground">→ {example.translation}</p>
                  )}
                </div>
              ))}
              
              <div className="space-y-2">
                <Input
                  placeholder="Nhập câu ví dụ..."
                  value={currentExample.sentence}
                  onChange={(e) => setCurrentExample({...currentExample, sentence: e.target.value})}
                />
                <Input
                  placeholder="Nhập bản dịch (tùy chọn)..."
                  value={currentExample.translation}
                  onChange={(e) => setCurrentExample({...currentExample, translation: e.target.value})}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExample}
                  disabled={!currentExample.sentence.trim()}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm ví dụ
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2">Danh mục</label>
            <div className="flex space-x-2">
              <Select value={newWord.category} onValueChange={(value) => setNewWord({...newWord, category: value})}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Chọn danh mục" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={showCategoryDialog} onOpenChange={setShowCategoryDialog}>
                <DialogTrigger asChild>
                  <Button type="button" variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Quản lý danh mục</DialogTitle>
                    <DialogDescription>
                      Thêm danh mục mới hoặc xóa danh mục hiện có
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2">Thêm danh mục mới</label>
                      <Input
                        placeholder="Tên danh mục..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm mb-2">Danh mục hiện có</label>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {categories.map((category, index) => (
                          <div key={category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm">{category}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newCategories = categories.filter((_, i) => i !== index);
                                onAddCategory(newCategories[index-1] || categories[0]);
                              }}
                              className="h-6 w-6 p-0 text-red-500"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowCategoryDialog(false)}>
                        Đóng
                      </Button>
                      <Button onClick={addCategory} disabled={!newCategoryName.trim()}>
                        Thêm
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Chủ đề</label>
              <Select value={newWord.topic} onValueChange={(value) => setNewWord({...newWord, topic: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chủ đề" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">Tổng quát</SelectItem>
                  <SelectItem value="academic">Học thuật</SelectItem>
                  <SelectItem value="business">Kinh doanh</SelectItem>
                  <SelectItem value="advanced">Nâng cao</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm mb-2">Độ khó</label>
              <Select value={newWord.difficulty} onValueChange={(value) => setNewWord({...newWord, difficulty: value as any})}>
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
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Hủy
            </Button>
            <Button 
              onClick={handleAddWord} 
              disabled={!newWord.word || !newWord.meaning}
            >
              Thêm từ vựng
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}