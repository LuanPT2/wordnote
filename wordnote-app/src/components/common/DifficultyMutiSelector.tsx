import React from 'react';
import { Button } from '../ui/button';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyMutiSelectorProps {
  selected: Difficulty[];
  onChange: (items: Difficulty[]) => void;
  className?: string;
}

export function DifficultyMutiSelector({ selected, onChange, className }: DifficultyMutiSelectorProps) {
  const options: Array<{ value: Difficulty; label: string; emoji: string }> = [
    { value: 'easy', label: 'Dễ', emoji: '🟢' },
    { value: 'medium', label: 'Trung bình', emoji: '🟡' },
    { value: 'hard', label: 'Khó', emoji: '🔴' },
  ];

  const toggle = (value: Difficulty) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={`grid grid-cols-3 gap-2 ${className ?? ''}`}>
      {options.map(opt => {
        const active = selected.includes(opt.value);
        return (
          <Button
            key={opt.value}
            type="button"
            variant="outline"
            className={
              "h-10 justify-center border transition-colors " +
              (active
                ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                : "bg-white text-foreground hover:bg-muted/40")
            }
            onClick={() => toggle(opt.value)}
          >
            <span className="mr-2">{opt.emoji}</span>
            <span className="text-sm">{opt.label}</span>
          </Button>
        );
      })}
    </div>
  );
}



