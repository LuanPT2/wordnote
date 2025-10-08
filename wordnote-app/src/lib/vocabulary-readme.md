# WordNote Vocabulary Library

Thư viện từ vựng hoàn chỉnh cho ứng dụng WordNote với hệ thống quản lý từ vựng, danh mục phân cấp và tích hợp đa màn hình.

## Tính năng chính

### 🎯 Quản lý từ vựng
- Thêm, sửa, xóa từ vựng
- Hệ thống ví dụ với bản dịch
- Phân loại theo độ khó (dễ/trung bình/khó)
- Theo dõi trạng thái "đã thuộc"/"chưa thuộc"
- Đếm số lần ôn tập và ngày ôn cuối

### 📂 Hệ thống danh mục phân cấp
- Danh mục cha và con
- Màu sắc tùy chỉnh cho từng danh mục
- Tạo danh mục nhanh hoặc tùy chỉnh chi tiết
- Quản lý danh mục động

### 🔍 Tìm kiếm và lọc nâng cao
- Tìm kiếm trong từ, nghĩa, phiên âm, ví dụ
- Lọc theo danh mục, độ khó, trạng thái
- Sắp xếp theo nhiều tiêu chí
- Lọc theo khoảng thời gian

### 📊 Thống kê và báo cáo
- Tổng số từ vựng
- Số từ đã thuộc/chưa thuộc
- Phân bố theo độ khó và danh mục
- Từ mới thêm gần đây
- Từ cần ôn tập

### 🔧 Thao tác hàng loạt
- Chọn nhiều từ cùng lúc
- Xóa/chuyển danh mục hàng loạt
- Đánh dấu "đã thuộc" hàng loạt
- Thay đổi độ khó hàng loạt

### 💾 Import/Export
- Xuất dữ liệu JSON
- Nhập dữ liệu từ file JSON
- Sao lưu và khôi phục

## Cách sử dụng

### Import thư viện

```typescript
// Import toàn bộ thư viện
import vocabularyLib from '../lib/vocabulary-index';

// Import từng phần
import { vocabularyLibrary, VocabularyManager, useVocabulary } from '../lib/vocabulary-index';
```

### Sử dụng trong React Component

```typescript
import { VocabularyManager } from '../lib/vocabulary-index';

function MyComponent() {
  return (
    <VocabularyManager
      showHeader={true}
      onItemAdded={(item) => console.log('Added:', item)}
      onItemUpdated={(item) => console.log('Updated:', item)}
      onItemDeleted={(id) => console.log('Deleted:', id)}
      initialFilter={{ categories: ['TOEIC'] }}
    />
  );
}
```

### Sử dụng hook tiện ích

```typescript
import { useVocabulary } from '../lib/vocabulary-index';

function MyComponent() {
  const { library, utils, addWord, search, getStats } = useVocabulary();
  
  // Thêm từ nhanh
  const handleAddWord = () => {
    addWord('hello', 'xin chào', 'Daily');
  };
  
  // Tìm kiếm
  const results = search('hello');
  
  // Lấy thống kê
  const stats = getStats();
  
  return (
    <div>
      <p>Tổng số từ: {stats.total}</p>
      <button onClick={handleAddWord}>Thêm từ</button>
    </div>
  );
}
```

### Tích hợp vào các màn hình khác

```typescript
import { vocabularyIntegration } from '../lib/vocabulary-index';

// Cho màn hình Practice
const practiceWords = vocabularyIntegration.getPracticeWords('medium', 20);

// Cho màn hình Listening
const listeningWords = vocabularyIntegration.getListeningWords('TOEIC', 15);

// Cho màn hình Story
const storyWords = vocabularyIntegration.getStoryWords(10);

// Đánh dấu đã ôn tập
vocabularyIntegration.markAsReviewed(wordId);

// Toggle trạng thái "đã thuộc"
const newStatus = vocabularyIntegration.toggleMastered(wordId);
```

### Quản lý danh mục

```typescript
import { vocabularyLibrary } from '../lib/vocabulary-index';

// Tạo danh mục mới
const newCategory = vocabularyLibrary.addCategory({
  name: 'IELTS Speaking',
  parentId: 'ielts-category-id', // Tùy chọn
  color: 'bg-green-100 text-green-800',
  description: 'Từ vựng cho IELTS Speaking'
});

// Lấy danh sách danh mục phân cấp
const hierarchy = vocabularyLibrary.getCategoriesHierarchy();
```

### Thao tác hàng loạt

```typescript
// Xóa nhiều từ
vocabularyLibrary.executeBulkOperation({
  type: 'delete',
  itemIds: ['word1', 'word2', 'word3']
});

// Chuyển danh mục
vocabularyLibrary.executeBulkOperation({
  type: 'move-category',
  itemIds: ['word1', 'word2'],
  data: { category: 'New Category' }
});

// Đánh dấu đã thuộc
vocabularyLibrary.executeBulkOperation({
  type: 'mark-mastered',
  itemIds: ['word1', 'word2'],
  data: { mastered: true }
});
```

### Import/Export dữ liệu

```typescript
import { vocabularyUtils } from '../lib/vocabulary-index';

// Xuất file JSON
vocabularyUtils.exportToJSON();

// Nhập từ file
const fileInput = document.getElementById('file-input') as HTMLInputElement;
const file = fileInput.files[0];
vocabularyUtils.importFromJSON(file).then(success => {
  console.log('Import success:', success);
});
```

## Tích hợp vào các màn hình

### 1. Màn hình Vocabulary (đã tích hợp)
- Sử dụng `VocabularyManager` component
- Tích hợp với `DictionarySearchPopup`

### 2. Màn hình Practice
```typescript
import { vocabularyIntegration } from '../lib/vocabulary-index';

const words = vocabularyIntegration.getPracticeWords('medium', 20);
// Sử dụng words cho flashcard hoặc quiz
```

### 3. Màn hình Listening
```typescript
const words = vocabularyIntegration.getListeningWords('TOEIC', 15);
// Phát âm từ vựng cho listening practice
```

### 4. Màn hình Story
```typescript
const words = vocabularyIntegration.getStoryWords(10);
// Highlight từ vựng trong story
```

### 5. Màn hình Free Study
```typescript
const recentWords = vocabularyIntegration.getRecentWords(7, 30);
// Hiển thị từ vựng học gần đây
```

## API Reference

### VocabularyLibrary Class

#### Vocabulary Operations
- `addVocabularyItem(item)` - Thêm từ vựng mới
- `updateVocabularyItem(id, updates)` - Cập nhật từ vựng
- `deleteVocabularyItem(id)` - Xóa từ vựng
- `getVocabularyItem(id)` - Lấy từ vựng theo ID
- `getAllVocabulary()` - Lấy tất cả từ vựng

#### Category Operations
- `addCategory(category)` - Thêm danh mục mới
- `updateCategory(id, updates)` - Cập nhật danh mục
- `deleteCategory(id)` - Xóa danh mục
- `getCategories()` - Lấy danh sách danh mục
- `getCategoriesHierarchy()` - Lấy cây danh mục

#### Search & Filter
- `filterVocabulary(filter)` - Lọc từ vựng
- `sortVocabulary(items, options)` - Sắp xếp từ vựng
- `searchAndSort(filter, sort)` - Tìm kiếm và sắp xếp

#### Bulk Operations
- `executeBulkOperation(operation)` - Thực hiện thao tác hàng loạt

#### Statistics
- `getStatistics()` - Lấy thống kê tổng quan

#### Import/Export
- `exportData()` - Xuất dữ liệu
- `importData(data)` - Nhập dữ liệu

### VocabularyManager Component Props

```typescript
interface VocabularyManagerProps {
  onItemAdded?: (item: VocabularyItem) => void;
  onItemUpdated?: (item: VocabularyItem) => void;
  onItemDeleted?: (itemId: string) => void;
  initialFilter?: VocabularyFilter;
  showHeader?: boolean;
  className?: string;
}
```

### CategoryCreator Component Props

```typescript
interface CategoryCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (category: Category) => void;
  selectedCategory?: string;
}
```

## Lưu ý quan trọng

1. **Persistence**: Dữ liệu được lưu tự động vào localStorage
2. **Performance**: Thư viện được tối ưu cho việc xử lý lượng lớn từ vựng
3. **Memory**: Dữ liệu được cache trong memory để truy cập nhanh
4. **Reactivity**: Cần refresh component khi dữ liệu thay đổi từ ngoài
5. **Error Handling**: Tất cả operations đều có error handling

## Mở rộng

Thư viện được thiết kế để dễ dàng mở rộng:

1. Thêm type mới trong `vocabulary-types.ts`
2. Extend VocabularyLibrary class
3. Tạo component UI mới
4. Thêm integration helper mới

## License

MIT License - WordNote Vocabulary Library