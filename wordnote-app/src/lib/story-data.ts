// story-data.ts - Data cho Story Screen
// Được thiết kế để dễ dàng chuyển sang API sau này

export interface VideoStory {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number; // in seconds
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  words: StoryWord[];
  createdAt: string;
  updatedAt: string;
  viewCount: number;
  isPublished: boolean;
}

export interface StoryWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  timestamp: number; // in seconds
  examples: StoryExample[];
  imageUrl?: string;
  audioUrl?: string;
}

export interface StoryExample {
  id: string;
  sentence: string;
  translation: string;
  timestamp: number; // in seconds
}

export interface StoryCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  videoCount: number;
}

// Mock data - sẽ được thay thế bằng API calls
const storyCategories: StoryCategory[] = [
  {
    id: '1',
    name: 'Harry Potter',
    description: 'Câu chuyện phép thuật Harry Potter',
    color: 'bg-red-100 text-red-800',
    icon: '🧙‍♂️',
    videoCount: 3
  },
  {
    id: '2',
    name: 'TOEIC',
    description: 'Luyện thi TOEIC qua video',
    color: 'bg-green-100 text-green-800',
    icon: '📚',
    videoCount: 2
  },
  {
    id: '3',
    name: 'Daily',
    description: 'Giao tiếp hàng ngày',
    color: 'bg-blue-100 text-blue-800',
    icon: '💬',
    videoCount: 2
  }
];

const videoStories: VideoStory[] = [
  {
    id: '1',
    title: 'Harry Potter - The Philosopher\'s Stone',
    description: 'Khám phá thế giới phép thuật qua câu chuyện Harry Potter',
    videoUrl: 'https://example.com/videos/harry-potter-1.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400',
    duration: 1200, // 20 minutes
    topic: 'Harry Potter',
    difficulty: 'medium',
    category: 'Harry Potter',
    viewCount: 15420,
    isPublished: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    words: [
      {
        id: '1-1',
        word: 'magical',
        pronunciation: '/ˈmædʒ.ɪ.kəl/',
        meaning: 'có phép thuật, kỳ diệu',
        timestamp: 45,
        examples: [
          {
            id: '1-1-1',
            sentence: 'The magical world of Harry Potter fascinated millions.',
            translation: 'Thế giới phép thuật của Harry Potter đã mê hoặc hàng triệu người.',
            timestamp: 45
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
        audioUrl: 'https://example.com/audio/magical.mp3'
      },
      {
        id: '1-2',
        word: 'wizard',
        pronunciation: '/ˈwɪz.əd/',
        meaning: 'phù thủy, pháp sư',
        timestamp: 120,
        examples: [
          {
            id: '1-2-1',
            sentence: 'Harry is a young wizard learning magic.',
            translation: 'Harry là một phù thủy trẻ đang học phép thuật.',
            timestamp: 120
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300',
        audioUrl: 'https://example.com/audio/wizard.mp3'
      }
    ]
  },
  {
    id: '2',
    title: 'Daily English Conversation',
    description: 'Học tiếng Anh giao tiếp hàng ngày qua tình huống thực tế',
    videoUrl: 'https://example.com/videos/daily-conversation.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400',
    duration: 900, // 15 minutes
    topic: 'Daily',
    difficulty: 'easy',
    category: 'Daily',
    viewCount: 8930,
    isPublished: true,
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    words: [
      {
        id: '2-1',
        word: 'conversation',
        pronunciation: '/ˌkɒn.vəˈseɪ.ʃən/',
        meaning: 'cuộc trò chuyện',
        timestamp: 30,
        examples: [
          {
            id: '2-1-1',
            sentence: 'We had a great conversation yesterday.',
            translation: 'Chúng tôi đã có một cuộc trò chuyện tuyệt vời hôm qua.',
            timestamp: 30
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300',
        audioUrl: 'https://example.com/audio/conversation.mp3'
      }
    ]
  },
  {
    id: '3',
    title: 'TOEIC Listening Practice',
    description: 'Luyện nghe TOEIC với các tình huống kinh doanh',
    videoUrl: 'https://example.com/videos/toeic-listening.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400',
    duration: 1800, // 30 minutes
    topic: 'TOEIC',
    difficulty: 'hard',
    category: 'TOEIC',
    viewCount: 12350,
    isPublished: true,
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    words: [
      {
        id: '3-1',
        word: 'business',
        pronunciation: '/ˈbɪz.nɪs/',
        meaning: 'kinh doanh, thương mại',
        timestamp: 60,
        examples: [
          {
            id: '3-1-1',
            sentence: 'The business meeting was very productive.',
            translation: 'Cuộc họp kinh doanh rất hiệu quả.',
            timestamp: 60
          }
        ],
        imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300',
        audioUrl: 'https://example.com/audio/business.mp3'
      }
    ]
  }
];

// API-like functions - dễ dàng thay thế bằng real API calls
export const getStoryCategories = (): StoryCategory[] => {
  // TODO: Replace with API call
  // return fetch('/api/story-categories').then(res => res.json());
  return storyCategories;
};

export const getVideoStories = (): VideoStory[] => {
  // TODO: Replace with API call
  // return fetch('/api/video-stories').then(res => res.json());
  return videoStories;
};

export const getVideoStoryById = (id: string): VideoStory | undefined => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories/${id}`).then(res => res.json());
  return videoStories.find(story => story.id === id);
};

export const getVideoStoriesByCategory = (category: string): VideoStory[] => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories?category=${category}`).then(res => res.json());
  return videoStories.filter(story => story.category === category);
};

export const getVideoStoriesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): VideoStory[] => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories?difficulty=${difficulty}`).then(res => res.json());
  return videoStories.filter(story => story.difficulty === difficulty);
};

export const getVideoStoriesByTopic = (topic: string): VideoStory[] => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories?topic=${topic}`).then(res => res.json());
  return videoStories.filter(story => story.topic === topic);
};

export const searchVideoStories = (query: string): VideoStory[] => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories/search?q=${query}`).then(res => res.json());
  const lowercaseQuery = query.toLowerCase();
  return videoStories.filter(story => 
    story.title.toLowerCase().includes(lowercaseQuery) ||
    story.description.toLowerCase().includes(lowercaseQuery) ||
    story.words.some(word => word.word.toLowerCase().includes(lowercaseQuery))
  );
};

export const updateVideoStory = (id: string, updates: Partial<VideoStory>): VideoStory | null => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => res.json());
  
  const index = videoStories.findIndex(story => story.id === id);
  if (index !== -1) {
    videoStories[index] = { ...videoStories[index], ...updates, updatedAt: new Date().toISOString() };
    return videoStories[index];
  }
  return null;
};

export const addVideoStory = (story: Omit<VideoStory, 'id' | 'createdAt' | 'updatedAt' | 'viewCount'>): VideoStory => {
  // TODO: Replace with API call
  // return fetch('/api/video-stories', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(story)
  // }).then(res => res.json());
  
  const newStory: VideoStory = {
    ...story,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    viewCount: 0
  };
  videoStories.push(newStory);
  return newStory;
};

export const deleteVideoStory = (id: string): boolean => {
  // TODO: Replace with API call
  // return fetch(`/api/video-stories/${id}`, { method: 'DELETE' }).then(res => res.ok);
  
  const index = videoStories.findIndex(story => story.id === id);
  if (index !== -1) {
    videoStories.splice(index, 1);
    return true;
  }
  return false;
};

// Statistics
export const getStoryStats = () => {
  // TODO: Replace with API call
  // return fetch('/api/story-stats').then(res => res.json());
  
  return {
    totalVideos: videoStories.length,
    totalWords: videoStories.reduce((sum, story) => sum + story.words.length, 0),
    totalViews: videoStories.reduce((sum, story) => sum + story.viewCount, 0),
    categoriesCount: storyCategories.length,
    averageDuration: videoStories.reduce((sum, story) => sum + story.duration, 0) / videoStories.length
  };
};
