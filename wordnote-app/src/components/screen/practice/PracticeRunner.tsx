import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { ListeningFillMode, PracticeWord } from './modes/ListeningFillMode';

export type TrainingType =
  | 'shadowing'
  | 'flashcard'
  | 'speaking'
  | 'listening-fill'
  | 'reading'
  | 'reaction';

interface PracticeRunnerProps {
  selectedTypes: TrainingType[];
  words: PracticeWord[];
  onExit: () => void;
}

const PLACEHOLDER = ({ label }: { label: string }) => (
  <Card>
    <CardContent className="p-12 text-center text-muted-foreground">
      <div className="text-4xl mb-3">🚧</div>
      <div className="text-base">{label} đang được phát triển.</div>
    </CardContent>
  </Card>
);

export function PracticeRunner({ selectedTypes, words, onExit }: PracticeRunnerProps) {
  const [active, setActive] = useState<TrainingType>(selectedTypes[0] ?? 'listening-fill');

  const orderedTypes = selectedTypes.length > 0 ? selectedTypes : (['listening-fill'] as TrainingType[]);

  return (
    <div className="space-y-4">
      <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Chế độ luyện tập</span>
            <Button variant="outline" onClick={onExit}>Thoát</Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={active} onValueChange={(v) => setActive(v as TrainingType)}>
            <TabsList className="flex w-full flex-wrap gap-2 bg-white/60">
              {orderedTypes.map((t) => (
                <TabsTrigger key={t} value={t} className="px-3 py-1 data-[state=active]:bg-white">
                  {t === 'listening-fill' ? 'Luyện nghe - điền từ' :
                   t === 'shadowing' ? 'Shadowing' :
                   t === 'flashcard' ? 'Flashcard' :
                   t === 'speaking' ? 'Speaking' :
                   t === 'reading' ? 'Đọc hiểu' : 'Luyện phản xạ'}
                </TabsTrigger>
              ))}
            </TabsList>

            {orderedTypes.map((t) => (
              <TabsContent key={t} value={t} className="mt-4 space-y-4">
                {t === 'listening-fill' && <ListeningFillMode words={words} />}
                {t !== 'listening-fill' && (
                  <PLACEHOLDER label={
                    t === 'shadowing' ? 'Shadowing' :
                    t === 'flashcard' ? 'Flashcard' :
                    t === 'speaking' ? 'Speaking' :
                    t === 'reading' ? 'Đọc hiểu' : 'Luyện phản xạ'
                  } />
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}


