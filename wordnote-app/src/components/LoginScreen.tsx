import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LoginScreenProps {
  onLogin: (provider: string) => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="w-full max-w-md space-y-8">
        {/* Logo và tiêu đề */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto bg-blue-600 rounded-2xl flex items-center justify-center">
            <span className="text-2xl">📚</span>
          </div>
          <div>
            <h1 className="text-3xl tracking-tight text-primary">WordNote</h1>
            <p className="text-muted-foreground mt-2">Học ngoại ngữ thông minh</p>
          </div>
        </div>

        {/* Card đăng nhập */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-4">
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Chọn phương thức đăng nhập của bạn
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Facebook Login */}
            <Button
              onClick={() => onLogin('facebook')}
              className="w-full bg-blue-600 hover:bg-blue-700 h-12"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">📘</span>
                <span>Đăng nhập với Facebook</span>
              </div>
            </Button>

            {/* Google Login */}
            <Button
              onClick={() => onLogin('google')}
              variant="outline"
              className="w-full h-12 border-2 hover:bg-gray-50"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">🔍</span>
                <span className="text-gray-700">Đăng nhập với Google</span>
              </div>
            </Button>

            {/* Zalo Login */}
            <Button
              onClick={() => onLogin('zalo')}
              className="w-full bg-blue-500 hover:bg-blue-600 h-12"
            >
              <div className="flex items-center justify-center space-x-3">
                <span className="text-xl">💬</span>
                <span>Đăng nhập với Zalo</span>
              </div>
            </Button>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Bằng việc đăng nhập, bạn đồng ý với{' '}
                <span className="text-blue-600 underline cursor-pointer">
                  Điều khoản sử dụng
                </span>{' '}
                và{' '}
                <span className="text-blue-600 underline cursor-pointer">
                  Chính sách bảo mật
                </span>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features preview */}
        <div className="text-center space-y-3">
          <p className="text-sm text-muted-foreground">Tính năng nổi bật:</p>
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-1">
              <span>📝</span>
              <span>Ghi chú từ vựng</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🎧</span>
              <span>Luyện nghe</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🏆</span>
              <span>Theo dõi tiến độ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}