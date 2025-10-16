import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface TopicSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <div>
      <label className="block text-sm mb-2 font-medium text-gray-700">Chủ đề</label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="border-purple-300 focus:border-purple-500 focus:ring-purple-500">
          <SelectValue placeholder="Chọn chủ đề" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="general">📚 Tổng quát</SelectItem>
          <SelectItem value="academic">🎓 Học thuật</SelectItem>
          <SelectItem value="business">💼 Kinh doanh</SelectItem>
          <SelectItem value="advanced">🚀 Nâng cao</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}


