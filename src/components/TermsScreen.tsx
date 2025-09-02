import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Checkbox } from './ui/checkbox';
import { ScrollArea } from './ui/scroll-area';

interface TermsScreenProps {
  onAccept: () => void;
}

export function TermsScreen({ onAccept }: TermsScreenProps) {
  const [accepted, setAccepted] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <div className="bg-blue-600 text-white p-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <span className="text-xl">📋</span>
          </div>
          <div>
            <h1 className="text-xl">Điều khoản sử dụng</h1>
            <p className="text-blue-100 text-sm">WordNote App</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">
        <Card className="h-[calc(100vh-200px)]">
          <CardHeader>
            <CardTitle>Điều khoản và Điều kiện</CardTitle>
          </CardHeader>
          <CardContent className="h-full">
            <ScrollArea className="h-[calc(100%-100px)] pr-4">
              <div className="space-y-6 text-sm leading-relaxed">
                <section>
                  <h3 className="mb-3">1. Chấp nhận điều khoản</h3>
                  <p className="text-muted-foreground">
                    Bằng việc sử dụng ứng dụng WordNote, bạn đồng ý tuân thủ và bị ràng buộc bởi 
                    các điều khoản và điều kiện sử dụng này. Nếu bạn không đồng ý với bất kỳ phần 
                    nào của các điều khoản này, vui lòng không sử dụng ứng dụng.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3">2. Mục đích sử dụng</h3>
                  <p className="text-muted-foreground">
                    WordNote là ứng dụng học ngoại ngữ được thiết kế để hỗ trợ người dùng trong việc:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Ghi chú và quản lý từ vựng</li>
                    <li>Luyện tập kỹ năng nghe</li>
                    <li>Theo dõi tiến độ học tập</li>
                    <li>Chia sẻ kiến thức với cộng đồng</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3">3. Tài khoản người dùng</h3>
                  <p className="text-muted-foreground">
                    Khi tạo tài khoản, bạn phải cung cấp thông tin chính xác và đầy đủ. 
                    Bạn có trách nhiệm bảo mật thông tin đăng nhập và chịu trách nhiệm 
                    về tất cả hoạt động diễn ra dưới tài khoản của mình.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3">4. Quyền riêng tư</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Thông tin cá nhân sẽ được 
                    thu thập và sử dụng theo Chính sách Quyền riêng tư của chúng tôi. 
                    Dữ liệu học tập của bạn sẽ được mã hóa và bảo mật.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3">5. Nội dung người dùng</h3>
                  <p className="text-muted-foreground">
                    Bạn giữ quyền sở hữu đối với nội dung mà bạn tạo ra. Tuy nhiên, 
                    bằng việc chia sẻ nội dung trên ứng dụng, bạn cấp cho chúng tôi 
                    quyền sử dụng nội dung đó để cải thiện dịch vụ.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3">6. Hành vi không được phép</h3>
                  <p className="text-muted-foreground">
                    Người dùng không được:
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-muted-foreground ml-4">
                    <li>Chia sẻ nội dung không phù hợp hoặc vi phạm pháp luật</li>
                    <li>Spam hoặc gửi tin nhắn rác</li>
                    <li>Vi phạm quyền tác giả hoặc quyền sở hữu trí tuệ</li>
                    <li>Cố gắng hack hoặc phá hoại hệ thống</li>
                  </ul>
                </section>

                <section>
                  <h3 className="mb-3">7. Thay đổi điều khoản</h3>
                  <p className="text-muted-foreground">
                    Chúng tôi có quyền thay đổi các điều khoản này bất cứ lúc nào. 
                    Người dùng sẽ được thông báo về những thay đổi quan trọng.
                  </p>
                </section>

                <section>
                  <h3 className="mb-3">8. Liên hệ</h3>
                  <p className="text-muted-foreground">
                    Nếu có bất kỳ câu hỏi nào về các điều khoản này, 
                    vui lòng liên hệ với chúng tôi qua email: support@wordnote.app
                  </p>
                </section>
              </div>
            </ScrollArea>

            <div className="border-t pt-6 mt-6">
              <div className="flex items-center space-x-3 mb-4">
                <Checkbox 
                  id="accept-terms" 
                  checked={accepted}
                  onCheckedChange={setAccepted}
                />
                <label 
                  htmlFor="accept-terms" 
                  className="text-sm cursor-pointer"
                >
                  Tôi đã đọc và đồng ý với các điều khoản sử dụng
                </label>
              </div>

              <Button 
                onClick={onAccept}
                disabled={!accepted}
                className="w-full"
              >
                Tiếp tục sử dụng ứng dụng
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}