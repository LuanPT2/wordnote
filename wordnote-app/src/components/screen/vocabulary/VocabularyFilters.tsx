import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../../ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '../../ui/popover';
import { Button } from '../../ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '../../ui/collapsible';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { TopicSelector } from '../../common/TopicSelector';
import { CategorySelector } from '../../common/CategorySelector';
import clsx from 'clsx';

interface VocabularyFiltersProps {
  filterCategoryList: string[];
  filterTopicList: string[];
  filterDifficulty: string;
  filterMastered: string;
  sortBy: string;
  sortOrder: string;
  visibleColumns: string[];
  showColumnSelector: boolean;
  filtersExpanded: boolean;
  setFilterCategoryList: (categories: string[]) => void;
  setFilterTopicList: (topics: string[]) => void;
  setFilterDifficulty: (difficulty: string) => void;
  setFilterMastered: (mastered: string) => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (sortOrder: string) => void;
  setVisibleColumns: (columns: string[]) => void;
  setShowColumnSelector: (show: boolean) => void;
  setFiltersExpanded: (expanded: boolean) => void;
}

export function VocabularyFilters({
  filterCategoryList,
  filterTopicList,
  filterDifficulty,
  filterMastered,
  sortBy,
  sortOrder,
  visibleColumns,
  showColumnSelector,
  filtersExpanded,
  setFilterCategoryList,
  setFilterTopicList,
  setFilterDifficulty,
  setFilterMastered,
  setSortBy,
  setSortOrder,
  setVisibleColumns,
  setShowColumnSelector,
  setFiltersExpanded
}: VocabularyFiltersProps) {
  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter(col => col !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  const columnOptions = [
    { key: 'word', label: 'Từ vựng' },
    { key: 'pronunciation', label: 'Phiên âm' },
    { key: 'meaning', label: 'Nghĩa' },
    { key: 'examples', label: 'Ví dụ' },
    { key: 'category', label: 'Danh mục' },
    { key: 'difficulty', label: 'Độ khó' },
    { key: 'mastered', label: 'Trạng thái' }
  ];

  return (
    <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 bg-white border rounded-md hover:shadow-md transition-all duration-300 mb-4 cursor-pointer group">
        <div className="flex items-center space-x-2 text-gray-800 font-semibold">
          <Filter className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition" />
          <span>Bộ lọc</span>
        </div>
        {filtersExpanded ? (
          <ChevronUp className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition" />
        ) : (
          <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-blue-500 transition" />
        )}
      </CollapsibleTrigger>

      <CollapsibleContent className="space-y-6 mb-6">
        {/* Bộ lọc chính */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
            <CategorySelector
              selectedCategories={filterCategoryList}
              onSelectionChange={setFilterCategoryList}
              className="w-full"
              title="Chọn danh mục từ vựng"
              description="Chọn các danh mục từ vựng mà bạn muốn lọc"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
            <TopicSelector
              type="topic"
              selectedItems={filterTopicList}
              onSelectionChange={setFilterTopicList}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Độ khó</label>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả độ khó</SelectItem>
                <SelectItem value="easy">Dễ</SelectItem>
                <SelectItem value="medium">Trung bình</SelectItem>
                <SelectItem value="hard">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <Select value={filterMastered} onValueChange={setFilterMastered}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="mastered">Đã thuộc</SelectItem>
                <SelectItem value="not-mastered">Chưa thuộc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bộ lọc sắp xếp + hiển thị cột */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp theo</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn tiêu chí" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dateAdded">Ngày thêm</SelectItem>
                <SelectItem value="word">Từ vựng</SelectItem>
                <SelectItem value="reviewCount">Số lần ôn</SelectItem>
                <SelectItem value="difficulty">Độ khó</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Thứ tự</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Chọn thứ tự" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hiển thị cột</label>
            <Popover open={showColumnSelector} onOpenChange={setShowColumnSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{visibleColumns.length} cột</span>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[90vw] max-w-sm max-h-72 overflow-y-auto rounded-md shadow-lg border border-gray-200 bg-white transition-all duration-300 animate-in fade-in zoom-in-95"
                sideOffset={8}
              >
                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-800 mb-2">Chọn cột hiển thị</div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {columnOptions.map((column) => {
                      const isActive = visibleColumns.includes(column.key);
                      return (
                        <button
                          key={column.key}
                          onClick={() => toggleColumnVisibility(column.key)}
                          className={clsx(
                            'px-3 py-1.5 rounded-full text-sm font-medium border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1',
                            isActive
                              ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500'
                              : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 focus:ring-gray-300'
                          )}
                        >
                          {column.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
