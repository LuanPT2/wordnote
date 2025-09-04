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
  Volume2,
  Star,
  BookMarked,
  Tag,
  Users,
  Calendar
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
const vocabularyData = [
  {
    id: 1,
    word: "Appreciate",
    phonetic: "/əˈpriːʃieɪt/",
    meaning: "Đánh giá cao, cảm kích",
    example: "I really appreciate your help.",
    category: "IELTS",
    level: "Intermediate",
    tags: ["emotion", "formal"],
    addedBy: "Admin",
    addedDate: "2024-01-15",
    usageCount: 1250,
    difficulty: "Medium",
    isApproved: true
  },
  {
    id: 2,
    word: "Resilience",
    phonetic: "/rɪˈzɪljəns/",
    meaning: "Khả năng phục hồi, sức bền",
    example: "Her resilience helped her overcome the challenges.",
    category: "TOEIC",
    level: "Advanced",
    tags: ["psychology", "strength"],
    addedBy: "Editor",
    addedDate: "2024-01-14",
    usageCount: 890,
    difficulty: "Hard",
    isApproved: true
  },
  {
    id: 3,
    word: "Negotiate",
    phonetic: "/nɪˈɡoʊʃieɪt/",
    meaning: "Đàm phán, thương lượng",
    example: "We need to negotiate the contract terms.",
    category: "Business",
    level: "Intermediate",
    tags: ["business", "communication"],
    addedBy: "User123",
    addedDate: "2024-01-13",
    usageCount: 2100,
    difficulty: "Medium",
    isApproved: false
  },
  {
    id: 4,
    word: "Magnificent",
    phonetic: "/mæɡˈnɪfɪsənt/",
    meaning: "Tráng lệ, hùng vĩ",
    example: "The view from the mountain was magnificent.",
    category: "General",
    level: "Intermediate",
    tags: ["description", "positive"],
    addedBy: "Admin",
    addedDate: "2024-01-12",
    usageCount: 670,
    difficulty: "Medium",
    isApproved: true
  }
];

const categories = ["Tất cả", "IELTS", "TOEIC", "Business", "General", "Travel"];
const levels = ["Tất cả", "Beginner", "Intermediate", "Advanced"];
const difficulties = ["Tất cả", "Easy", "Medium", "Hard"];
const tags = ["emotion", "formal", "psychology", "strength", "business", "communication", "description", "positive"];

export default function VocabularyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Tất cả");
  const [selectedLevel, setSelectedLevel] = useState("Tất cả");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [showUnapproved, setShowUnapproved] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredVocabulary = vocabularyData.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "Tất cả" || word.category === selectedCategory;
    const matchesLevel = selectedLevel === "Tất cả" || word.level === selectedLevel;
    const matchesDifficulty = selectedDifficulty === "Tất cả" || word.difficulty === selectedDifficulty;
    const matchesApproval = !showUnapproved || !word.isApproved;

    return matchesSearch && matchesCategory && matchesLevel && matchesDifficulty && matchesApproval;
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
          <h1 className="text-3xl">Quản lý từ vựng</h1>
          <p className="text-gray-600 mt-1">Quản lý và chỉnh sửa từ vựng trong hệ thống</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Thêm từ vựng
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Thêm từ vựng mới</DialogTitle>
              <DialogDescription>
                Nhập thông tin từ vựng mới vào hệ thống
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="word">Từ vựng *</Label>
                  <Input id="word" placeholder="Nhập từ vựng" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phonetic">Phiên âm</Label>
                  <Input id="phonetic" placeholder="/phonetic/" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="meaning">Nghĩa *</Label>
                <Input id="meaning" placeholder="Nhập nghĩa của từ" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="example">Ví dụ</Label>
                <Textarea id="example" placeholder="Nhập câu ví dụ" />
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
                <Label htmlFor="tags">Tags (phân cách bằng dấu phẩy)</Label>
                <Input id="tags" placeholder="emotion, formal, business" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={() => setIsAddDialogOpen(false)}>
                Thêm từ vựng
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
              <BookMarked className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng từ vựng</p>
                <p className="text-2xl">15,247</p>
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
                <p className="text-2xl">24</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Người đóng góp</p>
                <p className="text-2xl">156</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Hôm nay</p>
                <p className="text-2xl">8</p>
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
                  placeholder="Tìm kiếm từ vựng..."
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
              variant={showUnapproved ? "default" : "outline"}
              onClick={() => setShowUnapproved(!showUnapproved)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Chờ duyệt
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách từ vựng ({filteredVocabulary.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Từ vựng</TableHead>
                <TableHead>Nghĩa</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Độ khó</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Lượt dùng</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVocabulary.map((word) => (
                <TableRow key={word.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{word.word}</span>
                        <Button variant="ghost" size="sm">
                          <Volume2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">{word.phonetic}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="max-w-xs truncate">{word.meaning}</p>
                      {word.example && (
                        <p className="text-sm text-gray-500 max-w-xs truncate">
                          "{word.example}"
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{word.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getDifficultyColor(word.difficulty)}>
                      {word.difficulty}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {word.tags.slice(0, 2).map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {word.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{word.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{word.usageCount.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={word.isApproved ? "default" : "destructive"}>
                      {word.isApproved ? "Đã duyệt" : "Chờ duyệt"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
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