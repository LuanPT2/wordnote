import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { BookOpen, Image as ImageIcon, Volume2, Plus, Star, ChevronRight, Filter, Search } from 'lucide-react';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Progress } from '../../ui/progress';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { TopicSelector } from '../../common/TopicSelector';
import { DifficultySelector } from '../../common/DifficultySelector';
import { 
  getStudyTopics, 
  getStudyCategories, 
  getStudyTopicsByCategory,
  getStudyTopicsByDifficulty,
  StudyTopic,
  StudyCategory
} from '../../../lib/freestudy-data';

interface FreeStudyScreenProps {
  onBack: () => void;
}

// StudyTopic interface is now imported from freestudy-data.ts

interface StudySubTopic {
  id: string;
  title: string;
  description: string;
  words: StudyWord[];
  completed: boolean;
}

interface StudyWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: Array<{sentence: string, translation: string}>;
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  learned: boolean;
  inMyNote: boolean;
}

export function FreeStudyScreen({ onBack }: FreeStudyScreenProps) {
  const [activeTab, setActiveTab] = useState('topics');
  const [selectedTopic, setSelectedTopic] = useState<StudyTopic | null>(null);
  const [selectedSubTopic, setSelectedSubTopic] = useState<StudySubTopic | null>(null);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [filterCategory, setFilterCategory] = useState('general');
  const [filterDifficulty, setFilterDifficulty] = useState('easy');

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);
  // Category manager modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Get study data from freestudy-data.ts
  const studyTopics: StudyTopic[] = getStudyTopics();

  const getFilteredTopics = () => {
    return studyTopics.filter(topic => 
      topic.difficulty === filterDifficulty
    );
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const markWordAsLearned = (wordId: string) => {
    if (selectedSubTopic) {
      setSelectedSubTopic({
        ...selectedSubTopic,
        words: selectedSubTopic.words.map(word =>
          word.id === wordId ? { ...word, learned: !word.learned } : word
        )
      });
    }
  };

  const addToMyNote = (wordId: string) => {
    if (selectedSubTopic) {
      setSelectedSubTopic({
        ...selectedSubTopic,
        words: selectedSubTopic.words.map(word =>
          word.id === wordId ? { ...word, inMyNote: !word.inMyNote } : word
        )
      });
    }
  };

  const nextWord = () => {
    if (selectedSubTopic && currentWordIndex < selectedSubTopic.words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const previousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    const categoryData = getStudyCategories().find(c => c.name === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  // Handle saving word from dictionary popup
  const handleSaveWordFromDictionary = (word: string, meaning: string, pronunciation: string, category: string) => {
    // For FreeStudyScreen, we can add the word to a vocabulary list or show a notification
    // Since FreeStudyScreen doesn't have a vocabulary list, we'll just show a success message
    console.log('Word saved from dictionary:', { word, meaning, pronunciation, category });
    setShowDictionaryPopup(false);
  };

  // Sub-topic learning view
  if (selectedSubTopic) {
    const currentWord = selectedSubTopic.words[currentWordIndex];
    
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-orange-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedSubTopic(null)}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl">{selectedSubTopic.title}</h1>
              <p className="text-orange-100 text-sm">
                {currentWordIndex + 1}/{selectedSubTopic.words.length} từ
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Progress */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Tiến độ: {currentWordIndex + 1}/{selectedSubTopic.words.length}</span>
                <span className="text-sm">
                  {selectedSubTopic.words.filter(w => w.learned).length} đã học
                </span>
              </div>
              <Progress value={(currentWordIndex / selectedSubTopic.words.length) * 100} />
            </CardContent>
          </Card>

          {/* Word Card */}
          <Card>
            <CardContent className="p-8 text-center">
              <div className="space-y-6">
                {/* Word Image */}
                <div className="w-64 h-48 mx-auto rounded-lg overflow-hidden">
                  <ImageWithFallback
                    src={currentWord.image}
                    alt={currentWord.word}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Word Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-3">
                    <h2 className="text-4xl font-bold">{currentWord.word}</h2>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => speakWord(currentWord.word)}
                    >
                      <Volume2 className="h-6 w-6" />
                    </Button>
                  </div>

                  <p className="text-lg text-muted-foreground">
                    {currentWord.pronunciation}
                  </p>

                  <p className="text-2xl text-blue-600 font-medium">
                    {currentWord.meaning}
                  </p>

                  <Badge className={getDifficultyColor(currentWord.difficulty)}>
                    {currentWord.difficulty === 'easy' ? 'Dễ' : 
                     currentWord.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                  </Badge>
                </div>

                {/* Examples */}
                {currentWord.examples.length > 0 && (
                  <div className="space-y-3 max-w-2xl mx-auto">
                    <h4 className="font-medium">Ví dụ:</h4>
                    {currentWord.examples.map((example, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-lg text-left">
                        <p className="italic mb-2">"{example.sentence}"</p>
                        <p className="text-sm text-muted-foreground">
                          → {example.translation}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    variant={currentWord.learned ? "default" : "outline"}
                    onClick={() => markWordAsLearned(currentWord.id)}
                    className={currentWord.learned ? "bg-green-600" : ""}
                  >
                    {currentWord.learned ? <Star className="h-4 w-4 mr-2" /> : <Star className="h-4 w-4 mr-2" />}
                    {currentWord.learned ? 'Đã học' : 'Đánh dấu đã học'}
                  </Button>

                  <Button
                    variant={currentWord.inMyNote ? "default" : "outline"}
                    onClick={() => addToMyNote(currentWord.id)}
                    className={currentWord.inMyNote ? "bg-blue-600" : ""}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {currentWord.inMyNote ? 'Đã thêm MyNote' : 'Thêm MyNote'}
                  </Button>
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between pt-4">
                  <Button
                    variant="outline"
                    onClick={previousWord}
                    disabled={currentWordIndex === 0}
                  >
                    ← Từ trước
                  </Button>

                  <Button
                    variant="outline"
                    onClick={nextWord}
                    disabled={currentWordIndex === selectedSubTopic.words.length - 1}
                  >
                    Từ tiếp →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Word List */}
          <Card>
            <CardHeader>
              <CardTitle>Tất cả từ vựng trong chủ đề</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedSubTopic.words.map((word, index) => (
                  <Button
                    key={word.id}
                    variant={index === currentWordIndex ? "default" : "outline"}
                    className="justify-start h-auto p-3"
                    onClick={() => setCurrentWordIndex(index)}
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <div className="w-8 h-8 rounded overflow-hidden flex-shrink-0">
                        <ImageWithFallback
                          src={word.image}
                          alt={word.word}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 text-left">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{word.word}</span>
                          {word.learned && <Star className="h-3 w-3 text-green-600" />}
                          {word.inMyNote && <Plus className="h-3 w-3 text-blue-600" />}
                        </div>
                        <p className="text-xs text-muted-foreground">{word.meaning}</p>
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Topic detail view
  if (selectedTopic) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-orange-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setSelectedTopic(null)}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl">{selectedTopic.title}</h1>
              <p className="text-orange-100 text-sm">
                {selectedTopic.completedWords}/{selectedTopic.wordCount} từ đã học
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Topic Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                  <ImageWithFallback
                    src={selectedTopic.image}
                    alt={selectedTopic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getCategoryColor(selectedTopic.category)}>
                      {selectedTopic.category}
                    </Badge>
                    <Badge className={getDifficultyColor(selectedTopic.difficulty)}>
                      {selectedTopic.difficulty === 'easy' ? 'Dễ' : 
                       selectedTopic.difficulty === 'medium' ? 'Trung bình' : 'Khó'}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3">
                    {selectedTopic.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tiến độ học tập</span>
                      <span>{Math.round((selectedTopic.completedWords / selectedTopic.wordCount) * 100)}%</span>
                    </div>
                    <Progress value={(selectedTopic.completedWords / selectedTopic.wordCount) * 100} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sub-topics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Chủ đề con</h3>
            <div className="space-y-4">
              {selectedTopic.subTopics.map((subTopic) => (
                <Card key={subTopic.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-medium">{subTopic.title}</h4>
                          {subTopic.completed && (
                            <Badge variant="default" className="bg-green-600">
                              Hoàn thành
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {subTopic.description}
                        </p>
                        <div className="flex items-center text-sm text-muted-foreground space-x-4">
                          <span>📝 {subTopic.words.length} từ vựng</span>
                          <span>⭐ {subTopic.words.filter(w => w.learned).length} đã học</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedSubTopic(subTopic);
                          setCurrentWordIndex(0);
                        }}
                        className="ml-4"
                      >
                        Học ngay
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main topics list view
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-orange-600 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl">Học tự do</h1>
              <p className="text-orange-100 text-sm">
                {getFilteredTopics().length} chủ đề • Học theo sở thích
              </p>
            </div>
          </div>
          
          {/* Header Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDictionaryPopup(true)}
              className="text-white hover:bg-white/20"
              title="Tra từ điển"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCategoryManager(true)}
              className="text-white hover:bg-white/20"
              title="Quản lý danh mục"
            >
              <img
                src="https://unpkg.com/heroicons@2.1.1/24/outline/folder.svg"
                alt="Categories"
                className="h-5 w-5 invert"
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Bộ lọc chủ đề</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <TopicSelector 
                value={filterCategory} 
                onChange={setFilterCategory}
              />
              
              <DifficultySelector 
                value={filterDifficulty as 'easy' | 'medium' | 'hard'} 
                onChange={setFilterDifficulty}
              />
            </div>
          </CardContent>
        </Card>

        {/* Study Topics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {getFilteredTopics().map((topic) => (
            <Card key={topic.id} className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedTopic(topic)}>
              <CardContent className="p-0">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <ImageWithFallback
                    src={topic.image}
                    alt={topic.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{topic.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {topic.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={getCategoryColor(topic.category)}>
                        {topic.category}
                      </Badge>
                      <Badge className={getDifficultyColor(topic.difficulty)}>
                        {topic.difficulty === 'easy' ? 'Dễ' : 
                         topic.difficulty === 'medium' ? 'TB' : 'Khó'}
                      </Badge>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {topic.wordCount} từ vựng
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tiến độ</span>
                      <span>{topic.completedWords}/{topic.wordCount} từ</span>
                    </div>
                    <Progress value={(topic.completedWords / topic.wordCount) * 100} />
                  </div>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-sm text-muted-foreground">
                      {topic.subTopics.length} chủ đề con
                    </span>
                    <Button variant="outline" size="sm">
                      Học ngay
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {getFilteredTopics().length === 0 && (
          <Card>
            <CardContent className="text-center p-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="mb-2">Không tìm thấy chủ đề nào</h3>
              <p className="text-muted-foreground">
                Thử điều chỉnh bộ lọc để tìm chủ đề phù hợp
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Dictionary Search Popup */}
      <DictionarySearchModal
        isOpen={showDictionaryPopup}
        onClose={() => setShowDictionaryPopup(false)}
        onSaveWord={handleSaveWordFromDictionary}
        categories={getStudyCategories().map(c => c.name)}
      />
      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}