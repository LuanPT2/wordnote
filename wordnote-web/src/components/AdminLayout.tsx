import { useState } from "react";
import { Button } from "./ui/button";
import { 
  BookOpen, 
  Users, 
  BarChart3, 
  FileText, 
  Settings, 
  Menu, 
  Search,
  Bell,
  LogOut,
  UserCircle,
  Package,
  Shield,
  History
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface AdminLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: "Dashboard", id: "dashboard", icon: BarChart3 },
  { name: "Quản lý từ vựng", id: "vocabulary", icon: BookOpen },
  { name: "Quản lý Stories", id: "stories", icon: FileText },
  { name: "Quản lý người dùng", id: "users", icon: Users },
  { name: "Bộ từ vựng", id: "vocabulary-sets", icon: Package },
  { name: "Phân quyền", id: "permissions", icon: Shield },
  { name: "Lịch sử hoạt động", id: "audit-logs", icon: History },
  { name: "Báo cáo", id: "reports", icon: BarChart3 },
  { name: "Cài đặt", id: "settings", icon: Settings },
];

export default function AdminLayout({ children, currentPage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 ${sidebarOpen ? "w-64" : "w-16"} bg-white shadow-lg transition-all duration-300`}>
        <div className="flex h-16 items-center justify-between px-4 border-b">
          {sidebarOpen && (
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">WordNote Admin</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-4 w-4" />
          </Button>
        </div>
        
        <nav className="mt-4 px-2">
          <div className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onPageChange(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm rounded-lg transition-colors ${
                    currentPage === item.id
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {sidebarOpen && (
                    <span className="ml-3 truncate">{item.name}</span>
                  )}
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Main content */}
      <div className={`${sidebarOpen ? "ml-64" : "ml-16"} transition-all duration-300`}>
        {/* Header */}
        <header className="bg-white shadow-sm border-b h-16 flex items-center justify-between px-6">
          <div className="flex-1 flex items-center space-x-4">
            <div className="relative max-w-xs">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="h-5 w-5" />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/admin-avatar.jpg" />
                    <AvatarFallback>AD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">Admin User</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>
                  <UserCircle className="h-4 w-4 mr-2" />
                  Thông tin cá nhân
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}