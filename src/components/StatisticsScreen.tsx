import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

interface StatisticsScreenProps {
  onBack: () => void;
}

export function StatisticsScreen({ onBack }: StatisticsScreenProps) {
  // Mock data for charts
  const weeklyProgress = [
    { day: 'T2', words: 12, listening: 25 },
    { day: 'T3', words: 15, listening: 30 },
    { day: 'T4', words: 8, listening: 15 },
    { day: 'T5', words: 20, listening: 35 },
    { day: 'T6', words: 18, listening: 28 },
    { day: 'T7', words: 22, listening: 40 },
    { day: 'CN', words: 25, listening: 45 }
  ];

  const categoryData = [
    { name: 'Tổng quát', value: 45, color: '#3b82f6' },
    { name: 'Học thuật', value: 28, color: '#8b5cf6' },
    { name: 'Kinh doanh', value: 20, color: '#f59e0b' },
    { name: 'Nâng cao', value: 15, color: '#ef4444' }
  ];

  const monthlyStats = [
    { month: 'T1', words: 85, tests: 12 },
    { month: 'T2', words: 120, tests: 18 },
    { month: 'T3', words: 95, tests: 15 },
    { month: 'T4', words: 140, tests: 22 },
    { month: 'T5', words: 165, tests: 25 },
    { month: 'T6', words: 180, tests: 28 }
  ];

  const achievements = [
    { 
      title: 'Người học chăm chỉ', 
      description: 'Học 7 ngày liên tiếp', 
      icon: '🔥', 
      completed: true,
      date: '15/12/2024'
    },
    { 
      title: 'Thầy từ vựng', 
      description: 'Học 100 từ vựng', 
      icon: '📚', 
      completed: true,
      date: '12/12/2024'
    },
    { 
      title: 'Cao thủ nghe', 
      description: 'Hoàn thành 20 bài nghe', 
      icon: '🎧', 
      completed: true,
      date: '10/12/2024'
    },
    { 
      title: 'Siêu sao', 
      description: 'Đạt 500 từ vựng', 
      icon: '⭐', 
      completed: false,
      progress: 245
    }
  ];

  const todayStats = [
    { label: 'Từ mới học', value: 15, target: 20, color: 'text-blue-600' },
    { label: 'Phút luyện nghe', value: 25, target: 30, color: 'text-green-600' },
    { label: 'Bài kiểm tra', value: 2, target: 3, color: 'text-purple-600' },
    { label: 'Điểm trung bình', value: 85, target: 90, color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-purple-600 text-white p-6">
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
            <span className="text-xl">📊</span>
          </div>
          <div>
            <h1 className="text-xl">Thống kê</h1>
            <p className="text-purple-100 text-sm">Theo dõi tiến độ học tập của bạn</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Today's Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🎯</span>
              <span>Tiến độ hôm nay</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {todayStats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{stat.label}</span>
                  <span className={`text-sm ${stat.color}`}>
                    {stat.value}/{stat.target} {stat.label === 'Điểm trung bình' ? '%' : ''}
                  </span>
                </div>
                <Progress value={(stat.value / stat.target) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Tiến độ tuần này</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="words" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    name="Từ vựng"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="listening" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    name="Phút nghe"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🥧</span>
              <span>Phân bố theo danh mục</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📅</span>
              <span>Tổng quan 6 tháng</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="words" fill="#3b82f6" name="Từ vựng" />
                  <Bar dataKey="tests" fill="#8b5cf6" name="Bài kiểm tra" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🏆</span>
              <span>Thành tích</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 rounded-lg border">
                <div className="text-3xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="mb-1">{achievement.title}</h4>
                  <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  {achievement.completed ? (
                    <p className="text-xs text-green-600 mt-1">
                      Hoàn thành: {achievement.date}
                    </p>
                  ) : (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Tiến độ: {achievement.progress}/500</span>
                        <span>{Math.round((achievement.progress! / 500) * 100)}%</span>
                      </div>
                      <Progress value={(achievement.progress! / 500) * 100} className="h-1 mt-1" />
                    </div>
                  )}
                </div>
                <Badge variant={achievement.completed ? "default" : "secondary"}>
                  {achievement.completed ? "Hoàn thành" : "Đang thực hiện"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl mb-2">🎯</div>
              <div className="text-2xl mb-1 text-blue-600">87%</div>
              <div className="text-sm text-muted-foreground">Tỷ lệ hoàn thành mục tiêu</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6">
              <div className="text-3xl mb-2">⚡</div>
              <div className="text-2xl mb-1 text-orange-600">15</div>
              <div className="text-sm text-muted-foreground">Chuỗi ngày học liên tiếp</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}