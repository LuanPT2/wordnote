import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Checkbox } from '../../ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Button } from '../../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../ui/collapsible';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { TopicSelector } from '../../common/TopicSelector';

interface VocabularyFiltersPanelProps {
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

export function VocabularyFiltersPanel({
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
  setFiltersExpanded,
}: VocabularyFiltersPanelProps) {
  const toggleColumnVisibility = (column: string) => {
    if (visibleColumns.includes(column)) {
      setVisibleColumns(visibleColumns.filter(col => col !== column));
    } else {
      setVisibleColumns([...visibleColumns, column]);
    }
  };

  return (
    <Collapsible open={filtersExpanded} onOpenChange={setFiltersExpanded}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 mb-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Bộ lọc</span>
        </div>
        {filtersExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="space-y-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm mb-2">Danh mục</label>
            <TopicSelector
              type="category"
              selectedItems={filterCategoryList}
              onSelectionChange={setFilterCategoryList}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Chủ đề</label>
            <TopicSelector
              type="topic"
              selectedItems={filterTopicList}
              onSelectionChange={setFilterTopicList}
              className="w-full"
            />
          </div>
          
          <div>
            <label className="block text-sm mb-2">Độ khó</label>
            <Select value={filterDifficulty} onValueChange={setFilterDifficulty}>
              <SelectTrigger>
                <SelectValue />
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
            <label className="block text-sm mb-2">Trạng thái</label>
            <Select value={filterMastered} onValueChange={setFilterMastered}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="mastered">Đã thuộc</SelectItem>
                <SelectItem value="not-mastered">Chưa thuộc</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Sắp xếp theo</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
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
            <label className="block text-sm mb-2">Thứ tự</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Tăng dần</SelectItem>
                <SelectItem value="desc">Giảm dần</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-2">Hiển thị cột</label>
            <Popover open={showColumnSelector} onOpenChange={setShowColumnSelector}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  <span>{visibleColumns.length} cột</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Hiển thị cột</div>
                  {[
                    { key: 'word', label: 'Từ vựng' },
                    { key: 'pronunciation', label: 'Phiên âm' },
                    { key: 'meaning', label: 'Nghĩa' },
                    { key: 'examples', label: 'Ví dụ' },
                    { key: 'category', label: 'Danh mục' },
                    { key: 'difficulty', label: 'Độ khó' },
                    { key: 'mastered', label: 'Trạng thái' }
                  ].map((column) => (
                    <div key={column.key} className="flex items-center space-x-2">
                      <Checkbox
                        id={column.key}
                        checked={visibleColumns.includes(column.key)}
                        onCheckedChange={() => toggleColumnVisibility(column.key)}
                      />
                      <label htmlFor={column.key} className="text-sm">
                        {column.label}
                      </label>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}