import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Shield,
  Mail,
  Calendar,
  MoreHorizontal,
  User,
  Crown,
  Users,
  Lock,
  Unlock
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

// Mock data
const userData = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "nguyenvana@email.com",
    avatar: null,
    role: "Admin",
    status: "active",
    joinDate: "2023-01-15",
    lastLogin: "2024-01-15 10:30",
    vocabularyCount: 245,
    storiesRead: 123,
    learningStreak: 45,
    totalPoints: 2450
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "tranthib@email.com", 
    avatar: null,
    role: "Editor",
    status: "active",
    joinDate: "2023-03-20",
    lastLogin: "2024-01-14 15:45",
    vocabularyCount: 189,
    storiesRead: 87,
    learningStreak: 23,
    totalPoints: 1890
  },
  {
    id: 3,
    name: "Lê Văn C",
    email: "levanc@email.com",
    avatar: null,
    role: "User",
    status: "active",
    joinDate: "2023-06-10",
    lastLogin: "2024-01-15 08:15",
    vocabularyCount: 456,
    storiesRead: 234,
    learningStreak: 67,
    totalPoints: 4560
  },
  {
    id: 4,
    name: "Phạm Thị D",
    email: "phamthid@email.com",
    avatar: null,
    role: "User", 
    status: "suspended",
    joinDate: "2023-08-05",
    lastLogin: "2024-01-10 12:20",
    vocabularyCount: 78,
    storiesRead: 45,
    learningStreak: 0,
    totalPoints: 780
  },
  {
    id: 5,
    name: "Hoàng Văn E",
    email: "hoangvane@email.com",
    avatar: null,
    role: "User",
    status: "inactive",
    joinDate: "2023-11-12",
    lastLogin: "2023-12-20 14:30",
    vocabularyCount: 34,
    storiesRead: 12,
    learningStreak: 0,
    totalPoints: 340
  }
];

const roles = ["Tất cả", "Admin", "Editor", "User"];
const statuses = ["Tất cả", "active", "inactive", "suspended"];

export default function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState("Tất cả");

  const filteredUsers = userData.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "Tất cả" || user.role === selectedRole;
    const matchesStatus = selectedStatus === "Tất cả" || user.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "suspended": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin": return <Crown className="h-4 w-4 text-yellow-500" />;
      case "Editor": return <Shield className="h-4 w-4 text-blue-500" />;
      case "User": return <User className="h-4 w-4 text-gray-500" />;
      default: return <User className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Hoạt động";
      case "inactive": return "Không hoạt động";
      case "suspended": return "Bị khóa";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Quản lý người dùng</h1>
          <p className="text-gray-600 mt-1">Quản lý thông tin và quyền hạn của người dùng</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Tổng người dùng</p>
                <p className="text-2xl">2,543</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Hoạt động</p>
                <p className="text-2xl">2,234</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Lock className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Bị khóa</p>
                <p className="text-2xl">45</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600">Mới hôm nay</p>
                <p className="text-2xl">12</p>
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
                  placeholder="Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedRole} onValueChange={setSelectedRole}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => (
                  <SelectItem key={role} value={role}>{role}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map(status => (
                  <SelectItem key={status} value={status}>
                    {status === "Tất cả" ? status : getStatusText(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách người dùng ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Người dùng</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Thống kê học tập</TableHead>
                <TableHead>Ngày tham gia</TableHead>
                <TableHead>Lần cuối online</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || undefined} />
                        <AvatarFallback>
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(user.role)}
                      <span>{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {getStatusText(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm">Từ vựng: {user.vocabularyCount}</p>
                      <p className="text-sm">Stories: {user.storiesRead}</p>
                      <p className="text-sm">Streak: {user.learningStreak} ngày</p>
                      <p className="text-sm font-medium">Điểm: {user.totalPoints}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.joinDate}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{user.lastLogin}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Mail className="h-4 w-4 mr-2" />
                          Gửi email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-red-600">
                            <Lock className="h-4 w-4 mr-2" />
                            Khóa tài khoản
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <Unlock className="h-4 w-4 mr-2" />
                            Mở khóa
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa tài khoản
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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