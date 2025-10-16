import React from 'react';
import { CategorySelector } from './CategorySelector';
import { TopicMutiSelector } from './TopicMutiSelector';
import { DifficultyMutiSelector } from './DifficultyMutiSelector';
import { StatusStudiesMutiSelector } from './StatusStudiesMutiSelector';

export interface VocabularyFilterValue {
  categories: string[];
  topics: string[];
  difficulties: Array<'easy' | 'medium' | 'hard'>;
  masteryStatus: Array<'mastered' | 'not-mastered' | 'all'>;
}

interface VocabularyFilterProps {
  value: VocabularyFilterValue;
  onChange: (value: VocabularyFilterValue) => void;
  categoryTitle?: string;
  categoryDescription?: string;
  categoryIcon?: React.ReactNode;
}

export function VocabularyFilter({ value, onChange, categoryTitle, categoryDescription, categoryIcon }: VocabularyFilterProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-2">Danh mục ({value.categories.length} đã chọn)</label>
          <CategorySelector
            selectedCategories={value.categories}
            onSelectionChange={(items) => onChange({ ...value, categories: items })}
            className="w-full"
            title={categoryTitle ?? 'Chọn danh mục'}
            description={categoryDescription}
            icon={categoryIcon}
          />
        </div>

        <div>
          <label className="block text-sm mb-2">Chủ đề ({value.topics.length} đã chọn)</label>
          <TopicMutiSelector
            type="topic"
            selectedItems={value.topics}
            onSelectionChange={(items) => onChange({ ...value, topics: items })}
            className="w-full"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm mb-2">Độ khó</label>
        <DifficultyMutiSelector
          selected={value.difficulties as any}
          onChange={(items) => onChange({ ...value, difficulties: items as any })}
        />
      </div>

      <div>
        <label className="block text-sm mb-2">Trạng thái học</label>
        <StatusStudiesMutiSelector
          selected={value.masteryStatus as any}
          onChange={(items) => onChange({ ...value, masteryStatus: items as any })}
        />
      </div>
    </div>
  );
}


