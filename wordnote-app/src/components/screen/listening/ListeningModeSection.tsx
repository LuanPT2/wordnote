// ListeningModeSection.tsx
import React from 'react';
import { Button } from '../../ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from '../../ui/collapsible';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Slider } from '../../ui/slider'; // ← THÊM SLIDER
import { ListeningConfig } from './types';

interface ListeningModeSectionProps {
  config: ListeningConfig;
  setConfig: React.Dispatch<React.SetStateAction<ListeningConfig>>;
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
}

export function ListeningModeSection({
  config,
  setConfig,
  expanded,
  onExpandedChange,
}: ListeningModeSectionProps) {
  
  const handleModeToggle = (value: string) => {
    setConfig(prev => ({
      ...prev,
      mode: prev.mode.includes(value)
        ? prev.mode.filter(m => m !== value)
        : [...prev.mode, value]
    }));
  };

  const isModeActive = (value: string) => config.mode.includes(value);

  const modeOptions = [
    { value: 'word', label: 'Từ vựng', icon: '📖' },
    { value: 'pronunciation', label: 'Phiên âm', icon: '🔊' },
    { value: 'meaning', label: 'Nghĩa', icon: '📝' },
    { value: 'examples', label: 'Ví dụ', icon: '💡' },
    { value: 'example-translation', label: 'Dịch ví dụ', icon: '🌐' }
  ];

  const pauseOptions = [
    { value: '0', label: 'Không dừng' },
    { value: '1', label: '1 giây' },
    { value: '2', label: '2 giây' },
    { value: '3', label: '3 giây' }
  ];

  // Thời gian giữa các từ: 0.5s → 5s, bước 0.2s
  const getWordPauseValue = () => {
    // Chuyển đổi từ giây sang scale 0-22.5 (0.5=2.5, 5=22.5, step=1 cho 0.2s)
    return (config.pauseBetweenWords - 0.5) / 0.2;
  };

  const setWordPauseValue = (value: number[]) => {
    const seconds = 0.5 + (value[0] * 0.2);
    setConfig(prev => ({
      ...prev,
      pauseBetweenWords: Math.round(seconds * 10) / 10 // Làm tròn 1 chữ số thập phân
    }));
  };

  const formatWordPauseLabel = (value: number) => {
    const seconds = 0.5 + (value * 0.2);
    return `${(Math.round(seconds * 10) / 10).toFixed(1)}s`;
  };

  // Thời gian giữa từ và nghĩa/ví dụ: 0.5s → 5s, bước 0.2s (giống thanh phía dưới)
  const getPartsPauseValue = () => {
    return (config.pauseBetweenParts - 0.5) / 0.2;
  };

  const setPartsPauseValue = (value: number[]) => {
    const seconds = 0.5 + (value[0] * 0.2);
    setConfig(prev => ({
      ...prev,
      pauseBetweenParts: Math.round(seconds * 10) / 10
    }));
  };

  const formatPartsPauseLabel = (value: number) => {
    const seconds = 0.5 + (value * 0.2);
    return `${(Math.round(seconds * 10) / 10).toFixed(1)}s`;
  };

  return (
    <Collapsible open={expanded} onOpenChange={onExpandedChange}>
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CollapsibleTrigger className="w-full">
          <CardHeader className="pb-3 hover:bg-muted/20 transition-colors rounded-t-lg">
            <CardTitle className="flex items-center justify-between text-left">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <span className="text-orange-600 text-lg">⚙️</span>
                </div>
                <span className="text-lg">Chế độ nghe</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {config.mode.length} đã chọn
                </span>
                {expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="animate-in slide-in-from-top-2 duration-200">
          <CardContent className="space-y-4 pt-0">
            {/* Mode Selection - BUTTON TOGGLES */}
            <div className="space-y-3">
              <label className="block text-sm font-medium mb-3">
                Nội dung nghe (chọn nhiều)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-muted/20 rounded-md">
                {modeOptions.map((option) => {
                  const active = isModeActive(option.value);
                  return (
                    <Button
                      key={option.value}
                      variant="outline"
                      className={
                        "h-12 justify-start text-left flex items-center space-x-2 border transition-colors " +
                        (active
                          ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700"
                          : "bg-white text-foreground hover:bg-muted/40")
                      }
                      onClick={() => handleModeToggle(option.value)}
                    >
                      <span className="text-lg">{option.icon}</span>
                      <span className="text-sm">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Pause Settings */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Thời gian giữa từ và nghĩa/ví dụ
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[getPartsPauseValue()]}
                    onValueChange={setPartsPauseValue}
                    max={22.5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0.5s</span>
                    <span className="font-medium">
                      {formatPartsPauseLabel(getPartsPauseValue())}
                    </span>
                    <span>5s</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium mb-2">
                  Thời gian giữa các từ
                </label>
                <div className="space-y-2">
                  <Slider
                    value={[getWordPauseValue()]}
                    onValueChange={setWordPauseValue}
                    max={22.5}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>0.5s</span>
                    <span className="font-medium">
                      {formatWordPauseLabel(getWordPauseValue())}
                    </span>
                    <span>5s</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}