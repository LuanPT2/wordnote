import { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import Dashboard from "./components/Dashboard";
import VocabularyManagement from "./components/VocabularyManagement";
import UserManagement from "./components/UserManagement";
import StoriesManagement from "./components/StoriesManagement";

export default function App() {
  const [currentPage, setCurrentPage] = useState("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "vocabulary":
        return <VocabularyManagement />;
      case "stories":
        return <StoriesManagement />;
      case "users":
        return <UserManagement />;
      case "vocabulary-sets":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Quản lý Bộ từ vựng</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "permissions":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Phân quyền</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "audit-logs":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Lịch sử hoạt động</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "reports":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Báo cáo</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      case "settings":
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold mb-4">Cài đặt</h2>
            <p className="text-gray-600">Tính năng đang được phát triển...</p>
          </div>
        );
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
}