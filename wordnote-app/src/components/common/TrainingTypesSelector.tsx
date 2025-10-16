import React from 'react';
import { Button } from '../ui/button';

export type TrainingType =
  | 'shadowing'
  | 'flashcard'
  | 'speaking'
  | 'listening-fill'
  | 'reading'
  | 'reaction';

interface TrainingTypesSelectorProps {
  selected: TrainingType[];
  onChange: (items: TrainingType[]) => void;
}

const OPTIONS: Array<{ value: TrainingType; label: string; emoji: string }> = [
  { value: 'shadowing', label: 'Shadowing', emoji: '🗣️' },
  { value: 'flashcard', label: 'Flashcard', emoji: '🃏' },
  { value: 'speaking', label: 'Speaking', emoji: '🎤' },
  { value: 'listening-fill', label: 'Luyện nghe - điền từ', emoji: '🎧' },
  { value: 'reading', label: 'Đọc hiểu', emoji: '📖' },
  { value: 'reaction', label: 'Luyện phản xạ', emoji: '⚡' },
];

export function TrainingTypesSelector({ selected, onChange }: TrainingTypesSelectorProps) {
  const toggle = (value: TrainingType) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm mb-2">Loại luyện tập (chọn nhiều)</label>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {OPTIONS.map(opt => {
          const active = selected.includes(opt.value);
          return (
            <Button
              key={opt.value}
              type="button"
              variant="outline"
              className={
                "h-12 justify-start text-left flex items-center space-x-2 border transition-colors " +
                (active
                  ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                  : "bg-white text-foreground hover:bg-muted/40")
              }
              onClick={() => toggle(opt.value)}
            >
              <span className="text-lg">{opt.emoji}</span>
              <span className="text-sm">{opt.label}</span>
            </Button>
          );
        })}
      </div>
    </div>
  );
}


