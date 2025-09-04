import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { 
  Users, 
  BookOpen, 
  FileText, 
  TrendingUp, 
  Activity,
  Calendar,
  Package,
  Target
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

// Mock data
const stats = [
  { title: "Tổng người dùng", value: "2,543", change: "+12%", icon: Users, color: "bg-blue-500" },
  { title: "Tổng từ vựng", value: "15,247", change: "+8%", icon: BookOpen, color: "bg-green-500" },
  { title: "Tổng Stories", value: "1,234", change: "+15%", icon: FileText, color: "bg-purple-500" },
  { title: "Bộ từ vựng", value: "156", change: "+5%", icon: Package, color: "bg-orange-500" },
];

const userGrowthData = [
  { month: "T1", users: 1200 },
  { month: "T2", users: 1450 },
  { month: "T3", users: 1680 },
  { month: "T4", users: 1890 },
  { month: "T5", users: 2150 },
  { month: "T6", users: 2543 },
];

const vocabularyUsageData = [
  { category: "IELTS", count: 4500, color: "#3B82F6" },
  { category: "TOEIC", count: 3200, color: "#10B981" },
  { category: "Giao tiếp", count: 2800, color: "#8B5CF6" },
  { category: "Kinh doanh", count: 2200, color: "#F59E0B" },
  { category: "Du lịch", count: 1800, color: "#EF4444" },
  { category: "Khác", count: 747, color: "#6B7280" },
];

const recentActivities = [
  { id: 1, user: "Nguyễn Văn A", action: "đã thêm từ vựng mới", item: "Vocabulary", time: "2 phút trước", type: "create" },
  { id: 2, user: "Trần Thị B", action: "đã chỉnh sửa story", item: "Story #123", time: "5 phút trước", type: "edit" },
  { id: 3, user: "Lê Văn C", action: "đã tạo bộ từ mới", item: "IELTS Advanced", time: "10 phút trước", type: "create" },
  { id: 4, user: "Phạm Thị D", action: "đã xóa từ vựng", item: "Old word", time: "15 phút trước", type: "delete" },
  { id: 5, user: "Hoàng Văn E", action: "đã cập nhật profile", item: "User settings", time: "20 phút trước", type: "edit" },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl">Dashboard</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống WordNote</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Calendar className="h-4 w-4 mr-2" />
            7 ngày qua
          </Button>
          <Button size="sm">
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-2xl mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-500">{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User Growth Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tăng trưởng người dùng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={userGrowthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="users" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="h-5 w-5 mr-2" />
              Hoạt động gần đây
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-80 overflow-y-auto">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="p-4 border-b last:border-b-0 hover:bg-gray-50">
                  <div className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      activity.type === 'create' ? 'bg-green-500' :
                      activity.type === 'edit' ? 'bg-blue-500' : 'bg-red-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user}</span>{" "}
                        {activity.action}{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vocabulary Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bố từ vựng theo danh mục</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vocabularyUsageData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="count"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {vocabularyUsageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Categories */}
        <Card>
          <CardHeader>
            <CardTitle>Danh mục phổ biến nhất</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={vocabularyUsageData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button className="h-20 flex-col space-y-2">
              <BookOpen className="h-6 w-6" />
              <span>Thêm từ vựng</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>Tạo Story mới</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Package className="h-6 w-6" />
              <span>Tạo bộ từ</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Target className="h-6 w-6" />
              <span>Xem báo cáo</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}