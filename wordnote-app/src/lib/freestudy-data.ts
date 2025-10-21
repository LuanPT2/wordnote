// freestudy-data.ts - Data cho Free Study Screen
// Được thiết kế để dễ dàng chuyển sang API sau này

export interface StudyTopic {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  wordCount: number;
  completedWords: number;
  subTopics: SubTopic[];
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  tags: string[];
}

export interface SubTopic {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  words: StudyWord[];
  order: number;
}

export interface StudyWord {
  id: string;
  word: string;
  pronunciation: string;
  meaning: string;
  examples: StudyExample[];
  image: string;
  difficulty: 'easy' | 'medium' | 'hard';
  audioUrl?: string;
  mastered: boolean;
  reviewCount: number;
  lastReviewed?: string;
}

export interface StudyExample {
  id: string;
  sentence: string;
  translation: string;
  audioUrl?: string;
}

export interface StudyCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  topicCount: number;
  totalWords: number;
}

// Mock data - sẽ được thay thế bằng API calls
const studyCategories: StudyCategory[] = [
  {
    id: '1',
    name: 'Nature',
    description: 'Học từ vựng về thiên nhiên và môi trường',
    color: 'bg-green-100 text-green-800',
    icon: '🌿',
    topicCount: 3,
    totalWords: 45
  },
  {
    id: '2',
    name: 'Food',
    description: 'Từ vựng về ẩm thực và đồ ăn',
    color: 'bg-orange-100 text-orange-800',
    icon: '🍕',
    topicCount: 2,
    totalWords: 30
  },
  {
    id: '3',
    name: 'Transportation',
    description: 'Phương tiện giao thông và di chuyển',
    color: 'bg-blue-100 text-blue-800',
    icon: '🚗',
    topicCount: 2,
    totalWords: 25
  },
  {
    id: '4',
    name: 'Career',
    description: 'Nghề nghiệp và công việc',
    color: 'bg-purple-100 text-purple-800',
    icon: '💼',
    topicCount: 2,
    totalWords: 35
  }
];

const studyTopics: StudyTopic[] = [
  {
    id: '1',
    title: 'Động vật và Thú cưng',
    description: 'Học từ vựng về các loài động vật, thú cưng và đặc điểm của chúng',
    image: 'https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400',
    category: 'Nature',
    difficulty: 'easy',
    wordCount: 45,
    completedWords: 12,
    isPublished: true,
    tags: ['animals', 'pets', 'nature'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    subTopics: [
      {
        id: '1-1',
        title: 'Thú cưng trong nhà',
        description: 'Chó, mèo và các thú cưng phổ biến',
        completed: false,
        order: 1,
        words: [
          {
            id: '1-1-1',
            word: 'puppy',
            pronunciation: '/ˈpʌp.i/',
            meaning: 'chó con',
            examples: [
              {
                id: '1-1-1-1',
                sentence: 'The puppy is playing in the garden.',
                translation: 'Chú chó con đang chơi trong vườn.',
                audioUrl: 'https://example.com/audio/puppy-example.mp3'
              }
            ],
            image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300',
            difficulty: 'easy',
            audioUrl: 'https://example.com/audio/puppy.mp3',
            mastered: false,
            reviewCount: 0
          },
          {
            id: '1-1-2',
            word: 'kitten',
            pronunciation: '/ˈkɪt.ən/',
            meaning: 'mèo con',
            examples: [
              {
                id: '1-1-2-1',
                sentence: 'The kitten is sleeping on the sofa.',
                translation: 'Chú mèo con đang ngủ trên ghế sofa.',
                audioUrl: 'https://example.com/audio/kitten-example.mp3'
              }
            ],
            image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=300',
            difficulty: 'easy',
            audioUrl: 'https://example.com/audio/kitten.mp3',
            mastered: true,
            reviewCount: 5,
            lastReviewed: '2024-01-14T15:30:00Z'
          }
        ]
      },
      {
        id: '1-2',
        title: 'Động vật hoang dã',
        description: 'Các loài động vật sống trong tự nhiên',
        completed: false,
        order: 2,
        words: [
          {
            id: '1-2-1',
            word: 'elephant',
            pronunciation: '/ˈel.ə.fənt/',
            meaning: 'con voi',
            examples: [
              {
                id: '1-2-1-1',
                sentence: 'The elephant is the largest land animal.',
                translation: 'Voi là động vật trên cạn lớn nhất.',
                audioUrl: 'https://example.com/audio/elephant-example.mp3'
              }
            ],
            image: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=300',
            difficulty: 'easy',
            audioUrl: 'https://example.com/audio/elephant.mp3',
            mastered: false,
            reviewCount: 2
          }
        ]
      }
    ]
  },
  {
    id: '2',
    title: 'Thức ăn và Đồ uống',
    description: 'Từ vựng về các loại thức ăn, đồ uống và cách chế biến',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400',
    category: 'Food',
    difficulty: 'easy',
    wordCount: 30,
    completedWords: 8,
    isPublished: true,
    tags: ['food', 'drinks', 'cooking'],
    createdAt: '2024-01-14T14:30:00Z',
    updatedAt: '2024-01-14T14:30:00Z',
    subTopics: [
      {
        id: '2-1',
        title: 'Trái cây và Rau củ',
        description: 'Các loại trái cây và rau củ phổ biến',
        completed: false,
        order: 1,
        words: [
          {
            id: '2-1-1',
            word: 'apple',
            pronunciation: '/ˈæp.əl/',
            meaning: 'quả táo',
            examples: [
              {
                id: '2-1-1-1',
                sentence: 'I eat an apple every day.',
                translation: 'Tôi ăn một quả táo mỗi ngày.',
                audioUrl: 'https://example.com/audio/apple-example.mp3'
              }
            ],
            image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300',
            difficulty: 'easy',
            audioUrl: 'https://example.com/audio/apple.mp3',
            mastered: true,
            reviewCount: 10,
            lastReviewed: '2024-01-13T09:15:00Z'
          }
        ]
      }
    ]
  },
  {
    id: '3',
    title: 'Phương tiện Giao thông',
    description: 'Học từ vựng về các phương tiện giao thông và di chuyển',
    image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
    category: 'Transportation',
    difficulty: 'medium',
    wordCount: 25,
    completedWords: 5,
    isPublished: true,
    tags: ['transportation', 'travel', 'vehicles'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    subTopics: [
      {
        id: '3-1',
        title: 'Xe cộ trong thành phố',
        description: 'Các phương tiện giao thông trong thành phố',
        completed: false,
        order: 1,
        words: [
          {
            id: '3-1-1',
            word: 'bicycle',
            pronunciation: '/ˈbaɪ.sɪ.kəl/',
            meaning: 'xe đạp',
            examples: [
              {
                id: '3-1-1-1',
                sentence: 'I ride my bicycle to work.',
                translation: 'Tôi đạp xe đạp đi làm.',
                audioUrl: 'https://example.com/audio/bicycle-example.mp3'
              }
            ],
            image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300',
            difficulty: 'easy',
            audioUrl: 'https://example.com/audio/bicycle.mp3',
            mastered: false,
            reviewCount: 3
          }
        ]
      }
    ]
  }
];

// API-like functions - dễ dàng thay thế bằng real API calls
export const getStudyCategories = (): StudyCategory[] => {
  // TODO: Replace with API call
  // return fetch('/api/study-categories').then(res => res.json());
  return studyCategories;
};

export const getStudyTopics = (): StudyTopic[] => {
  // TODO: Replace with API call
  // return fetch('/api/study-topics').then(res => res.json());
  return studyTopics;
};

export const getStudyTopicById = (id: string): StudyTopic | undefined => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/${id}`).then(res => res.json());
  return studyTopics.find(topic => topic.id === id);
};

export const getStudyTopicsByCategory = (category: string): StudyTopic[] => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics?category=${category}`).then(res => res.json());
  return studyTopics.filter(topic => topic.category === category);
};

export const getStudyTopicsByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): StudyTopic[] => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics?difficulty=${difficulty}`).then(res => res.json());
  return studyTopics.filter(topic => topic.difficulty === difficulty);
};

export const searchStudyTopics = (query: string): StudyTopic[] => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/search?q=${query}`).then(res => res.json());
  const lowercaseQuery = query.toLowerCase();
  return studyTopics.filter(topic => 
    topic.title.toLowerCase().includes(lowercaseQuery) ||
    topic.description.toLowerCase().includes(lowercaseQuery) ||
    topic.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
  );
};

export const updateStudyTopic = (id: string, updates: Partial<StudyTopic>): StudyTopic | null => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/${id}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => res.json());
  
  const index = studyTopics.findIndex(topic => topic.id === id);
  if (index !== -1) {
    studyTopics[index] = { ...studyTopics[index], ...updates, updatedAt: new Date().toISOString() };
    return studyTopics[index];
  }
  return null;
};

export const addStudyTopic = (topic: Omit<StudyTopic, 'id' | 'createdAt' | 'updatedAt'>): StudyTopic => {
  // TODO: Replace with API call
  // return fetch('/api/study-topics', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(topic)
  // }).then(res => res.json());
  
  const newTopic: StudyTopic = {
    ...topic,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  studyTopics.push(newTopic);
  return newTopic;
};

export const deleteStudyTopic = (id: string): boolean => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/${id}`, { method: 'DELETE' }).then(res => res.ok);
  
  const index = studyTopics.findIndex(topic => topic.id === id);
  if (index !== -1) {
    studyTopics.splice(index, 1);
    return true;
  }
  return false;
};

// Word management functions
export const updateStudyWord = (topicId: string, wordId: string, updates: Partial<StudyWord>): StudyWord | null => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/${topicId}/words/${wordId}`, {
  //   method: 'PUT',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(updates)
  // }).then(res => res.json());
  
  const topic = studyTopics.find(t => t.id === topicId);
  if (!topic) return null;
  
  for (const subTopic of topic.subTopics) {
    const word = subTopic.words.find(w => w.id === wordId);
    if (word) {
      Object.assign(word, updates);
      if (updates.mastered) {
        word.lastReviewed = new Date().toISOString();
        word.reviewCount = (word.reviewCount || 0) + 1;
      }
      return word;
    }
  }
  return null;
};

export const addStudyWord = (topicId: string, subTopicId: string, word: Omit<StudyWord, 'id'>): StudyWord | null => {
  // TODO: Replace with API call
  // return fetch(`/api/study-topics/${topicId}/subtopics/${subTopicId}/words`, {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(word)
  // }).then(res => res.json());
  
  const topic = studyTopics.find(t => t.id === topicId);
  if (!topic) return null;
  
  const subTopic = topic.subTopics.find(st => st.id === subTopicId);
  if (!subTopic) return null;
  
  const newWord: StudyWord = {
    ...word,
    id: `${topicId}-${subTopicId}-${Date.now()}`
  };
  subTopic.words.push(newWord);
  topic.wordCount = topic.subTopics.reduce((sum, st) => sum + st.words.length, 0);
  return newWord;
};

// Statistics
export const getStudyStats = () => {
  // TODO: Replace with API call
  // return fetch('/api/study-stats').then(res => res.json());
  
  const totalWords = studyTopics.reduce((sum, topic) => sum + topic.wordCount, 0);
  const completedWords = studyTopics.reduce((sum, topic) => sum + topic.completedWords, 0);
  const masteredWords = studyTopics.reduce((sum, topic) => 
    sum + topic.subTopics.reduce((subSum, subTopic) => 
      subSum + subTopic.words.filter(word => word.mastered).length, 0), 0);
  
  return {
    totalTopics: studyTopics.length,
    totalWords,
    completedWords,
    masteredWords,
    categoriesCount: studyCategories.length,
    completionRate: totalWords > 0 ? (completedWords / totalWords) * 100 : 0,
    masteryRate: totalWords > 0 ? (masteredWords / totalWords) * 100 : 0
  };
};
