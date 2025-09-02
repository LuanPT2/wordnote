import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Screen } from '../App';

interface MainScreenProps {
  onNavigate: (screen: Screen) => void;
  onLogout: () => void;
  user: any;
}

export function MainScreen({ onNavigate, onLogout, user }: MainScreenProps) {
  const primaryFeature = {
    id: 'vocabulary',
    title: 'Từ vựng',
    description: 'Thêm và quản lý từ vựng với nhiều tính năng thông minh',
    icon: '📝',
    color: 'bg-gradient-to-r from-blue-500 to-purple-500',
    screen: 'vocabulary' as Screen
  };

  const features = [
    {
      id: 'practice',
      title: 'Luyện tập',
      description: 'Luyện từ vựng với nhiều chế độ khác nhau',
      icon: '🎯',
      color: 'bg-green-500',
      screen: 'practice' as Screen
    },
    {
      id: 'listening',
      title: 'Nghe',
      description: 'Luyện nghe từ vựng với âm thanh',
      icon: '🎵',
      color: 'bg-purple-500',
      screen: 'listening' as Screen
    },
    {
      id: 'story',
      title: 'Story',
      description: 'Học từ vựng qua video câu chuyện',
      icon: '📺',
      color: 'bg-red-500',
      screen: 'story' as Screen
    },
    {
      id: 'free-study',
      title: 'Học tự do',
      description: 'Nội dung học theo chủ đề với hình ảnh',
      icon: '📚',
      color: 'bg-orange-500',
      screen: 'free-study' as Screen
    }
  ];

  const stats = [
    { label: 'Từ đã học', value: 245, color: 'text-blue-600' },
    { label: 'Ngày liên tiếp', value: 7, color: 'text-green-600' },
    { label: 'Bài đã hoàn thành', value: 12, color: 'text-purple-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-white text-xl">📚</span>
            </div>
            <div>
              <h1 className="text-xl text-primary">WordNote</h1>
              <p className="text-sm text-muted-foreground">Xin chào, {user?.name}!</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => onNavigate('settings')}
              className="p-2"
            >
              ⚙️
            </Button>
            <Button variant="outline" onClick={onLogout} size="sm">
              Đăng xuất
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Welcome Card */}
        <Card className="border-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl mb-2">Chào mừng trở lại!</h2>
                <p className="text-blue-100">
                  Tiếp tục hành trình học ngoại ngữ của bạn
                </p>
              </div>
              <div className="text-6xl opacity-20">🎯</div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-4">
                <div className={`text-2xl mb-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Primary Feature - Audio Review */}
        <div>
          <h3 className="mb-4 text-primary">Tính năng chính</h3>
          <Card 
            className="cursor-pointer hover:shadow-lg transition-all border-2 border-green-200 mb-4"
            onClick={() => onNavigate(primaryFeature.screen)}
          >
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`w-16 h-16 ${primaryFeature.color} rounded-xl flex items-center justify-center text-white text-3xl shadow-lg`}>
                  {primaryFeature.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-lg">{primaryFeature.title}</h4>
                    <Badge className="bg-green-600 text-white">Chính</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {primaryFeature.description}
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                    Bắt đầu học →
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Features */}
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature) => (
              <Card key={feature.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                <CardContent 
                  className="p-4"
                  onClick={() => onNavigate(feature.screen)}
                >
                  <div className="text-center space-y-2">
                    <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center text-white text-xl mx-auto`}>
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="text-sm mb-1">{feature.title}</h4>
                      <p className="text-xs text-muted-foreground">
                        {feature.description.length > 40 
                          ? feature.description.substring(0, 40) + '...' 
                          : feature.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>⚡</span>
              <span>Hành động nhanh</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => onNavigate('vocabulary')}
            >
              <span className="mr-3">➕</span>
              Thêm từ vựng mới
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-12"
              onClick={() => onNavigate('practice')}
            >
              <span className="mr-3">🎯</span>
              Luyện tập từ vựng
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>📈</span>
              <span>Hoạt động gần đây</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-blue-600 text-sm">📝</span>
                </div>
                <div>
                  <p className="text-sm">Học 15 từ vựng mới</p>
                  <p className="text-xs text-muted-foreground">2 giờ trước</p>
                </div>
              </div>
              <Badge variant="secondary">+15 XP</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 text-sm">🎧</span>
                </div>
                <div>
                  <p className="text-sm">Hoàn thành bài nghe Level 1</p>
                  <p className="text-xs text-muted-foreground">1 ngày trước</p>
                </div>
              </div>
              <Badge variant="secondary">+25 XP</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📊</span>
                <span>Tiến độ học tập</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Từ vựng đã thành thạo</span>
                  <span>68%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-600 h-2 rounded-full" style={{width: '68%'}}></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mục tiêu tuần này</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{width: '85%'}}></div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">167</div>
                    <div className="text-xs text-muted-foreground">Từ đã thuộc</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">78</div>
                    <div className="text-xs text-muted-foreground">Từ cần ôn</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Study Time */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>⏰</span>
                <span>Thời gian học</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-1">2h 35m</div>
                <div className="text-sm text-muted-foreground">Hôm nay</div>
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day, index) => (
                  <div key={day} className="text-center">
                    <div className="text-xs text-muted-foreground mb-1">{day}</div>
                    <div className={`h-8 rounded ${index < 5 ? 'bg-purple-200' : index < 6 ? 'bg-purple-600' : 'bg-gray-200'} flex items-center justify-center`}>
                      <span className="text-xs font-medium">{index < 5 ? Math.floor(Math.random() * 60) + 30 : index < 6 ? '155' : '0'}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-2 border-t">
                <div className="text-lg font-semibold">12h 20m</div>
                <div className="text-xs text-muted-foreground">Tuần này</div>
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
            <CardContent>
              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-2xl mb-1">🔥</div>
                  <div className="text-sm font-medium">7 ngày</div>
                  <div className="text-xs text-muted-foreground">Streak</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl mb-1">📚</div>
                  <div className="text-sm font-medium">245</div>
                  <div className="text-xs text-muted-foreground">Từ học</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl mb-1">⭐</div>
                  <div className="text-sm font-medium">1,250</div>
                  <div className="text-xs text-muted-foreground">Điểm XP</div>
                </div>
              </div>
              
              <div className="mt-4 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-lg">🎯</span>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Thách thức tuần</div>
                    <div className="text-xs text-muted-foreground">Học 50 từ mới - Còn lại 12 từ</div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">76%</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>📑</span>
                <span>Tiến độ theo danh mục</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: 'Harry Potter', total: 85, learned: 62, color: 'bg-red-500' },
                { name: 'Luyện TOEIC', total: 120, learned: 78, color: 'bg-green-500' },
                { name: 'Daily Conversation', total: 95, learned: 27, color: 'bg-blue-500' },
                { name: 'Business', total: 45, learned: 0, color: 'bg-purple-500' }
              ].map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>{cat.name}</span>
                    <span>{cat.learned}/{cat.total}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`${cat.color} h-2 rounded-full transition-all duration-300`}
                      style={{width: `${(cat.learned / cat.total) * 100}%`}}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}