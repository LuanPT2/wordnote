import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Progress } from '../../ui/progress';
import { Badge } from '../../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Play, Pause, SkipForward, SkipBack, Eye, EyeOff, BookOpen, List, Trash2 } from 'lucide-react';
import { ConfigTabContent } from './ConfigTabContent';
import { VocabularyItem, ListeningConfig, SavedWordList } from './types';
import { ListeningTabContent } from './ListeningTabContent';
import { 
  getVocabularyList, 
  getCategories, 
  getTopics,
  getVocabularyByCategory,
  getVocabularyByTopic,
  getVocabularyByDifficulty,
  getVocabularyByMastered
} from '../../../lib/vocabulary-data';

interface ListeningScreenProps {
  onBack: () => void;
}

export function ListeningScreen({ onBack }: ListeningScreenProps) {
  const [activeTab, setActiveTab] = useState('config');
  const [config, setConfig] = useState<ListeningConfig>({
    categories: [],
    topics: [],
    difficulties: ['easy', 'medium', 'hard'],
    masteryStatus: ['not-mastered'],
    mode: ['word'],
    pauseBetweenWords: 3,
    pauseBetweenParts: 1
  });
  
  // Word selection states
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);

  // Listening session states
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedWords, setSelectedWords] = useState<VocabularyItem[]>([]);
  const [showText, setShowText] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [showExamples, setShowExamples] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isBackgroundMode, setIsBackgroundMode] = useState(false);

  // Dialog states
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [listName, setListName] = useState('');

  // Saved lists
  const [savedLists, setSavedLists] = useState<SavedWordList[]>([]);

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);
  // Category manager modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);
  
  // Current list state
  const [currentListId, setCurrentListId] = useState<string | null>(null);

  // Get vocabulary data from vocabulary-data.ts
  const vocabularyList: VocabularyItem[] = getVocabularyList();
  const categories = getCategories().map(c => c.name);
  const topics = getTopics().map(t => t.name);

  // Mock background images
  useEffect(() => {
    const images = [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'
    ];
    setBackgroundImages(images);
  }, []);

  // Initialize selected words when component mounts
  useEffect(() => {
    const allWordIds = vocabularyList.map(word => word.id);
    setSelectedWordIds(allWordIds);
  }, []);

  const getSelectedWords = () => {
    return vocabularyList.filter(word => selectedWordIds.includes(word.id));
  };

  const startListening = (wordList: VocabularyItem[] = []) => {
    const wordsToPlay = wordList.length > 0 ? wordList : getSelectedWords();
    setSelectedWords(wordsToPlay);
    setCurrentIndex(0);
    setProgress(0);
    setActiveTab('listening');
    setIsPlaying(true);
    
    // Start the listening session
    playCurrentWord(wordsToPlay, 0);
  };

  // Auto start listening when switching to listening tab
  useEffect(() => {
    if (activeTab === 'listening' && selectedWords.length > 0 && !isPlaying) {
      startListening();
    }
  }, [activeTab, selectedWords.length]);

  const playCurrentWord = (wordList: VocabularyItem[], index: number) => {
    if (index >= wordList.length) {
      setIsPlaying(false);
      setProgress(100);
      return;
    }

    const word = wordList[index];
    setCurrentIndex(index);
    setProgress((index / wordList.length) * 100);

    // Change background image
    setCurrentImageIndex(Math.floor(Math.random() * backgroundImages.length));

    // Build texts to speak based on selected modes
    let textsToSpeak: string[] = [];
    
    if (config.mode.includes('word')) {
      textsToSpeak.push(word.word);
    }
    if (config.mode.includes('pronunciation') && word.pronunciation) {
      textsToSpeak.push(word.pronunciation);
    }
    if (config.mode.includes('meaning')) {
      textsToSpeak.push(word.meaning);
    }
    if (config.mode.includes('examples') && word.examples.length > 0) {
      textsToSpeak.push(word.examples[0].sentence);
    }
    if (config.mode.includes('example-translation') && word.examples.length > 0 && word.examples[0].translation) {
      textsToSpeak.push(word.examples[0].translation);
    }

    // Play texts with pauses
    let textIndex = 0;
    
    const playNextText = () => {
      if (textIndex < textsToSpeak.length) {
        speakText(textsToSpeak[textIndex], () => {
          textIndex++;
          if (textIndex < textsToSpeak.length) {
            setTimeout(playNextText, config.pauseBetweenParts * 1000);
          } else {
            // Move to next word after pause
            setTimeout(() => {
              if (isPlaying) {
                playCurrentWord(wordList, index + 1);
              }
            }, config.pauseBetweenWords * 1000);
          }
        });
      }
    };

    playNextText();
  };

  const speakText = (text: string, onComplete?: () => void) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = text === text.toLowerCase() && /^[a-zA-Z\s.,!?]+$/.test(text) ? 'en-US' : 'vi-VN';
      utterance.rate = 0.8;
      
      if (onComplete) {
        utterance.onend = onComplete;
      }
      
      speechSynthesis.speak(utterance);
    } else if (onComplete) {
      // Fallback if speech synthesis not available
      setTimeout(onComplete, 2000);
    }
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying && selectedWords.length > 0) {
      playCurrentWord(selectedWords, currentIndex);
    } else {
      speechSynthesis.cancel();
    }
  };

  const nextWord = () => {
    speechSynthesis.cancel();
    if (currentIndex < selectedWords.length - 1) {
      playCurrentWord(selectedWords, currentIndex + 1);
    }
  };

  const previousWord = () => {
    speechSynthesis.cancel();
    if (currentIndex > 0) {
      playCurrentWord(selectedWords, currentIndex - 1);
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
    const categoryData = getCategories().find(c => c.name === category);
    return categoryData?.color || 'bg-gray-100 text-gray-800';
  };

  const handleDictionaryOpen = () => setShowDictionaryPopup(true);
  const handleCategoryManagerOpen = () => setShowCategoryManager(true);

  // Handle list switching
  const handleSwitchList = (listId: string) => {
    if (listId === 'new') {
      setCurrentListId(null);
      setSelectedWordIds(vocabularyList.map(word => word.id));
    } else {
      setCurrentListId(listId);
      const selectedList = savedLists.find(list => list.id === listId);
      if (selectedList) {
        setSelectedWordIds(selectedList.wordIds);
      }
    }
    // Reset listening state when switching lists
    setIsPlaying(false);
    setCurrentIndex(0);
    setProgress(0);
    setSelectedWords([]);
  };

  // Delete saved list
  const deleteSavedList = (listId: string) => {
    setSavedLists(prev => prev.filter(list => list.id !== listId));
    if (currentListId === listId) {
      setCurrentListId(null);
      setSelectedWordIds(vocabularyList.map(word => word.id));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white p-6 shadow-lg">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            ←
          </Button>
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
            <span className="text-2xl">🎧</span>
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold">Luyện nghe từ vựng</h1>
            <p className="text-purple-100 text-sm mt-1 flex items-center space-x-2">
              {activeTab === 'listening' && selectedWords.length > 0 ? (
                <>
                  <span>🎵 {currentIndex + 1}/{selectedWords.length}</span>
                  <span>•</span>
                  <span>📊 {Math.round(progress)}%</span>
                </>
              ) : (
                <span>📚 {getSelectedWords().length} từ sẵn sàng</span>
              )}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDictionaryOpen}
              className="text-white hover:bg-white/20"
              title="Tra từ điển"
            >
              <BookOpen className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCategoryManagerOpen}
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

      <div className="bg-gradient-to-b from-muted/30 to-background min-h-screen">
       
        <div className="px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>

            {/* CONFIG TAB - TÁCH RA */}
          <TabsContent value="config" className="space-y-6 mt-6">
            <ConfigTabContent
              config={config}
              setConfig={setConfig}
              selectedWordIds={selectedWordIds}
              setSelectedWordIds={setSelectedWordIds}
              vocabularyList={vocabularyList}
              savedLists={savedLists}
              setSavedLists={setSavedLists}
              onStartListening={startListening}
              categories={categories}
              topics={topics}
              showDictionaryPopup={showDictionaryPopup}
              setShowDictionaryPopup={setShowDictionaryPopup}
              showCategoryManager={showCategoryManager}
              setShowCategoryManager={setShowCategoryManager}
              showSaveDialog={showSaveDialog}
              setShowSaveDialog={setShowSaveDialog}
              listName={listName}
              setListName={setListName}
            />
          </TabsContent>

          <TabsContent value="listening">
            <ListeningTabContent
              selectedWords={selectedWords}
              currentIndex={currentIndex}
              progress={progress}
              isPlaying={isPlaying}
              showText={showText}
              showTranslation={showTranslation}
              showExamples={showExamples}
              backgroundImages={backgroundImages}
              currentImageIndex={currentImageIndex}
              currentListId={currentListId}
              savedLists={savedLists}
              setActiveTab={setActiveTab}
              togglePlayPause={togglePlayPause}
              nextWord={nextWord}
              previousWord={previousWord}
              setShowText={setShowText}
              setShowTranslation={setShowTranslation}
              setShowExamples={setShowExamples}
              handleSwitchList={handleSwitchList}
              deleteSavedList={deleteSavedList}
              getDifficultyColor={getDifficultyColor}
              getCategoryColor={getCategoryColor}
            />
          </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}