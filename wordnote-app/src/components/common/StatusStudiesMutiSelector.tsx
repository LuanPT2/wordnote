import React from 'react';
import { Button } from '../ui/button';

type StatusValue = 'mastered' | 'not-mastered' | 'all';

interface StatusStudiesMutiSelectorProps {
  selected: StatusValue[];
  onChange: (items: StatusValue[]) => void;
  className?: string;
}

export function StatusStudiesMutiSelector({ selected, onChange, className }: StatusStudiesMutiSelectorProps) {
  const options: Array<{ value: StatusValue; label: string; emoji: string }> = [
    { value: 'mastered', label: 'Đã thuộc', emoji: '✅' },
    { value: 'not-mastered', label: 'Chưa thuộc', emoji: '🕒' },
  ];

  const toggle = (value: StatusValue) => {
    if (selected.includes(value)) {
      onChange(selected.filter(v => v !== value));
    } else {
      onChange([...selected, value]);
    }
  };

  return (
    <div className={`grid grid-cols-2 gap-2 ${className ?? ''}`}>
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


