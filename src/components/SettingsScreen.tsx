import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';

interface SettingsScreenProps {
  onBack: () => void;
  user: any;
}

export function SettingsScreen({ onBack, user }: SettingsScreenProps) {
  const [settings, setSettings] = useState({
    notifications: true,
    soundEffects: true,
    darkMode: false,
    dailyReminder: true,
    reminderTime: '19:00',
    language: 'vi',
    difficulty: 'medium',
    dailyGoal: '20',
    autoPlay: true,
    offlineMode: false
  });

  const [profile, setProfile] = useState({
    name: user?.name || 'Người dùng',
    email: 'user@wordnote.app',
    level: 'Trung cấp',
    joinDate: '2024-01-15',
    totalWords: 245,
    totalTime: 1250 // minutes
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const settingSections = [
    {
      title: 'Học tập',
      icon: '📚',
      items: [
        {
          key: 'dailyGoal',
          label: 'Mục tiêu hàng ngày',
          description: 'Số từ vựng muốn học mỗi ngày',
          type: 'select',
          options: [
            { value: '10', label: '10 từ' },
            { value: '20', label: '20 từ' },
            { value: '30', label: '30 từ' },
            { value: '50', label: '50 từ' }
          ]
        },
        {
          key: 'difficulty',
          label: 'Độ khó mặc định',
          description: 'Độ khó cho từ vựng mới',
          type: 'select',
          options: [
            { value: 'easy', label: 'Dễ' },
            { value: 'medium', label: 'Trung bình' },
            { value: 'hard', label: 'Khó' }
          ]
        },
        {
          key: 'autoPlay',
          label: 'Tự động phát âm',
          description: 'Phát âm tự động khi thêm từ mới',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Thông báo',
      icon: '🔔',
      items: [
        {
          key: 'notifications',
          label: 'Nhận thông báo',
          description: 'Cho phép ứng dụng gửi thông báo',
          type: 'switch'
        },
        {
          key: 'dailyReminder',
          label: 'Nhắc nhở hàng ngày',
          description: 'Nhắc nhở học từ vựng mỗi ngày',
          type: 'switch'
        },
        {
          key: 'reminderTime',
          label: 'Thời gian nhắc nhở',
          description: 'Thời gian nhận thông báo nhắc nhở',
          type: 'time'
        }
      ]
    },
    {
      title: 'Giao diện',
      icon: '🎨',
      items: [
        {
          key: 'darkMode',
          label: 'Chế độ tối',
          description: 'Sử dụng giao diện tối',
          type: 'switch'
        },
        {
          key: 'language',
          label: 'Ngôn ngữ giao diện',
          description: 'Ngôn ngữ hiển thị ứng dụng',
          type: 'select',
          options: [
            { value: 'vi', label: 'Tiếng Việt' },
            { value: 'en', label: 'English' }
          ]
        },
        {
          key: 'soundEffects',
          label: 'Hiệu ứng âm thanh',
          description: 'Phát âm thanh khi tương tác',
          type: 'switch'
        }
      ]
    },
    {
      title: 'Nâng cao',
      icon: '⚙️',
      items: [
        {
          key: 'offlineMode',
          label: 'Chế độ ngoại tuyến',
          description: 'Tải nội dung để học offline',
          type: 'switch'
        }
      ]
    }
  ];

  const renderSettingItem = (item: any) => {
    switch (item.type) {
      case 'switch':
        return (
          <Switch
            checked={settings[item.key as keyof typeof settings] as boolean}
            onCheckedChange={(checked) => updateSetting(item.key, checked)}
          />
        );
      case 'select':
        return (
          <Select
            value={settings[item.key as keyof typeof settings] as string}
            onValueChange={(value) => updateSetting(item.key, value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {item.options.map((option: any) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'time':
        return (
          <Input
            type="time"
            value={settings[item.key as keyof typeof settings] as string}
            onChange={(e) => updateSetting(item.key, e.target.value)}
            className="w-32"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gray-800 text-white p-6">
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
            <span className="text-xl">⚙️</span>
          </div>
          <div>
            <h1 className="text-xl">Cài đặt</h1>
            <p className="text-gray-300 text-sm">Tùy chỉnh ứng dụng của bạn</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>👤</span>
              <span>Hồ sơ cá nhân</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1">
                <h3 className="mb-1">{profile.name}</h3>
                <p className="text-sm text-muted-foreground">{profile.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <Badge variant="secondary">{profile.level}</Badge>
                  <Badge variant="outline">
                    Từ {new Date(profile.joinDate).toLocaleDateString('vi-VN')}
                  </Badge>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Chỉnh sửa
              </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl text-blue-600">{profile.totalWords}</div>
                <div className="text-xs text-muted-foreground">Từ đã học</div>
              </div>
              <div>
                <div className="text-2xl text-green-600">{Math.floor(profile.totalTime / 60)}h</div>
                <div className="text-xs text-muted-foreground">Thời gian học</div>
              </div>
              <div>
                <div className="text-2xl text-purple-600">15</div>
                <div className="text-xs text-muted-foreground">Chuỗi ngày</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Sections */}
        {settingSections.map((section, sectionIndex) => (
          <Card key={sectionIndex}>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>{section.icon}</span>
                <span>{section.title}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {section.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label className="text-sm">{item.label}</Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    {renderSettingItem(item)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}

        {/* Data & Privacy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>🔒</span>
              <span>Dữ liệu & Quyền riêng tư</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">📄</span>
              Chính sách quyền riêng tư
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">📋</span>
              Điều khoản sử dụng
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">📤</span>
              Xuất dữ liệu
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <span className="mr-3">🗑️</span>
              Xóa tài khoản
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <span>ℹ️</span>
              <span>Thông tin ứng dụng</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Phiên bản</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span>Cập nhật cuối</span>
              <span className="text-muted-foreground">15/12/2024</span>
            </div>
            <Separator />
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">💬</span>
              Liên hệ hỗ trợ
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">⭐</span>
              Đánh giá ứng dụng
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <span className="mr-3">📱</span>
              Chia sẻ ứng dụng
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}