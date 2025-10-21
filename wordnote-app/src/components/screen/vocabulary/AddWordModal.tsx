import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { TopicSelector } from '../../common/TopicSelector';
import { DifficultySelector } from '../../common/DifficultySelector';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { CategoryOptionSelector } from '../../common/CategoryOptionSelector';
import { Plus, X, Folder } from 'lucide-react';

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
  const [showCategoryModal, setShowCategoryModal] = useState(false);
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

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm từ vựng
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white shadow-2xl">
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
            <label className="block text-sm mb-2 font-medium text-gray-700">Ví dụ</label>
            <div className="space-y-3">
              {newWord.examples.map((example, index) => (
                <div key={example.id} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-sm font-medium text-blue-800 flex items-center">
                      <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs mr-2">
                        {index + 1}
                      </span>
                      Ví dụ {index + 1}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExample(example.id)}
                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-full"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm italic mb-2 text-gray-700 bg-white p-2 rounded-lg border-l-4 border-blue-400">
                    "{example.sentence}"
                  </p>
                  {example.translation && (
                    <p className="text-sm text-gray-600 bg-green-50 p-2 rounded-lg border-l-4 border-green-400">
                      → {example.translation}
                    </p>
                  )}
                </div>
              ))}
              
              <div className="space-y-3 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-sm font-medium text-green-800">✨ Thêm ví dụ mới</span>
                </div>
                <Input
                  placeholder="Nhập câu ví dụ..."
                  value={currentExample.sentence}
                  onChange={(e) => setCurrentExample({...currentExample, sentence: e.target.value})}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                <Input
                  placeholder="Nhập bản dịch (tùy chọn)..."
                  value={currentExample.translation}
                  onChange={(e) => setCurrentExample({...currentExample, translation: e.target.value})}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addExample}
                  disabled={!currentExample.sentence.trim()}
                  className="w-full bg-green-500 text-white border-green-500 hover:bg-green-600 hover:border-green-600 transition-all duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm ví dụ
                </Button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm mb-2 font-medium text-gray-700">Danh mục</label>
            <div className="flex space-x-2">
              <CategoryOptionSelector
                selectedCategory={newWord.category}
                onSelectionChange={(category) => setNewWord({...newWord, category})}
                className="flex-1 border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                icon={<Folder className="h-4 w-4 mr-2 text-blue-600" />}
              />
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => setShowCategoryModal(true)}
                className="bg-blue-500 text-white border-blue-500 hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <TopicSelector 
              value={newWord.topic}
              onChange={(value) => setNewWord({ ...newWord, topic: value })}
            />
            <DifficultySelector 
              value={newWord.difficulty as any}
              onChange={(value) => setNewWord({ ...newWord, difficulty: value as any })}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={() => setShowAddDialog(false)}
              className="bg-gray-500 text-white border-gray-500 hover:bg-gray-600 hover:border-gray-600 transition-all duration-200"
            >
              ❌ Hủy
            </Button>
            <Button 
              onClick={handleAddWord} 
              disabled={!newWord.word || !newWord.meaning}
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              ✅ Thêm từ vựng
            </Button>
          </div>
        </div>
      </DialogContent>
      
      <CategoryManagerModal 
        isOpen={showCategoryModal} 
        onClose={() => setShowCategoryModal(false)} 
      />
    </Dialog>
  );
}