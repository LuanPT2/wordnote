import React, { useState, useRef, useEffect } from "react";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Badge } from "../../ui/badge";
import { Card, CardContent } from "../../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
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
  Share2,
  ChevronRight,
} from "lucide-react";
import { ScrollArea } from "../../ui/scroll-area";

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
  level: "beginner" | "intermediate" | "advanced";
}

interface DictionarySearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveWord: (
    word: string,
    meaning: string,
    pronunciation: string,
    category: string,
  ) => void;
  categories: string[];
}

export function DictionarySearchModal({
  isOpen,
  onClose,
  onSaveWord,
  categories,
}: DictionarySearchModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<
    DictionaryEntry[]
  >([]);
  const [selectedEntry, setSelectedEntry] =
    useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState(
    categories[0] || "Daily",
  );
  const [showSaveConfirm, setShowSaveConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Mock dictionary data
  const mockDictionary: Record<string, DictionaryEntry> = {
    hello: {
      word: "hello",
      phonetic: "/həˈloʊ/",
      partOfSpeech: "exclamation, noun",
      definition:
        "used as a greeting or to begin a phone conversation",
      example: "Hello, how are you today?",
      exampleTranslation: "Xin chào, bạn có khỏe không?",
      synonyms: ["hi", "hey", "greetings", "good morning"],
      antonyms: ["goodbye", "farewell"],
      usage: "Used informally and formally to greet someone",
      relatedWords: ["greeting", "salutation", "welcome"],
      level: "beginner",
    },
    serendipity: {
      word: "serendipity",
      phonetic: "/ˌserənˈdɪpəti/",
      partOfSpeech: "noun",
      definition:
        "the occurrence and development of events by chance in a happy or beneficial way",
      example:
        "It was pure serendipity that we met at the coffee shop.",
      exampleTranslation:
        "Thật là may mắn tình cờ khi chúng ta gặp nhau ở quán cà phê.",
      synonyms: ["chance", "luck", "fortune", "coincidence"],
      antonyms: ["misfortune", "bad luck"],
      usage:
        "Often used to describe pleasant surprises or fortunate accidents",
      relatedWords: [
        "serendipitous",
        "fortuitous",
        "accidental",
      ],
      level: "advanced",
    },
    amazing: {
      word: "amazing",
      phonetic: "/əˈmeɪzɪŋ/",
      partOfSpeech: "adjective",
      definition:
        "causing great surprise or wonder; astonishing",
      example:
        "The view from the mountain was absolutely amazing.",
      exampleTranslation:
        "Khung cảnh từ núi thật sự tuyệt vời.",
      synonyms: [
        "astonishing",
        "incredible",
        "wonderful",
        "fantastic",
      ],
      antonyms: ["ordinary", "boring", "unimpressive"],
      usage:
        "Used to express admiration or surprise about something impressive",
      relatedWords: ["amaze", "amazement", "amazingly"],
      level: "intermediate",
    },
    beautiful: {
      word: "beautiful",
      phonetic: "/ˈbjuːtɪfʊl/",
      partOfSpeech: "adjective",
      definition: "pleasing the senses or mind aesthetically",
      example: "She wore a beautiful dress to the party.",
      exampleTranslation:
        "Cô ấy mặc một chiếc váy đẹp đến bữa tiệc.",
      synonyms: [
        "lovely",
        "gorgeous",
        "stunning",
        "attractive",
      ],
      antonyms: ["ugly", "hideous", "unattractive"],
      usage:
        "Used to describe something that is visually or aesthetically pleasing",
      relatedWords: ["beauty", "beautify", "beautifully"],
      level: "beginner",
    },
    procrastinate: {
      word: "procrastinate",
      phonetic: "/prəˈkræstɪneɪt/",
      partOfSpeech: "verb",
      definition:
        "delay or postpone action; put off doing something",
      example:
        "I tend to procrastinate when I have difficult tasks to complete.",
      exampleTranslation:
        "Tôi có xu hướng trì hoãn khi có những nhiệm vụ khó hoàn thành.",
      synonyms: ["delay", "postpone", "defer", "stall"],
      antonyms: ["expedite", "advance", "hasten"],
      usage:
        "Often used in academic or work contexts to describe delaying important tasks",
      relatedWords: ["procrastination", "procrastinator"],
      level: "advanced",
    },
    language: {
      word: "language",
      phonetic: "/ˈlæŋɡwɪdʒ/",
      partOfSpeech: "noun",
      definition:
        "a system of communication used by a particular country or community",
      example: "She speaks three languages fluently.",
      exampleTranslation: "Cô ấy nói thành thạo ba ngôn ngữ.",
      synonyms: ["tongue", "speech", "dialect", "vocabulary"],
      antonyms: ["silence", "muteness"],
      usage:
        "Used to refer to any system of human communication",
      relatedWords: ["linguistic", "linguist", "bilingual"],
      level: "beginner",
    },
    learn: {
      word: "learn",
      phonetic: "/lɜːrn/",
      partOfSpeech: "verb",
      definition:
        "to gain knowledge or skill by studying, practicing, or being taught",
      example: "I want to learn how to play the guitar.",
      exampleTranslation: "Tôi muốn học cách chơi guitar.",
      synonyms: ["study", "master", "grasp", "acquire"],
      antonyms: ["forget", "unlearn", "ignore"],
      usage: "Used when acquiring new knowledge or skills",
      relatedWords: ["learner", "learning", "learned"],
      level: "beginner",
    },
    library: {
      word: "library",
      phonetic: "/ˈlaɪbreri/",
      partOfSpeech: "noun",
      definition:
        "a building or room containing collections of books for people to read or borrow",
      example:
        "We spent the afternoon studying at the library.",
      exampleTranslation:
        "Chúng tôi dành buổi chiều học ở thư viện.",
      synonyms: ["bookhouse", "archive", "collection"],
      antonyms: [],
      usage:
        "Refers to places where books and materials are kept",
      relatedWords: ["librarian", "bibliotheca"],
      level: "beginner",
    },
    literature: {
      word: "literature",
      phonetic: "/ˈlɪtərətʃər/",
      partOfSpeech: "noun",
      definition:
        "written works, especially those considered of superior or lasting artistic merit",
      example: "She studied English literature at university.",
      exampleTranslation:
        "Cô ấy học văn học Anh ở trường đại học.",
      synonyms: ["writing", "texts", "works", "publications"],
      antonyms: [],
      usage: "Used to describe written artistic works",
      relatedWords: ["literary", "literate", "literacy"],
      level: "intermediate",
    },
    logical: {
      word: "logical",
      phonetic: "/ˈlɑːdʒɪkl/",
      partOfSpeech: "adjective",
      definition:
        "according to the rules of logic or formal argument; reasonable",
      example: "It seemed the logical thing to do at the time.",
      exampleTranslation:
        "Lúc đó dường như đó là điều hợp lý để làm.",
      synonyms: [
        "reasonable",
        "rational",
        "sensible",
        "coherent",
      ],
      antonyms: ["illogical", "irrational", "absurd"],
      usage: "Used to describe reasoning that makes sense",
      relatedWords: ["logic", "logically", "logician"],
      level: "intermediate",
    },
    luxury: {
      word: "luxury",
      phonetic: "/ˈlʌkʃəri/",
      partOfSpeech: "noun",
      definition:
        "the state of great comfort and extravagant living",
      example: "They lived a life of luxury in their mansion.",
      exampleTranslation:
        "Họ sống một cuộc sống xa hoa trong biệt thự của họ.",
      synonyms: [
        "opulence",
        "extravagance",
        "affluence",
        "comfort",
      ],
      antonyms: ["poverty", "simplicity", "austerity"],
      usage:
        "Refers to expensive and comfortable lifestyle or items",
      relatedWords: ["luxurious", "luxuriate", "luxuriously"],
      level: "intermediate",
    },
    landscape: {
      word: "landscape",
      phonetic: "/ˈlændskeɪp/",
      partOfSpeech: "noun",
      definition:
        "all the visible features of an area of land, often considered in terms of their aesthetic appeal",
      example:
        "The landscape was breathtaking with mountains and valleys.",
      exampleTranslation:
        "Phong cảnh ngoạn mục với những ngọn núi và thung lũng.",
      synonyms: ["scenery", "view", "vista", "terrain"],
      antonyms: [],
      usage: "Used to describe natural or rural scenery",
      relatedWords: ["landscaping", "landscaper"],
      level: "beginner",
    },
    laughter: {
      word: "laughter",
      phonetic: "/ˈlæftər/",
      partOfSpeech: "noun",
      definition: "the action or sound of laughing",
      example: "The room was filled with laughter and joy.",
      exampleTranslation:
        "Căn phòng tràn ngập tiếng cười và niềm vui.",
      synonyms: [
        "giggling",
        "chuckling",
        "amusement",
        "merriment",
      ],
      antonyms: ["crying", "weeping", "tears"],
      usage: "Describes the sound or act of laughing",
      relatedWords: ["laugh", "laughable", "laughing"],
      level: "beginner",
    },
    leadership: {
      word: "leadership",
      phonetic: "/ˈliːdərʃɪp/",
      partOfSpeech: "noun",
      definition:
        "the action of leading a group of people or an organization",
      example: "She has excellent leadership skills.",
      exampleTranslation: "Cô ấy có kỹ năng lãnh đạo xuất sắc.",
      synonyms: [
        "guidance",
        "direction",
        "management",
        "authority",
      ],
      antonyms: ["followership", "subordination"],
      usage:
        "Used to describe the ability or role of leading others",
      relatedWords: ["leader", "lead", "leading"],
      level: "intermediate",
    },
    legitimate: {
      word: "legitimate",
      phonetic: "/lɪˈdʒɪtɪmət/",
      partOfSpeech: "adjective",
      definition:
        "conforming to the law or to rules; able to be defended with logic or justification",
      example:
        "That is a legitimate concern that needs to be addressed.",
      exampleTranslation:
        "Đó là một mối quan tâm hợp lý cần được giải quyết.",
      synonyms: ["legal", "lawful", "valid", "authorized"],
      antonyms: [
        "illegitimate",
        "illegal",
        "unlawful",
        "invalid",
      ],
      usage:
        "Used to describe something legal, valid, or justifiable",
      relatedWords: [
        "legitimacy",
        "legitimize",
        "legitimately",
      ],
      level: "advanced",
    },
    leverage: {
      word: "leverage",
      phonetic: "/ˈlevərɪdʒ/",
      partOfSpeech: "noun, verb",
      definition:
        "the power to influence a person or situation to achieve a particular outcome",
      example:
        "They used their position as leverage in the negotiations.",
      exampleTranslation:
        "Họ sử dụng vị trí của mình như một đòn bẩy trong các cuộc đàm phán.",
      synonyms: ["influence", "power", "advantage", "force"],
      antonyms: ["disadvantage", "weakness"],
      usage: "Often used in business or negotiation contexts",
      relatedWords: ["lever", "leveraged"],
      level: "advanced",
    },
    loyal: {
      word: "loyal",
      phonetic: "/ˈlɔɪəl/",
      partOfSpeech: "adjective",
      definition:
        "giving or showing firm and constant support or allegiance to a person or institution",
      example:
        "He remained loyal to his friends through difficult times.",
      exampleTranslation:
        "Anh ấy luôn trung thành với bạn bè qua những thời khó khăn.",
      synonyms: ["faithful", "devoted", "true", "dedicated"],
      antonyms: ["disloyal", "unfaithful", "treacherous"],
      usage: "Used to describe steadfast support or allegiance",
      relatedWords: ["loyalty", "loyally", "loyalist"],
      level: "intermediate",
    },
  };

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    const results: DictionaryEntry[] = [];
    const searchLower = term.toLowerCase();

    // Exact match first
    if (mockDictionary[searchLower]) {
      results.push(mockDictionary[searchLower]);
    }

    // Partial matches
    Object.values(mockDictionary).forEach((entry) => {
      if (
        entry.word.toLowerCase().includes(searchLower) &&
        !results.find((r) => r.word === entry.word)
      ) {
        results.push(entry);
      }
    });

    // Related words matches
    Object.values(mockDictionary).forEach((entry) => {
      if (
        entry.relatedWords.some((word) =>
          word.toLowerCase().includes(searchLower),
        ) &&
        !results.find((r) => r.word === entry.word)
      ) {
        results.push(entry);
      }
    });

    setSearchResults(results);

    // Add to search history
    if (!searchHistory.includes(term)) {
      setSearchHistory((prev) => [term, ...prev.slice(0, 4)]);
    }

    setIsLoading(false);
  };

  const speakWord = (text: string) => {
    if ("speechSynthesis" in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "en-US";
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
        selectedCategory,
      );
      setIsSaved(true);
      setShowSaveConfirm(false);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSelectEntry = (entry: DictionaryEntry) => {
    setSelectedEntry(entry);
    setSearchTerm(""); // Clear search to close dropdown
    setSearchResults([]); // Clear results to close dropdown
  };

  const handleBackToSearch = () => {
    setSelectedEntry(null);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-yellow-100 text-yellow-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case "beginner":
        return "Cơ bản";
      case "intermediate":
        return "Trung cấp";
      case "advanced":
        return "Nâng cao";
      default:
        return "Không xác định";
    }
  };

  useEffect(() => {
    if (isOpen && inputRef.current && !selectedEntry) {
      inputRef.current.focus();
    }
  }, [isOpen, selectedEntry]);

  useEffect(() => {
    if (searchTerm) {
      const timeoutId = setTimeout(() => {
        handleSearch(searchTerm);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-full max-h-full m-0 p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Từ điển</DialogTitle>
          <DialogDescription>
            Tra cứu và lưu từ vựng
          </DialogDescription>
        </DialogHeader>
        <div className="h-screen flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div>
                  <h1 className="text-xl">Từ điển</h1>
                  <p className="text-blue-100 text-sm">
                    Tra cứu và lưu từ vựng
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="p-4 bg-white border-b shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder="Nhập từ cần tra cứu..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  // Clear selected entry when user starts typing to search again
                  if (selectedEntry && e.target.value) {
                    setSelectedEntry(null);
                  }
                }}
                onFocus={() => {
                  // Clear selected entry when user focuses on search box
                  if (selectedEntry) {
                    setSelectedEntry(null);
                  }
                }}
                className="pl-10 h-12 text-lg border-2 focus:border-blue-500 rounded-full"
              />
              {isLoading && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>

            {/* Search History */}
            {searchHistory.length > 0 &&
              !searchTerm &&
              !searchResults.length &&
              !selectedEntry && (
                <div className="mt-3">
                  <p className="text-sm text-gray-600 mb-2">
                    Tìm kiếm gần đây:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.map((term, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchTerm(term)}
                        className="h-8 rounded-full"
                      >
                        {term}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden bg-gray-50">
            {selectedEntry ? (
              /* Detail View - Full Screen when entry selected */
              <ScrollArea className="h-full">
                <div className="p-6 max-w-4xl mx-auto bg-white">
                  {/* Word Header */}
                  <div className="mb-6 pb-6 border-b">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h1 className="text-4xl">
                            {selectedEntry.word}
                          </h1>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              speakWord(selectedEntry.word)
                            }
                            className="h-9 w-9 p-0 rounded-full"
                          >
                            <Volume2 className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex items-center space-x-4 text-gray-600">
                          <span className="flex items-center">
                            <Type className="h-4 w-4 mr-1" />
                            {selectedEntry.phonetic}
                          </span>
                          <span className="text-blue-600">
                            {selectedEntry.partOfSpeech}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2">
                        <Badge
                          className={getLevelColor(
                            selectedEntry.level,
                          )}
                        >
                          {getLevelText(selectedEntry.level)}
                        </Badge>
                        {isSaved ? (
                          <Badge className="bg-green-100 text-green-800">
                            <Heart className="h-3 w-3 mr-1 fill-current" />
                            Đã lưu
                          </Badge>
                        ) : (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() =>
                              setShowSaveConfirm(true)
                            }
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Star className="h-4 w-4 mr-2" />
                            Lưu từ
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Definition */}
                  <div className="mb-6">
                    <h3 className="flex items-center text-gray-900 mb-3">
                      <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                      Định nghĩa
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-lg pl-7">
                      {selectedEntry.definition}
                    </p>
                  </div>

                  {/* Example */}
                  <div className="mb-6">
                    <h3 className="flex items-center text-gray-900 mb-3">
                      <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
                      Ví dụ
                    </h3>
                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 ml-7">
                      <p className="italic mb-2 text-gray-800">
                        "{selectedEntry.example}"
                      </p>
                      <p className="text-gray-600">
                        → {selectedEntry.exampleTranslation}
                      </p>
                    </div>
                  </div>

                  {/* Usage */}
                  <div className="mb-6">
                    <h3 className="flex items-center text-gray-900 mb-3">
                      <Zap className="h-5 w-5 mr-2 text-blue-600" />
                      Cách sử dụng
                    </h3>
                    <p className="text-gray-700 pl-7">
                      {selectedEntry.usage}
                    </p>
                  </div>

                  {/* Synonyms & Antonyms */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-gray-900 mb-3">
                        Từ đồng nghĩa
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.synonyms.map(
                          (synonym, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="cursor-pointer hover:bg-blue-100 transition-colors"
                              onClick={() => {
                                setSelectedEntry(null);
                                setSearchTerm(synonym);
                              }}
                            >
                              {synonym}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-gray-900 mb-3">
                        Từ trái nghĩa
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedEntry.antonyms.map(
                          (antonym, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="cursor-pointer hover:bg-red-50 transition-colors"
                              onClick={() => {
                                setSelectedEntry(null);
                                setSearchTerm(antonym);
                              }}
                            >
                              {antonym}
                            </Badge>
                          ),
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Related Words */}
                  <div className="mb-6">
                    <h3 className="flex items-center text-gray-900 mb-3">
                      <Users className="h-5 w-5 mr-2 text-blue-600" />
                      Từ liên quan
                    </h3>
                    <div className="flex flex-wrap gap-2 pl-7">
                      {selectedEntry.relatedWords.map(
                        (word, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="cursor-pointer hover:bg-blue-50 transition-colors"
                            onClick={() => {
                              setSelectedEntry(null);
                              setSearchTerm(word);
                            }}
                          >
                            {word}
                          </Badge>
                        ),
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-6 border-t">
                    <Button
                      variant="outline"
                      onClick={() => {
                        navigator.clipboard.writeText(
                          selectedEntry.word,
                        );
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
                            text: `${selectedEntry.word}: ${selectedEntry.definition}`,
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
            ) : searchResults.length > 0 ? (
              /* Search Results Dropdown - Google Style */
              <div className="mx-4 mt-2">
                <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
                  {/* Results count header */}
                  <div className="px-4 py-2 bg-gray-50 border-b">
                    <p className="text-sm text-gray-600">
                      {searchResults.length} kết quả
                    </p>
                  </div>

                  {/* Results list with scroll if > 5 items */}
                  <div
                    className={
                      searchResults.length > 5
                        ? "max-h-[320px] overflow-y-auto"
                        : ""
                    }
                  >
                    <div className="divide-y">
                      {searchResults.map((entry, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 hover:bg-gray-100 cursor-pointer transition-colors"
                          onClick={() =>
                            handleSelectEntry(entry)
                          }
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="text-lg text-gray-900">
                                  {entry.word}
                                </h4>
                                <Badge
                                  className={`${getLevelColor(entry.level)} text-xs`}
                                >
                                  {getLevelText(entry.level)}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-1">
                                {entry.phonetic} ·{" "}
                                {entry.partOfSpeech}
                              </p>
                              <p className="text-sm text-gray-700 line-clamp-1">
                                {entry.definition}
                              </p>
                            </div>
                            <ChevronRight className="h-5 w-5 text-gray-400 ml-2 flex-shrink-0" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : searchTerm && !isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-gray-900 mb-2">
                    Không tìm thấy kết quả
                  </h3>
                  <p className="text-gray-600">
                    Không có từ nào phù hợp với "{searchTerm}"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Hãy thử tìm kiếm từ khác hoặc kiểm tra chính
                    tả
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg text-gray-900 mb-2">
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
        <Dialog
          open={showSaveConfirm}
          onOpenChange={setShowSaveConfirm}
        >
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Lưu từ vựng</DialogTitle>
              <DialogDescription>
                Chọn danh mục để lưu từ "{selectedEntry?.word}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="block text-sm mb-2">
                  Danh mục
                </label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category}
                      >
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
                <Button
                  onClick={handleSaveWord}
                  className="bg-blue-600 hover:bg-blue-700"
                >
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