import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultySelectorProps {
  value: Difficulty;
  onChange: (value: Difficulty) => void;
}

export function DifficultySelector({ value, onChange }: DifficultySelectorProps) {
  return (
    <div>
      <label className="block text-sm mb-2 font-medium text-gray-700">Độ khó</label>
      <Select value={value} onValueChange={(v) => onChange(v as Difficulty)}>
        <SelectTrigger className="border-orange-300 focus:border-orange-500 focus:ring-orange-500">
          <SelectValue placeholder="Chọn độ khó" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="easy">🟢 Dễ</SelectItem>
          <SelectItem value="medium">🟡 Trung bình</SelectItem>
          <SelectItem value="hard">🔴 Khó</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}


