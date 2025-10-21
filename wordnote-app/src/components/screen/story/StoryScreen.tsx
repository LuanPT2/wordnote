import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Play, Pause, Volume2, Settings, Eye, EyeOff, ChevronLeft, ChevronRight, BookOpen, Heart, Users, Search } from 'lucide-react';
import { CategoryManagerModal } from '../../modal/CategoryModal/CategoryManagerModal';
import { ImageWithFallback } from '../../figma/ImageWithFallback';
import { Progress } from '../../ui/progress';
import { Slider } from '../../ui/slider';
import { DictionarySearchModal } from '../../modal/DictionarySearch/DictionarySearchModal';
import { TopicSelector } from '../../common/TopicSelector';
import { DifficultySelector } from '../../common/DifficultySelector';
import { 
  getVideoStories, 
  getStoryCategories, 
  getVideoStoriesByCategory, 
  getVideoStoriesByDifficulty,
  VideoStory,
  StoryCategory
} from '../../../lib/story-data';

interface StoryScreenProps {
  onBack: () => void;
}


interface SubtitleLine {
  id: string;
  startTime: number;
  endTime: number;
  text: string;
  translation: string;
  highlightedWords: HighlightedWord[];
}

interface HighlightedWord {
  word: string;
  pronunciation: string;
  meaning: string;
  startIndex: number;
  endIndex: number;
}

interface VocabularyItem {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: Array<{sentence: string, translation: string}>;
  difficulty: 'easy' | 'medium' | 'hard';
}

export function StoryScreen({ onBack }: StoryScreenProps) {
  const [activeTab, setActiveTab] = useState('videos');
  const [selectedVideo, setSelectedVideo] = useState<VideoStory | null>(null);
  const [selectedVideos, setSelectedVideos] = useState<string[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<string[]>(['2', '4']); // Pre-populate some favorites
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(100);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [selectedWordInfo, setSelectedWordInfo] = useState<HighlightedWord | null>(null);

  // Filters
  const [filterTopic, setFilterTopic] = useState('general');
  const [filterDifficulty, setFilterDifficulty] = useState('easy');

  // Dictionary popup state
  const [showDictionaryPopup, setShowDictionaryPopup] = useState(false);
  // Category manager modal
  const [showCategoryManager, setShowCategoryManager] = useState(false);

  // Get video data from story-data.ts
  const [videoStories, setVideoStories] = useState<VideoStory[]>(getVideoStories());

  const getFilteredVideos = () => {
    return videoStories.filter(video => 
      video.difficulty === filterDifficulty
    );
  };

  const getCurrentSubtitle = () => {
    if (!selectedVideo) return null;
    // For now, return the first word as subtitle since story-data.ts uses words instead of subtitles
    return selectedVideo.words.length > 0 ? {
      id: '1',
      startTime: 0,
      endTime: 3,
      text: selectedVideo.words[0].word,
      translation: selectedVideo.words[0].meaning,
      highlightedWords: [{
        word: selectedVideo.words[0].word,
        pronunciation: selectedVideo.words[0].pronunciation,
        meaning: selectedVideo.words[0].meaning,
        startIndex: 0,
        endIndex: selectedVideo.words[0].word.length - 1
      }]
    } : null;
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = (newSpeed: number[]) => {
    setPlaybackSpeed(newSpeed[0]);
  };

  const handleWordClick = (word: HighlightedWord) => {
    setSelectedWordInfo(word);
    // Speak the word
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US';
      utterance.rate = 0.8;
      speechSynthesis.speak(utterance);
    }
  };

  const addWordToMyNote = (word: HighlightedWord) => {
    // In a real app, this would save to user's notes
    console.log('Added to MyNote:', word);
  };

  const addWordToStoryCategory = (word: VocabularyItem) => {
    // In a real app, this would add the word to the "story" category
    console.log('Added to Story category:', word);
    // Show feedback to user
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance('Đã thêm từ vào danh mục Story');
      utterance.lang = 'vi-VN';
      speechSynthesis.speak(utterance);
    }
  };

  const selectVideo = (videoId: string) => {
    if (selectedVideos.includes(videoId)) {
      setSelectedVideos(prev => prev.filter(id => id !== videoId));
    } else {
      setSelectedVideos(prev => [...prev, videoId]);
    }
  };

  const startMultiVideoSession = () => {
    if (selectedVideos.length > 0) {
      // Start with first selected video
      const firstVideo = videoStories.find(v => v.id === selectedVideos[0]);
      if (firstVideo) {
        setSelectedVideo(firstVideo);
        setActiveTab('watch');
        setCurrentTime(0);
        setIsPlaying(true);
      }
    }
  };

  const toggleFavorite = (videoId: string) => {
    if (favoriteVideos.includes(videoId)) {
      setFavoriteVideos(prev => prev.filter(id => id !== videoId));
    } else {
      setFavoriteVideos(prev => [...prev, videoId]);
    }
    
    // Update video likes
    setVideoStories(prev => prev.map(video => 
      video.id === videoId 
        ? { 
            ...video, 
            isLiked: !video.isLiked,
            likes: video.isLiked ? video.likes - 1 : video.likes + 1
          }
        : video
    ));
  };

  const getFavoriteVideos = () => {
    return videoStories.filter(video => favoriteVideos.includes(video.id));
  };

  const formatViews = (views: number) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    } else if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K`;
    }
    return views.toString();
  };

  // Mock video progress
  useEffect(() => {
     let interval: number;
    if (isPlaying && selectedVideo) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, duration]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTopicColor = (topic: string) => {
    const topicData = getStoryCategories().find(t => t.name === topic);
    return topicData?.color || 'bg-gray-100 text-gray-800';
  };

  // Handle saving word from dictionary popup
  const handleSaveWordFromDictionary = (word: string, meaning: string, pronunciation: string, category: string) => {
    // For StoryScreen, we can add the word to a vocabulary list or show a notification
    // Since StoryScreen doesn't have a vocabulary list, we'll just show a success message
    console.log('Word saved from dictionary:', { word, meaning, pronunciation, category });
    setShowDictionaryPopup(false);
  };

  const renderVideoCard = (video: VideoStory) => (
    <Card key={video.id} className="hover:shadow-lg transition-shadow">
      <CardContent className="p-0">
        <div className="relative">
           <ImageWithFallback
             src={video.thumbnailUrl}
             alt={video.title}
             className="w-full h-48 object-cover rounded-t-lg"
           />
          
          {/* Play button */}
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <Button
              size="lg"
              onClick={() => {
                setSelectedVideo(video);
                setActiveTab('watch');
                setCurrentTime(0);
              }}
              className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30"
            >
              <Play className="h-8 w-8" />
            </Button>
          </div>
          
           {/* Duration badge */}
           <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
             {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
           </div>
          
          {/* Selection checkbox */}
          <div className="absolute top-2 left-2">
            <Checkbox
              checked={selectedVideos.includes(video.id)}
              onCheckedChange={() => selectVideo(video.id)}
              className="bg-white/80"
            />
          </div>
          
          {/* Heart button for favorites */}
          <div className="absolute top-2 right-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavorite(video.id)}
              className="bg-white/80 hover:bg-white/90 h-8 w-8 p-0"
            >
               <Heart 
                 className={`h-4 w-4 ${favoriteVideos.includes(video.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
               />
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold line-clamp-2 flex-1">{video.title}</h3>
          </div>
          
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {video.description}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Badge className={getTopicColor(video.topic)}>
                {video.topic}
              </Badge>
              <Badge className={getDifficultyColor(video.difficulty)}>
                {video.difficulty === 'easy' ? 'Dễ' : video.difficulty === 'medium' ? 'TB' : 'Khó'}
              </Badge>
            </div>
            
            {/* Views and likes */}
             <div className="flex items-center space-x-3 text-sm text-muted-foreground">
               <div className="flex items-center space-x-1">
                 <Users className="h-3 w-3" />
                 <span>{formatViews(video.viewCount)}</span>
               </div>
               <div className="flex items-center space-x-1">
                 <Heart className="h-3 w-3" />
                 <span>{favoriteVideos.includes(video.id) ? '❤️' : '🤍'}</span>
               </div>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (selectedVideo && activeTab === 'watch') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-red-600 text-white p-6">
          <div className="flex items-center space-x-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => {
                setSelectedVideo(null);
                setActiveTab('videos');
                setIsPlaying(false);
              }}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              <span className="text-xl">📺</span>
            </div>
            <div className="flex-1">
              <h1 className="text-xl">{selectedVideo.title}</h1>
               <p className="text-red-100 text-sm">
                 {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')} / {Math.floor(selectedVideo.duration / 60)}:{(selectedVideo.duration % 60).toString().padStart(2, '0')}
               </p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSubtitles(!showSubtitles)}
                className="text-white hover:bg-white/20"
              >
                {showSubtitles ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
                className="text-white hover:bg-white/20"
              >
                {showTranslation ? '🌐' : '🔤'}
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Video Player Mock */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                 <ImageWithFallback
                   src={selectedVideo.thumbnailUrl}
                   alt={selectedVideo.title}
                   className="w-full h-full object-cover"
                 />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <Button
                    size="lg"
                    onClick={togglePlayPause}
                    className="rounded-full w-16 h-16 bg-white/20 hover:bg-white/30"
                  >
                    {isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </Button>
                </div>
                
                {/* Progress bar overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <Progress value={(currentTime / duration) * 100} className="mb-2" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subtitle Display */}
          {showSubtitles && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {getCurrentSubtitle() ? (
                    <div className="space-y-3">
                      <div className="text-lg leading-relaxed">
                        {getCurrentSubtitle()!.highlightedWords.length > 0 ? (
                          <span>
                            {getCurrentSubtitle()!.text.split('').map((char, index) => {
                              const highlightedWord = getCurrentSubtitle()!.highlightedWords.find(
                                word => index >= word.startIndex && index <= word.endIndex
                              );
                              
                              if (highlightedWord) {
                                return (
                                  <span
                                    key={index}
                                    className="bg-yellow-200 hover:bg-yellow-300 cursor-pointer rounded px-1"
                                    onClick={() => handleWordClick(highlightedWord)}
                                  >
                                    {char}
                                  </span>
                                );
                              }
                              return <span key={index}>{char}</span>;
                            })}
                          </span>
                        ) : (
                          getCurrentSubtitle()!.text
                        )}
                      </div>
                      
                      {showTranslation && (
                        <div className="text-base text-muted-foreground border-l-4 border-blue-200 pl-4">
                          {getCurrentSubtitle()!.translation}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>Chờ phụ đề xuất hiện...</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Controls */}
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}
                    >
                      ⏪ 10s
                    </Button>
                    
                    <Button onClick={togglePlayPause}>
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentTime(Math.min(duration, currentTime + 10))}
                    >
                      10s ⏩
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="text-sm">Tốc độ:</span>
                    <div className="w-32">
                      <Slider
                        value={[playbackSpeed]}
                        onValueChange={handleSpeedChange}
                        min={0.5}
                        max={2}
                        step={0.25}
                        className="w-full"
                      />
                    </div>
                    <span className="text-sm font-mono w-8">{playbackSpeed}x</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Word Info Panel */}
          {selectedWordInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Chi tiết từ vựng</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedWordInfo(null)}
                  >
                    ✕
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-2xl font-bold">{selectedWordInfo.word}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleWordClick(selectedWordInfo)}
                    >
                      🔊
                    </Button>
                  </div>
                  <p className="text-lg text-muted-foreground">{selectedWordInfo.pronunciation}</p>
                  <p className="text-xl text-blue-600">{selectedWordInfo.meaning}</p>
                </div>
                
                <Button
                  onClick={() => addWordToMyNote(selectedWordInfo)}
                  className="w-full"
                >
                  💾 Thêm vào MyNote
                </Button>
              </CardContent>
            </Card>
          )}

           {/* Related Words */}
           <Card>
             <CardHeader>
               <CardTitle>Từ vựng liên quan</CardTitle>
             </CardHeader>
             <CardContent>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {selectedVideo.words.map((word) => (
                  <div key={word.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{word.word}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(word.difficulty)}>
                          {word.difficulty === 'easy' ? 'Dễ' : word.difficulty === 'medium' ? 'TB' : 'Khó'}
                        </Badge>
                        <Button
                          onClick={() => addWordToStoryCategory(word)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Thêm
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{word.pronunciation}</p>
                    <p className="text-blue-600 mb-3">{word.meaning}</p>
                    {word.examples.length > 0 && (
                      <div className="text-sm">
                        <p className="italic">"{word.examples[0].sentence}"</p>
                        <p className="text-muted-foreground mt-1">→ {word.examples[0].translation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-red-600 text-white p-6">
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
              <span className="text-xl">📺</span>
            </div>
            <div>
              <h1 className="text-xl">Story - Học từ qua video</h1>
              <p className="text-red-100 text-sm">
                {getFilteredVideos().length} video • {selectedVideos.length} đã chọn • {favoriteVideos.length} yêu thích
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
              {/* folder icon using heroicons URL for consistency with VocabularyScreen */}
              <img
                src="https://unpkg.com/heroicons@2.1.1/24/outline/folder.svg"
                alt="Categories"
                className="h-5 w-5 invert"
              />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Danh sách video</TabsTrigger>
            <TabsTrigger value="favorites">
              Yêu thích ({favoriteVideos.length})
            </TabsTrigger>
            <TabsTrigger value="watch" disabled={selectedVideos.length === 0}>
              Học video ({selectedVideos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="space-y-6 mt-6">
            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Bộ lọc video</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <TopicSelector 
                    value={filterTopic} 
                    onChange={setFilterTopic}
                  />
                  
                  <DifficultySelector 
                    value={filterDifficulty as 'easy' | 'medium' | 'hard'} 
                    onChange={setFilterDifficulty}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Selected Videos Actions */}
            {selectedVideos.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Đã chọn {selectedVideos.length} video</span>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setSelectedVideos([])}>
                        Bỏ chọn tất cả
                      </Button>
                      <Button onClick={startMultiVideoSession}>
                        Bắt đầu học
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Video List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getFilteredVideos().map(renderVideoCard)}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6 mt-6">
            {favoriteVideos.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">💝</div>
                  <h3 className="mb-2">Chưa có video yêu thích</h3>
                  <p className="text-muted-foreground mb-4">
                    Hãy nhấn vào biểu tượng trái tim để thêm video vào danh sách yêu thích
                  </p>
                  <Button onClick={() => setActiveTab('videos')}>
                    Khám phá video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {getFavoriteVideos().map(renderVideoCard)}
              </div>
            )}
          </TabsContent>

          <TabsContent value="watch" className="space-y-6 mt-6">
            {selectedVideos.length === 0 ? (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">🎬</div>
                  <h3 className="mb-2">Chưa chọn video nào</h3>
                  <p className="text-muted-foreground mb-4">
                    Hãy chọn video từ danh sách để bắt đầu học
                  </p>
                  <Button onClick={() => setActiveTab('videos')}>
                    Chọn video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center p-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="mb-2">Sẵn sàng học {selectedVideos.length} video</h3>
                  <p className="text-muted-foreground mb-4">
                    Nhấn "Bắt đầu học" để xem video đầu tiên
                  </p>
                  <Button onClick={startMultiVideoSession}>
                    Bắt đầu học
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Dictionary Search Popup */}
      <DictionarySearchModal
        isOpen={showDictionaryPopup}
        onClose={() => setShowDictionaryPopup(false)}
        onSaveWord={handleSaveWordFromDictionary}
        categories={getStoryCategories().map(c => c.name)}
      />
      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={showCategoryManager}
        onClose={() => setShowCategoryManager(false)}
      />
    </div>
  );
}