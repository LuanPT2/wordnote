// Common vocabulary data for all tabs
// This file will be replaced with API calls in the future

export interface VocabularyItem {
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
  audioUrl?: string;
  imageUrl?: string;
}

export interface Example {
  id: string;
  sentence: string;
  translation: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  wordCount: number;
}

export interface Topic {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  wordCount: number;
}

// Mock vocabulary data
export const vocabularyData: VocabularyItem[] = [
  // Harry Potter Category
  {
    id: '1',
    word: 'serendipity',
    pronunciation: '/ˌser.ənˈdɪp.ə.ti/',
    meaning: 'may mắn tình cờ',
    examples: [
      {
        id: '1-1',
        sentence: 'Meeting my best friend was pure serendipity.',
        translation: 'Gặp được người bạn thân nhất của tôi là sự may mắn tình cờ thuần túy.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2024-01-15',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/serendipity.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '2',
    word: 'magical',
    pronunciation: '/ˈmædʒ.ɪ.kəl/',
    meaning: 'phép thuật, kỳ diệu',
    examples: [
      {
        id: '2-1',
        sentence: 'The magical world of Harry Potter fascinated millions.',
        translation: 'Thế giới phép thuật của Harry Potter đã mê hoặc hàng triệu người.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2024-01-10',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-19',
    audioUrl: 'https://example.com/audio/magical.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '3',
    word: 'puppy',
    pronunciation: '/ˈpʌp.i/',
    meaning: 'chó con',
    examples: [
      {
        id: '3-1',
        sentence: 'The puppy is playing in the garden.',
        translation: 'Chú chó con đang chơi trong vườn.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-12',
    mastered: true,
    reviewCount: 8,
    lastReviewed: '2024-01-21',
    audioUrl: 'https://example.com/audio/puppy.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300'
  },
  {
    id: '4',
    word: 'wizard',
    pronunciation: '/ˈwɪz.əd/',
    meaning: 'phù thủy',
    examples: [
      {
        id: '4-1',
        sentence: 'Harry Potter is a famous wizard.',
        translation: 'Harry Potter là một phù thủy nổi tiếng.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-11',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-20',
    audioUrl: 'https://example.com/audio/wizard.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '5',
    word: 'spell',
    pronunciation: '/spel/',
    meaning: 'câu thần chú',
    examples: [
      {
        id: '5-1',
        sentence: 'The wizard cast a powerful spell.',
        translation: 'Phù thủy đã đọc một câu thần chú mạnh mẽ.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-10',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/spell.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '6',
    word: 'wand',
    pronunciation: '/wɒnd/',
    meaning: 'đũa phép',
    examples: [
      {
        id: '6-1',
        sentence: 'Every wizard needs a wand to perform magic.',
        translation: 'Mỗi phù thủy cần một cây đũa phép để thực hiện phép thuật.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-09',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-18',
    audioUrl: 'https://example.com/audio/wand.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '7',
    word: 'potion',
    pronunciation: '/ˈpəʊ.ʃən/',
    meaning: 'thuốc phép',
    examples: [
      {
        id: '7-1',
        sentence: 'The potion turned the prince into a frog.',
        translation: 'Thuốc phép đã biến hoàng tử thành một con ếch.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2024-01-08',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/potion.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '8',
    word: 'enchanting',
    pronunciation: '/ɪnˈtʃɑːn.tɪŋ/',
    meaning: 'mê hoặc, quyến rũ',
    examples: [
      {
        id: '8-1',
        sentence: 'The enchanting music filled the room.',
        translation: 'Âm nhạc mê hoặc tràn ngập căn phòng.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2024-01-07',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/enchanting.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '9',
    word: 'mystical',
    pronunciation: '/ˈmɪs.tɪ.kəl/',
    meaning: 'thần bí, huyền bí',
    examples: [
      {
        id: '9-1',
        sentence: 'The forest had a mystical atmosphere.',
        translation: 'Khu rừng có một bầu không khí thần bí.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2024-01-06',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/mystical.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '10',
    word: 'wondrous',
    pronunciation: '/ˈwʌn.drəs/',
    meaning: 'kỳ diệu, tuyệt vời',
    examples: [
      {
        id: '10-1',
        sentence: 'The wondrous castle stood on the hill.',
        translation: 'Lâu đài kỳ diệu đứng sừng sững trên đồi.'
      }
    ],
    category: 'Harry Potter',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2024-01-05',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/wondrous.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },

  // TOEIC Category - Business
  {
    id: '11',
    word: 'quarterly',
    pronunciation: '/ˈkwɔːr.tɚ.li/',
    meaning: 'hàng quý',
    examples: [
      {
        id: '11-1',
        sentence: 'We have a quarterly business meeting next week.',
        translation: 'Chúng ta có cuộc họp kinh doanh hàng quý vào tuần tới.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2024-01-11',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/quarterly.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '12',
    word: 'profit',
    pronunciation: '/ˈprɑː.fɪt/',
    meaning: 'lợi nhuận',
    examples: [
      {
        id: '12-1',
        sentence: 'The company made a significant profit this year.',
        translation: 'Công ty đã có lợi nhuận đáng kể trong năm nay.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'hard',
    dateAdded: '2024-01-09',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/profit.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '13',
    word: 'revenue',
    pronunciation: '/ˈrev.ə.nuː/',
    meaning: 'doanh thu',
    examples: [
      {
        id: '13-1',
        sentence: 'The company\'s revenue increased by 20% this quarter.',
        translation: 'Doanh thu của công ty tăng 20% trong quý này.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2024-01-08',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/revenue.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '14',
    word: 'budget',
    pronunciation: '/ˈbʌdʒ.ɪt/',
    meaning: 'ngân sách',
    examples: [
      {
        id: '14-1',
        sentence: 'We need to stay within our budget for this project.',
        translation: 'Chúng ta cần giữ trong ngân sách cho dự án này.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2024-01-07',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-17',
    audioUrl: 'https://example.com/audio/budget.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '15',
    word: 'investment',
    pronunciation: '/ɪnˈvest.mənt/',
    meaning: 'đầu tư',
    examples: [
      {
        id: '15-1',
        sentence: 'The investment in new technology paid off.',
        translation: 'Việc đầu tư vào công nghệ mới đã có kết quả.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2024-01-06',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/investment.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '16',
    word: 'strategy',
    pronunciation: '/ˈstræt.ə.dʒi/',
    meaning: 'chiến lược',
    examples: [
      {
        id: '16-1',
        sentence: 'Our marketing strategy needs to be updated.',
        translation: 'Chiến lược marketing của chúng ta cần được cập nhật.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2024-01-05',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/strategy.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '17',
    word: 'negotiate',
    pronunciation: '/nɪˈɡəʊ.ʃi.eɪt/',
    meaning: 'đàm phán',
    examples: [
      {
        id: '17-1',
        sentence: 'We need to negotiate a better deal.',
        translation: 'Chúng ta cần đàm phán một thỏa thuận tốt hơn.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'hard',
    dateAdded: '2024-01-04',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/negotiate.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '18',
    word: 'contract',
    pronunciation: '/ˈkɒn.trækt/',
    meaning: 'hợp đồng',
    examples: [
      {
        id: '18-1',
        sentence: 'Please review the contract before signing.',
        translation: 'Vui lòng xem xét hợp đồng trước khi ký.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2024-01-03',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-16',
    audioUrl: 'https://example.com/audio/contract.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '19',
    word: 'deadline',
    pronunciation: '/ˈded.laɪn/',
    meaning: 'hạn chót',
    examples: [
      {
        id: '19-1',
        sentence: 'We must meet the deadline for this project.',
        translation: 'Chúng ta phải đáp ứng hạn chót cho dự án này.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2024-01-02',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-15',
    audioUrl: 'https://example.com/audio/deadline.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '20',
    word: 'efficient',
    pronunciation: '/ɪˈfɪʃ.ənt/',
    meaning: 'hiệu quả',
    examples: [
      {
        id: '20-1',
        sentence: 'We need a more efficient system.',
        translation: 'Chúng ta cần một hệ thống hiệu quả hơn.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2024-01-01',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/efficient.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },

  // TOEIC Category - Academic
  {
    id: '21',
    word: 'ambiguous',
    pronunciation: '/æmˈbɪɡ.ju.əs/',
    meaning: 'mơ hồ, không rõ ràng',
    examples: [
      {
        id: '21-1',
        sentence: 'His answer was ambiguous and didn\'t help clarify the situation.',
        translation: 'Câu trả lời của anh ấy mơ hồ và không giúp làm rõ tình huống.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'hard',
    dateAdded: '2024-01-13',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/ambiguous.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '22',
    word: 'analysis',
    pronunciation: '/əˈnæl.ə.sɪs/',
    meaning: 'phân tích',
    examples: [
      {
        id: '22-1',
        sentence: 'The market analysis shows positive trends.',
        translation: 'Phân tích thị trường cho thấy xu hướng tích cực.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'hard',
    dateAdded: '2024-01-07',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/analysis.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '23',
    word: 'hypothesis',
    pronunciation: '/haɪˈpɒθ.ə.sɪs/',
    meaning: 'giả thuyết',
    examples: [
      {
        id: '23-1',
        sentence: 'The scientist proposed a new hypothesis.',
        translation: 'Nhà khoa học đã đề xuất một giả thuyết mới.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'hard',
    dateAdded: '2024-01-06',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/hypothesis.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '24',
    word: 'methodology',
    pronunciation: '/ˌmeθ.əˈdɒl.ə.dʒi/',
    meaning: 'phương pháp luận',
    examples: [
      {
        id: '24-1',
        sentence: 'The research methodology was carefully designed.',
        translation: 'Phương pháp luận nghiên cứu đã được thiết kế cẩn thận.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'hard',
    dateAdded: '2024-01-05',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/methodology.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '25',
    word: 'thesis',
    pronunciation: '/ˈθiː.sɪs/',
    meaning: 'luận văn, luận án',
    examples: [
      {
        id: '25-1',
        sentence: 'She is writing her doctoral thesis.',
        translation: 'Cô ấy đang viết luận án tiến sĩ.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'hard',
    dateAdded: '2024-01-04',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/thesis.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '26',
    word: 'research',
    pronunciation: '/rɪˈsɜːtʃ/',
    meaning: 'nghiên cứu',
    examples: [
      {
        id: '26-1',
        sentence: 'The research findings were published in a journal.',
        translation: 'Kết quả nghiên cứu đã được công bố trên tạp chí.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'medium',
    dateAdded: '2024-01-03',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-14',
    audioUrl: 'https://example.com/audio/research.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '27',
    word: 'evidence',
    pronunciation: '/ˈev.ɪ.dəns/',
    meaning: 'bằng chứng',
    examples: [
      {
        id: '27-1',
        sentence: 'There is strong evidence to support this theory.',
        translation: 'Có bằng chứng mạnh mẽ để hỗ trợ lý thuyết này.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'medium',
    dateAdded: '2024-01-02',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/evidence.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '28',
    word: 'concept',
    pronunciation: '/ˈkɒn.sept/',
    meaning: 'khái niệm',
    examples: [
      {
        id: '28-1',
        sentence: 'This concept is difficult to understand.',
        translation: 'Khái niệm này khó hiểu.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'medium',
    dateAdded: '2024-01-01',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-13',
    audioUrl: 'https://example.com/audio/concept.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '29',
    word: 'theory',
    pronunciation: '/ˈθɪə.ri/',
    meaning: 'lý thuyết',
    examples: [
      {
        id: '29-1',
        sentence: 'Einstein\'s theory of relativity changed physics.',
        translation: 'Lý thuyết tương đối của Einstein đã thay đổi vật lý.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'medium',
    dateAdded: '2023-12-31',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/theory.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '30',
    word: 'conclusion',
    pronunciation: '/kənˈkluː.ʒən/',
    meaning: 'kết luận',
    examples: [
      {
        id: '30-1',
        sentence: 'The conclusion of the study was surprising.',
        translation: 'Kết luận của nghiên cứu thật đáng ngạc nhiên.'
      }
    ],
    category: 'TOEIC',
    topic: 'academic',
    difficulty: 'medium',
    dateAdded: '2023-12-30',
    mastered: true,
    reviewCount: 3,
    lastReviewed: '2024-01-12',
    audioUrl: 'https://example.com/audio/conclusion.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },

  // Daily Category
  {
    id: '31',
    word: 'fascinating',
    pronunciation: '/ˈfæs.ə.neɪ.tɪŋ/',
    meaning: 'hấp dẫn, thú vị',
    examples: [
      {
        id: '31-1',
        sentence: 'The documentary about space was absolutely fascinating.',
        translation: 'Bộ phim tài liệu về vũ trụ thật sự hấp dẫn.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2024-01-14',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-20',
    audioUrl: 'https://example.com/audio/fascinating.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=300'
  },
  {
    id: '32',
    word: 'fantastic',
    pronunciation: '/fænˈtæs.tɪk/',
    meaning: 'tuyệt vời',
    examples: [
      {
        id: '32-1',
        sentence: 'The weather was fantastic yesterday.',
        translation: 'Thời tiết hôm qua thật tuyệt vời.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-08',
    mastered: true,
    reviewCount: 7,
    lastReviewed: '2024-01-18',
    audioUrl: 'https://example.com/audio/fantastic.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '33',
    word: 'destination',
    pronunciation: '/ˌdes.tɪˈneɪ.ʃən/',
    meaning: 'điểm đến',
    examples: [
      {
        id: '33-1',
        sentence: 'Paris is my favorite travel destination.',
        translation: 'Paris là điểm đến du lịch yêu thích của tôi.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2024-01-06',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-17',
    audioUrl: 'https://example.com/audio/destination.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300'
  },
  {
    id: '34',
    word: 'delicious',
    pronunciation: '/dɪˈlɪʃ.əs/',
    meaning: 'ngon',
    examples: [
      {
        id: '34-1',
        sentence: 'This pizza is absolutely delicious!',
        translation: 'Pizza này thật sự rất ngon!'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-05',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-16',
    audioUrl: 'https://example.com/audio/delicious.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=300'
  },
  {
    id: '35',
    word: 'comfortable',
    pronunciation: '/ˈkʌm.fə.tə.bəl/',
    meaning: 'thoải mái',
    examples: [
      {
        id: '35-1',
        sentence: 'This chair is very comfortable.',
        translation: 'Chiếc ghế này rất thoải mái.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-04',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-15',
    audioUrl: 'https://example.com/audio/comfortable.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300'
  },
  {
    id: '36',
    word: 'beautiful',
    pronunciation: '/ˈbjuː.tɪ.fəl/',
    meaning: 'đẹp',
    examples: [
      {
        id: '36-1',
        sentence: 'The sunset was beautiful tonight.',
        translation: 'Hoàng hôn tối nay thật đẹp.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-03',
    mastered: true,
    reviewCount: 8,
    lastReviewed: '2024-01-14',
    audioUrl: 'https://example.com/audio/beautiful.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '37',
    word: 'interesting',
    pronunciation: '/ˈɪn.trəs.tɪŋ/',
    meaning: 'thú vị',
    examples: [
      {
        id: '37-1',
        sentence: 'That book looks very interesting.',
        translation: 'Cuốn sách đó trông rất thú vị.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-02',
    mastered: true,
    reviewCount: 7,
    lastReviewed: '2024-01-13',
    audioUrl: 'https://example.com/audio/interesting.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=300'
  },
  {
    id: '38',
    word: 'amazing',
    pronunciation: '/əˈmeɪ.zɪŋ/',
    meaning: 'tuyệt vời, đáng kinh ngạc',
    examples: [
      {
        id: '38-1',
        sentence: 'The view from the mountain was amazing.',
        translation: 'Cảnh tượng từ trên núi thật tuyệt vời.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2024-01-01',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-12',
    audioUrl: 'https://example.com/audio/amazing.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '39',
    word: 'wonderful',
    pronunciation: '/ˈwʌn.də.fəl/',
    meaning: 'tuyệt vời',
    examples: [
      {
        id: '39-1',
        sentence: 'We had a wonderful time at the party.',
        translation: 'Chúng tôi đã có thời gian tuyệt vời tại bữa tiệc.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-31',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-11',
    audioUrl: 'https://example.com/audio/wonderful.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '40',
    word: 'excellent',
    pronunciation: '/ˈek.səl.ənt/',
    meaning: 'xuất sắc',
    examples: [
      {
        id: '40-1',
        sentence: 'Your performance was excellent!',
        translation: 'Màn trình diễn của bạn thật xuất sắc!'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-30',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-10',
    audioUrl: 'https://example.com/audio/excellent.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },

  // More Daily Category words
  {
    id: '41',
    word: 'terrible',
    pronunciation: '/ˈter.ə.bəl/',
    meaning: 'kinh khủng, tệ hại',
    examples: [
      {
        id: '41-1',
        sentence: 'The weather was terrible yesterday.',
        translation: 'Thời tiết hôm qua thật kinh khủng.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-29',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/terrible.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '42',
    word: 'awful',
    pronunciation: '/ˈɔː.fəl/',
    meaning: 'tệ hại, khủng khiếp',
    examples: [
      {
        id: '42-1',
        sentence: 'The traffic was awful this morning.',
        translation: 'Giao thông sáng nay thật tệ hại.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-28',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/awful.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '43',
    word: 'horrible',
    pronunciation: '/ˈhɒr.ə.bəl/',
    meaning: 'kinh khủng',
    examples: [
      {
        id: '43-1',
        sentence: 'That movie was horrible!',
        translation: 'Bộ phim đó thật kinh khủng!'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-27',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/horrible.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300'
  },
  {
    id: '44',
    word: 'perfect',
    pronunciation: '/ˈpɜː.fekt/',
    meaning: 'hoàn hảo',
    examples: [
      {
        id: '44-1',
        sentence: 'This is the perfect day for a picnic.',
        translation: 'Đây là ngày hoàn hảo để đi dã ngoại.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'easy',
    dateAdded: '2023-12-26',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-09',
    audioUrl: 'https://example.com/audio/perfect.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '45',
    word: 'incredible',
    pronunciation: '/ɪnˈkred.ə.bəl/',
    meaning: 'không thể tin được',
    examples: [
      {
        id: '45-1',
        sentence: 'The view from the top was incredible.',
        translation: 'Cảnh tượng từ trên cao thật không thể tin được.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2023-12-25',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/incredible.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '46',
    word: 'magnificent',
    pronunciation: '/mæɡˈnɪf.ə.sənt/',
    meaning: 'tráng lệ, hùng vĩ',
    examples: [
      {
        id: '46-1',
        sentence: 'The palace was magnificent.',
        translation: 'Cung điện thật tráng lệ.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2023-12-24',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/magnificent.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '47',
    word: 'gorgeous',
    pronunciation: '/ˈɡɔː.dʒəs/',
    meaning: 'tuyệt đẹp',
    examples: [
      {
        id: '47-1',
        sentence: 'She looked gorgeous in that dress.',
        translation: 'Cô ấy trông tuyệt đẹp trong chiếc váy đó.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2023-12-23',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/gorgeous.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '48',
    word: 'stunning',
    pronunciation: '/ˈstʌn.ɪŋ/',
    meaning: 'choáng ngợp, tuyệt đẹp',
    examples: [
      {
        id: '48-1',
        sentence: 'The sunset was absolutely stunning.',
        translation: 'Hoàng hôn thật sự choáng ngợp.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'medium',
    dateAdded: '2023-12-22',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/stunning.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '49',
    word: 'breathtaking',
    pronunciation: '/ˈbreθ.teɪ.kɪŋ/',
    meaning: 'nghẹt thở, tuyệt đẹp',
    examples: [
      {
        id: '49-1',
        sentence: 'The view from the mountain was breathtaking.',
        translation: 'Cảnh tượng từ trên núi thật nghẹt thở.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2023-12-21',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/breathtaking.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },
  {
    id: '50',
    word: 'spectacular',
    pronunciation: '/spekˈtæk.jə.lər/',
    meaning: 'ngoạn mục, tuyệt vời',
    examples: [
      {
        id: '50-1',
        sentence: 'The fireworks display was spectacular.',
        translation: 'Màn pháo hoa thật ngoạn mục.'
      }
    ],
    category: 'Daily',
    topic: 'general',
    difficulty: 'hard',
    dateAdded: '2023-12-20',
    mastered: false,
    reviewCount: 0,
    audioUrl: 'https://example.com/audio/spectacular.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300'
  },

  // More TOEIC Business words
  {
    id: '51',
    word: 'meeting',
    pronunciation: '/ˈmiː.tɪŋ/',
    meaning: 'cuộc họp',
    examples: [
      {
        id: '51-1',
        sentence: 'We have a meeting at 3 PM today.',
        translation: 'Chúng ta có cuộc họp lúc 3 giờ chiều hôm nay.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2023-12-19',
    mastered: true,
    reviewCount: 7,
    lastReviewed: '2024-01-08',
    audioUrl: 'https://example.com/audio/meeting.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '52',
    word: 'presentation',
    pronunciation: '/ˌprez.ənˈteɪ.ʃən/',
    meaning: 'thuyết trình',
    examples: [
      {
        id: '52-1',
        sentence: 'She gave an excellent presentation.',
        translation: 'Cô ấy đã thuyết trình xuất sắc.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-18',
    mastered: false,
    reviewCount: 4,
    audioUrl: 'https://example.com/audio/presentation.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '53',
    word: 'conference',
    pronunciation: '/ˈkɒn.fər.əns/',
    meaning: 'hội nghị',
    examples: [
      {
        id: '53-1',
        sentence: 'The annual conference will be held in Paris.',
        translation: 'Hội nghị hàng năm sẽ được tổ chức tại Paris.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-17',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/conference.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '54',
    word: 'seminar',
    pronunciation: '/ˈsem.ɪ.nɑːr/',
    meaning: 'hội thảo',
    examples: [
      {
        id: '54-1',
        sentence: 'I attended a marketing seminar last week.',
        translation: 'Tôi đã tham dự một hội thảo marketing tuần trước.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-16',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/seminar.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '55',
    word: 'workshop',
    pronunciation: '/ˈwɜːk.ʃɒp/',
    meaning: 'xưởng, lớp học thực hành',
    examples: [
      {
        id: '55-1',
        sentence: 'The workshop on leadership was very helpful.',
        translation: 'Lớp học thực hành về lãnh đạo rất hữu ích.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2023-12-15',
    mastered: true,
    reviewCount: 5,
    lastReviewed: '2024-01-07',
    audioUrl: 'https://example.com/audio/workshop.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '56',
    word: 'training',
    pronunciation: '/ˈtreɪ.nɪŋ/',
    meaning: 'đào tạo',
    examples: [
      {
        id: '56-1',
        sentence: 'New employees need proper training.',
        translation: 'Nhân viên mới cần được đào tạo đúng cách.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'easy',
    dateAdded: '2023-12-14',
    mastered: true,
    reviewCount: 6,
    lastReviewed: '2024-01-06',
    audioUrl: 'https://example.com/audio/training.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '57',
    word: 'development',
    pronunciation: '/dɪˈvel.əp.mənt/',
    meaning: 'phát triển',
    examples: [
      {
        id: '57-1',
        sentence: 'The development of new products takes time.',
        translation: 'Việc phát triển sản phẩm mới cần thời gian.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-13',
    mastered: false,
    reviewCount: 3,
    audioUrl: 'https://example.com/audio/development.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '58',
    word: 'improvement',
    pronunciation: '/ɪmˈpruːv.mənt/',
    meaning: 'cải thiện',
    examples: [
      {
        id: '58-1',
        sentence: 'We need to make improvements to our service.',
        translation: 'Chúng ta cần cải thiện dịch vụ của mình.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-12',
    mastered: false,
    reviewCount: 2,
    audioUrl: 'https://example.com/audio/improvement.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '59',
    word: 'innovation',
    pronunciation: '/ˌɪn.əˈveɪ.ʃən/',
    meaning: 'đổi mới, sáng tạo',
    examples: [
      {
        id: '59-1',
        sentence: 'Innovation is key to business success.',
        translation: 'Đổi mới là chìa khóa thành công trong kinh doanh.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'hard',
    dateAdded: '2023-12-11',
    mastered: false,
    reviewCount: 1,
    audioUrl: 'https://example.com/audio/innovation.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  },
  {
    id: '60',
    word: 'technology',
    pronunciation: '/tekˈnɒl.ə.dʒi/',
    meaning: 'công nghệ',
    examples: [
      {
        id: '60-1',
        sentence: 'Technology is changing rapidly.',
        translation: 'Công nghệ đang thay đổi nhanh chóng.'
      }
    ],
    category: 'TOEIC',
    topic: 'business',
    difficulty: 'medium',
    dateAdded: '2023-12-10',
    mastered: true,
    reviewCount: 4,
    lastReviewed: '2024-01-05',
    audioUrl: 'https://example.com/audio/technology.mp3',
    imageUrl: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=300'
  }
];

// Categories data
export const categoriesData: Category[] = [
  {
    id: '1',
    name: 'Harry Potter',
    description: 'Từ vựng từ thế giới phép thuật Harry Potter',
    color: 'bg-red-100 text-red-800',
    icon: '🧙‍♂️',
    wordCount: 10
  },
  {
    id: '2',
    name: 'TOEIC',
    description: 'Từ vựng luyện thi TOEIC',
    color: 'bg-green-100 text-green-800',
    icon: '📚',
    wordCount: 30
  },
  {
    id: '3',
    name: 'Daily',
    description: 'Từ vựng giao tiếp hàng ngày',
    color: 'bg-blue-100 text-blue-800',
    icon: '💬',
    wordCount: 20
  },
  {
    id: '4',
    name: 'New',
    description: 'Từ vựng mới được thêm',
    color: 'bg-purple-100 text-purple-800',
    icon: '✨',
    wordCount: 0
  },
  {
    id: '5',
    name: 'Story',
    description: 'Từ vựng từ các câu chuyện',
    color: 'bg-orange-100 text-orange-800',
    icon: '📖',
    wordCount: 0
  }
];

// Topics data
export const topicsData: Topic[] = [
  {
    id: '1',
    name: 'general',
    description: 'Tổng quát',
    color: 'bg-purple-100 text-purple-800',
    icon: '📚',
    wordCount: 6
  },
  {
    id: '2',
    name: 'academic',
    description: 'Học thuật',
    color: 'bg-blue-100 text-blue-800',
    icon: '🎓',
    wordCount: 2
  },
  {
    id: '3',
    name: 'business',
    description: 'Kinh doanh',
    color: 'bg-green-100 text-green-800',
    icon: '💼',
    wordCount: 2
  },
  {
    id: '4',
    name: 'advanced',
    description: 'Nâng cao',
    color: 'bg-red-100 text-red-800',
    icon: '🚀',
    wordCount: 0
  }
];

// Difficulty levels
export const difficultyLevels = [
  { value: 'easy', label: 'Dễ', color: 'bg-green-100 text-green-800', icon: '🟢' },
  { value: 'medium', label: 'Trung bình', color: 'bg-yellow-100 text-yellow-800', icon: '🟡' },
  { value: 'hard', label: 'Khó', color: 'bg-red-100 text-red-800', icon: '🔴' }
];

// API-like functions (will be replaced with real API calls)
export const getVocabularyList = (): VocabularyItem[] => {
  return vocabularyData;
};

export const getVocabularyById = (id: string): VocabularyItem | undefined => {
  return vocabularyData.find(item => item.id === id);
};

export const getVocabularyByCategory = (category: string): VocabularyItem[] => {
  return vocabularyData.filter(item => item.category === category);
};

export const getVocabularyByTopic = (topic: string): VocabularyItem[] => {
  return vocabularyData.filter(item => item.topic === topic);
};

export const getVocabularyByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): VocabularyItem[] => {
  return vocabularyData.filter(item => item.difficulty === difficulty);
};

export const getVocabularyByMastered = (mastered: boolean): VocabularyItem[] => {
  return vocabularyData.filter(item => item.mastered === mastered);
};

export const searchVocabulary = (searchTerm: string): VocabularyItem[] => {
  const term = searchTerm.toLowerCase();
  return vocabularyData.filter(item => 
    item.word.toLowerCase().includes(term) ||
    item.meaning.toLowerCase().includes(term) ||
    item.pronunciation.toLowerCase().includes(term)
  );
};

export const getCategories = (): Category[] => {
  return categoriesData;
};

export const getCategoryById = (id: string): Category | undefined => {
  return categoriesData.find(category => category.id === id);
};

export const getTopics = (): Topic[] => {
  return topicsData;
};

export const getTopicById = (id: string): Topic | undefined => {
  return topicsData.find(topic => topic.id === id);
};

export const getDifficultyLevels = () => {
  return difficultyLevels;
};

// Statistics functions
export const getVocabularyStats = () => {
  const total = vocabularyData.length;
  const mastered = vocabularyData.filter(item => item.mastered).length;
  const byDifficulty = {
    easy: vocabularyData.filter(item => item.difficulty === 'easy').length,
    medium: vocabularyData.filter(item => item.difficulty === 'medium').length,
    hard: vocabularyData.filter(item => item.difficulty === 'hard').length
  };
  const byCategory = categoriesData.map(category => ({
    ...category,
    wordCount: vocabularyData.filter(item => item.category === category.name).length
  }));

  return {
    total,
    mastered,
    remaining: total - mastered,
    masteryRate: total > 0 ? Math.round((mastered / total) * 100) : 0,
    byDifficulty,
    byCategory
  };
};

// Add new vocabulary item
export const addVocabularyItem = (item: Omit<VocabularyItem, 'id' | 'dateAdded' | 'mastered' | 'reviewCount'>): VocabularyItem => {
  const newItem: VocabularyItem = {
    ...item,
    id: Date.now().toString(),
    dateAdded: new Date().toISOString().split('T')[0],
    mastered: false,
    reviewCount: 0
  };
  
  vocabularyData.unshift(newItem);
  return newItem;
};

// Update vocabulary item
export const updateVocabularyItem = (id: string, updates: Partial<VocabularyItem>): VocabularyItem | null => {
  const index = vocabularyData.findIndex(item => item.id === id);
  if (index !== -1) {
    vocabularyData[index] = { ...vocabularyData[index], ...updates };
    return vocabularyData[index];
  }
  return null;
};

// Delete vocabulary item
export const deleteVocabularyItem = (id: string): boolean => {
  const index = vocabularyData.findIndex(item => item.id === id);
  if (index !== -1) {
    vocabularyData.splice(index, 1);
    return true;
  }
  return false;
};

// Add new category
export const addCategory = (category: Omit<Category, 'id' | 'wordCount'>): Category => {
  const newCategory: Category = {
    ...category,
    id: Date.now().toString(),
    wordCount: 0
  };
  
  categoriesData.push(newCategory);
  return newCategory;
};

// Update category
export const updateCategory = (id: string, updates: Partial<Category>): Category | null => {
  const index = categoriesData.findIndex(category => category.id === id);
  if (index !== -1) {
    categoriesData[index] = { ...categoriesData[index], ...updates };
    return categoriesData[index];
  }
  return null;
};

// Delete category
export const deleteCategory = (id: string): boolean => {
  const index = categoriesData.findIndex(category => category.id === id);
  if (index !== -1) {
    categoriesData.splice(index, 1);
    return true;
  }
  return false;
};
