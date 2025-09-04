import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  X, 
  Search, 
  Volume2, 
  Star, 
  BookOpen, 
  Type, 
  MessageSquare, 
  Users, 
  Zap,
  Heart,
  Copy,
  Share2
} from 'lucide-react';
import { ScrollArea } from './ui/scroll-area';

interface DictionaryEntry {
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  exampleTranslation: string;
  synonyms: string[];
  antonyms: string[];
  usage: string;
  relatedWords: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
}

interface DictionarySearchPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWord: (word: string, meaning: string, pronunciation: string, category: string) => void;
  categories: string[];
}

export function DictionarySearchPopup({ 
  isOpen, 
  onClose, 
  onSaveWord, 
  categories 
}: DictionarySearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<DictionaryEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0] || 'Daily');
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // Mock dictionary data
  const mockDictionary: Record<string, DictionaryEntry> = {
    'hello': {
      word: 'hello',
      phonetic: '/həˈloʊ/',
      partOfSpeech: 'exclamation, noun',
      definition: 'used as a greeting or to begin a phone conversation',
      example: 'Hello, how are you today?',
      exampleTranslation: 'Xin chào, bạn có khỏe không?',
      synonyms: ['hi', 'hey', 'greetings', 'good morning'],
      antonyms: ['goodbye', 'farewell'],
      usage: 'Used informally and formally to greet someone',
      relatedWords: ['greeting', 'salutation', 'welcome'],
      level: 'beginner'
    },
    'serendipity': {
      word: 'serendipity',
      phonetic: '/ˌserənˈdɪpəti/',
      partOfSpeech: 'noun',
      definition: 'the occurrence and development of events by chance in a happy or beneficial way',
      example: 'It was pure serendipity that we met at the coffee shop.',
      exampleTranslation: 'Thật là may mắn tình cờ khi chúng ta gặp nhau ở quán cà phê.',
      synonyms: ['chance', 'luck', 'fortune', 'coincidence'],
      antonyms: ['misfortune', 'bad luck'],
      usage: 'Often used to describe pleasant surprises or fortunate accidents',
      relatedWords: ['serendipitous', 'fortuitous', 'accidental'],
      level: 'advanced'
    },
    'amazing': {
      word: 'amazing',
      phonetic: '/əˈmeɪzɪŋ/',
      partOfSpeech: 'adjective',
      definition: 'causing great surprise or wonder; astonishing',
      example: 'The view from the mountain was absolutely amazing.',
      exampleTranslation: 'Khung cảnh từ núi thật sự tuyệt vời.',
      synonyms: ['astonishing', 'incredible', 'wonderful', 'fantastic'],
      antonyms: ['ordinary', 'boring', 'unimpressive'],
      usage: 'Used to express admiration or surprise about something impressive',
      relatedWords: ['amaze', 'amazement', 'amazingly'],
      level: 'intermediate'
    },
    'beautiful': {
      word: 'beautiful',
      phonetic: '/ˈbjuːtɪfʊl/',
      partOfSpeech: 'adjective',
      definition: 'pleasing the senses or mind aesthetically',
      example: 'She wore a beautiful dress to the party.',
      exampleTranslation: 'Cô ấy mặc một chiếc váy đẹp đến bữa tiệc.',
      synonyms: ['lovely', 'gorgeous', 'stunning', 'attractive'],
      antonyms: ['ugly', 'hideous', 'unattractive'],
      usage: 'Used to describe something that is visually or aesthetically pleasing',
      relatedWords: ['beauty', 'beautify', 'beautifully'],
      level: 'beginner'
    },
    'procrastinate': {
      word: 'procrastinate',
      phonetic: '/prəˈkræstɪneɪt/',
      partOfSpeech: 'verb',
      definition: 'delay or postpone action; put off doing something',
      example: 'I tend to procrastinate when I have difficult tasks to complete.',
      exampleTranslation: 'Tôi có xu hướng trì hoãn khi có những nhiệm vụ khó hoàn thành.',
      synonyms: ['delay', 'postpone', 'defer', 'stall'],
      antonyms: ['expedite', 'advance', 'hasten'],
      usage: 'Often used in academic or work contexts to describe delaying important tasks',
      relatedWords: ['procrastination', 'procrastinator'],
      level: 'advanced'
    },
    'run': {
      word: 'run',
      phonetic: '/rʌn/',
      partOfSpeech: 'verb, noun',
      definition: 'move at a speed faster than a walk, never having both or all the feet on the ground at the same time',
      example: 'I like to run in the park every morning.',
      exampleTranslation: 'Tôi thích chạy bộ trong công viên mỗi sáng.',
      synonyms: ['jog', 'sprint', 'dash', 'race'],
      antonyms: ['walk', 'crawl', 'stop'],
      usage: 'Used to describe rapid movement on foot or managing something',
      relatedWords: ['runner', 'running', 'rundown', 'runway', 'overrun'],
      level: 'beginner'
    }
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      setSelectedEntry(null);
      return;
    }

    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const results: DictionaryEntry[] = [];
    const searchLower = term.toLowerCase();
    
    // Exact match first
    if (mockDictionary[searchLower]) {
      results.push(mockDictionary[searchLower]);
    }
    
    // Partial matches
    Object.values(mockDictionary).forEach(entry => {
      if (entry.word.toLowerCase().includes(searchLower) && 
          !results.find(r => r.word === entry.word)) {
        results.push(entry);
      }
    });
    
    // Related words matches
    Object.values(mockDictionary).forEach(entry => {
      if (entry.relatedWords.some(word => 
          word.toLowerCase().includes(searchLower)) && 
          !results.find(r => r.word === entry.word)) {
        results.push(entry);
      }
    });
    
    setSearchResults(results);
    setSelectedEntry(results[0] || null);
    
    // Add to search history
    if (!searchHistory.includes(term)) {
      setSearchHistory(prev => [term, ...prev.slice(0, 4)]);
    }
    
    setIsLoading(false);
  };

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const handleSaveWord = () => {
    if (selectedEntry) {
      onSaveWord(
        selectedEntry.word,
        selectedEntry.definition,
        selectedEntry.phonetic,
        selectedCategory
      );
      setIsSaved(true);
      setShowSaveConfirm(false);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Cơ bản';
      case 'intermediate': return 'Trung cấp';
      case 'advanced': return 'Nâng cao';
      default: return 'Không xác định';
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setSelectedEntry(null);
    }
  }, [searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full m-0 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Từ điển tìm kiếm</DialogTitle>
          <DialogDescription>
            Tra cứu từ vựng tiếng Anh với phiên âm, nghĩa và ví dụ
          </DialogDescription>
        </DialogHeader>
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl">Từ điển</h1>
                <p className="text-blue-100 text-sm">Tra cứu và lưu từ vựng</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>

          {/* Search Bar */}
          <div className="p-4 border-b bg-white">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Nhập từ cần tra cứu..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 text-lg"
                autoFocus
              />
            </div>
            
            {/* Search History */}
            {searchHistory.length > 0 && !searchTerm && (
              <div className="mt-3">
                <p className="text-sm text-gray-600 mb-2">Tìm kiếm gần đây:</p>
                <div className="flex flex-wrap gap-2">
                  {searchHistory.map((term, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setSearchTerm(term)}
                      className="h-8"
                    >
                      {term}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Đang tìm kiếm...</p>
                </div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex h-full">
                {/* Results List */}
                <div className="w-1/3 border-r bg-gray-50">
                  <div className="p-4 border-b bg-white">
                    <h3 className="font-medium">
                      Kết quả ({searchResults.length})
                    </h3>
                  </div>
                  <ScrollArea className="h-full">
                    <div className="p-2">
                      {searchResults.map((entry, index) => (
                        <Card
                          key={index}
                          className={`mb-2 cursor-pointer transition-colors ${
                            selectedEntry?.word === entry.word
                              ? 'ring-2 ring-blue-500 bg-blue-50'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedEntry(entry)}
                        >
                          <CardContent className="p-3">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-medium">{entry.word}</h4>
                              <Badge className={getLevelColor(entry.level)}>
                                {getLevelText(entry.level)}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                              {entry.phonetic}
                            </p>
                            <p className="text-sm text-gray-700">
                              {entry.partOfSpeech}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Detailed View */}
                <div className="flex-1">
                  {selectedEntry && (
                    <ScrollArea className="h-full">
                      <div className="p-6">
                        {/* Word Header */}
                        <div className="mb-6">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center space-x-3">
                              <h1 className="text-3xl font-medium">
                                {selectedEntry.word}
                              </h1>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => speakWord(selectedEntry.word)}
                                className="h-8 w-8 p-0"
                              >
                                <Volume2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge className={getLevelColor(selectedEntry.level)}>
                                {getLevelText(selectedEntry.level)}
                              </Badge>
                              {isSaved ? (
                                <Badge className="bg-green-100 text-green-800">
                                  <Heart className="h-3 w-3 mr-1 fill-current" />
                                  Đã lưu
                                </Badge>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setShowSaveConfirm(true)}
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Lưu từ
                                </Button>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-gray-600">
                            <span className="flex items-center">
                              <Type className="h-4 w-4 mr-1" />
                              {selectedEntry.phonetic}
                            </span>
                            <span>{selectedEntry.partOfSpeech}</span>
                          </div>
                        </div>

                        {/* Definition */}
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <BookOpen className="h-5 w-5 mr-2" />
                            Định nghĩa
                          </h3>
                          <p className="text-gray-700 leading-relaxed">
                            {selectedEntry.definition}
                          </p>
                        </div>

                        {/* Example */}
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Ví dụ
                          </h3>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="italic mb-2">"{selectedEntry.example}"</p>
                            <p className="text-gray-600">→ {selectedEntry.exampleTranslation}</p>
                          </div>
                        </div>

                        {/* Usage */}
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Zap className="h-5 w-5 mr-2" />
                            Cách sử dụng
                          </h3>
                          <p className="text-gray-700">{selectedEntry.usage}</p>
                        </div>

                        {/* Synonyms & Antonyms */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div>
                            <h3 className="text-lg font-medium mb-2">Từ đồng nghĩa</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedEntry.synonyms.map((synonym, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="cursor-pointer hover:bg-blue-100"
                                  onClick={() => setSearchTerm(synonym)}
                                >
                                  {synonym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-lg font-medium mb-2">Từ trái nghĩa</h3>
                            <div className="flex flex-wrap gap-2">
                              {selectedEntry.antonyms.map((antonym, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="cursor-pointer hover:bg-red-50"
                                  onClick={() => setSearchTerm(antonym)}
                                >
                                  {antonym}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Related Words */}
                        <div className="mb-6">
                          <h3 className="text-lg font-medium mb-2 flex items-center">
                            <Users className="h-5 w-5 mr-2" />
                            Từ liên quan
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedEntry.relatedWords.map((word, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50"
                                onClick={() => setSearchTerm(word)}
                              >
                                {word}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-2 pt-4 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(selectedEntry.word);
                            }}
                          >
                            <Copy className="h-4 w-4 mr-2" />
                            Sao chép
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              if (navigator.share) {
                                navigator.share({
                                  title: selectedEntry.word,
                                  text: `${selectedEntry.word}: ${selectedEntry.definition}`
                                });
                              }
                            }}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Chia sẻ
                          </Button>
                        </div>
                      </div>
                    </ScrollArea>
                  )}
                </div>
              </div>
            ) : searchTerm ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-gray-600">
                    Không có từ nào phù hợp với "{searchTerm}"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Hãy thử tìm kiếm từ khác hoặc kiểm tra chính tả
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Từ điển tiếng Anh
                  </h3>
                  <p className="text-gray-600">
                    Nhập từ cần tra cứu để bắt đầu
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Save Confirmation Dialog */}
        <Dialog open={showSaveConfirm} onOpenChange={setShowSaveConfirm}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Lưu từ vựng</DialogTitle>
              <DialogDescription>
                Chọn danh mục để lưu từ "{selectedEntry?.word}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Danh mục
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowSaveConfirm(false)}
                >
                  Hủy
                </Button>
                <Button onClick={handleSaveWord}>
                  <Star className="h-4 w-4 mr-2" />
                  Lưu từ
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </DialogContent>
    </Dialog>
  );
}