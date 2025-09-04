import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye,
  Heart,
  BookOpen,
  Clock,
  Star,
  FileText,
  Users,
  Calendar,
  BarChart3
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";

// Mock data
const storiesData = [
  {
    id: 1,
    title: "The Journey to Success",
    description: "A motivational story about overcoming challenges and achieving dreams.",
    content: "Once upon a time, there was a young entrepreneur who faced many obstacles...",
    author: "Admin",
    category: "Motivation",
    level: "Intermediate",
    readingTime: 5,
    wordCount: 1200,
    vocabularyCount: 45,
    views: 2340,
    likes: 156,
    isPublished: true,
    isFeatured: false,
    publishDate: "2024-01-10",
    lastUpdated: "2024-01-12",
    difficulty: "Medium",
    tags: ["motivation", "business", "success"]
  },
  {
    id: 2,
    title: "A Day in London",
    description: "Experience the culture and daily life in London through this engaging story.",
    content: "Sarah walked through the bustling streets of London, amazed by the diversity...",
    author: "Editor",
    category: "Travel",
    level: "Beginner",
    readingTime: 3,
    wordCount: 800,
    vocabularyCount: 32,
    views: 1890,
    likes: 98,
    isPublished: true,
    isFeatured: true,
    publishDate: "2024-01-08",
    lastUpdated: "2024-01-08",
    difficulty: "Easy",
    tags: ["travel", "culture", "city"]
  },
  {
    id: 3,
    title: "The Future of Technology",
    description: "Exploring how artificial intelligence will shape our future.",
    content: "In the year 2030, artificial intelligence has become an integral part...",
    author: "TechWriter",
    category: "Technology",
    level: "Advanced",
    readingTime: 8,
    wordCount: 2100,
    vocabularyCount: 78,
    views: 3456,
    likes: 234,
    isPublished: false,
    isFeatured: false,
    publishDate: null,
    lastUpdated: "2024-01-14",
    difficulty: "Hard",
    tags: ["technology", "AI", "future"]
  },
  {
    id: 4,
    title: "Cooking Adventures",
    description: "Learn about international cuisine through delicious stories.",
    content: "Maria's grandmother taught her the secret recipe that had been passed down...",
    author: "FoodLover",
    category: "Lifestyle",
    level: "Intermediate",
    readingTime: 4,
    wordCount: 950,
    vocabularyCount: 38,
    views: 1567,
    likes: 87,
    isPublished: true,
    isFeatured: false,
    publishDate: "2024-01-05",
    lastUpdated: "2024-01-06",
    difficulty: "Medium",
    tags: ["cooking", "family", "tradition"]
  }
];

const categories = ["Tất cả", "Motivation", "Travel", "Technology", "Lifestyle", "Business", "Education"];
const levels = ["Tất cả", "Beginner", "Intermediate", "Advanced"];
const difficulties = ["Tất cả", "Easy", "Medium", "Hard"];

export default function StoriesManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [showUnpublished, setShowUnpublished] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredStories = storiesData.filter(story => {
    const matchesSearch = story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         story.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || story.category === selectedCategory;
    const matchesLevel = selectedLevel === "Tất cả" || story.level === selectedLevel;
    const matchesDifficulty = selectedDifficulty === "Tất cả" || story.difficulty === selectedDifficulty;
    const matchesPublished = !showUnpublished || !story.isPublished;

    return matchesSearch && matchesCategory && matchesLevel && matchesDifficulty && matchesPublished;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản lý Stories</h1>
          <p className="text-gray-600 mt-1">Quản lý và chỉnh sửa các câu chuyện học tập</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm Story
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Thêm Story mới</DialogTitle>
              <DialogDescription>
                Tạo một câu chuyện học tập mới cho người dùng
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề *</Label>
                <Input id="title" placeholder="Nhập tiêu đề story" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Mô tả ngắn *</Label>
                <Textarea id="description" placeholder="Mô tả ngắn gọn về nội dung story" rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Danh mục</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn danh mục" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.slice(1).map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Cấp độ</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.slice(1).map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Độ khó</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ khó" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.slice(1).map(diff => (
                        <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Nội dung *</Label>
                <Textarea 
                  id="content" 
                  placeholder="Nhập nội dung đầy đủ của story..." 
                  rows={8}
                  className="min-h-32"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input id="tags" placeholder="motivation, business, success" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Lưu nháp
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Xuất bản
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng Stories</p>
                <p className="text-2xl">1,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Lượt xem</p>
                <p className="text-2xl">125.6K</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Chờ duyệt</p>
                <p className="text-2xl">18</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Tác giả</p>
                <p className="text-2xl">89</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm stories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {difficulties.map(diff => (
                  <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button 
              variant={showUnpublished ? "default" : "outline"}
              onClick={() => setShowUnpublished(!showUnpublished)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Chưa xuất bản
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stories Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Stories ({filteredStories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Story</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Độ khó</TableHead>
                <TableHead>Thống kê</TableHead>
                <TableHead>Tác giả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStories.map((story) => (
                <TableRow key={story.id}>
                  <TableCell>
                    <div className="max-w-xs">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{story.title}</h4>
                        {story.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-1">
                        {story.description}
                      </p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {story.readingTime} phút
                        </span>
                        <span className="flex items-center">
                          <BookOpen className="h-3 w-3 mr-1" />
                          {story.wordCount} từ
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{story.category}</Badge>
                    <p className="text-xs text-gray-500 mt-1">{story.level}</p>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(story.difficulty)}>
                      {story.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center space-x-1">
                        <Eye className="h-3 w-3" />
                        <span>{story.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Heart className="h-3 w-3" />
                        <span>{story.likes}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BarChart3 className="h-3 w-3" />
                        <span>{story.vocabularyCount} từ</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{story.author}</p>
                      <p className="text-xs text-gray-500">
                        {story.lastUpdated}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={story.isPublished ? "default" : "secondary"}>
                      {story.isPublished ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}