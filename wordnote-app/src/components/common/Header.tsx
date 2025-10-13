import React from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { BookOpen, Brain, Headphones, Book, Zap } from 'lucide-react';
import { DictionarySearchModal } from '../modal/DictionarySearch/DictionarySearchModal';
import { CategoryManagerModal } from '../modal/CategoryModal/CategoryManagerModal';

type ScreenType = 'vocabulary' | 'practice' | 'listening' | 'story' | 'freestudy';

interface HeaderProps {
  title: string;
  subtitle?: string;
  screenType?: ScreenType;
  onBack?: () => void;
  categories?: string[];
  onSaveWord?: (word: string, meaning: string, pronunciation: string, category: string) => void;
  showDictionaryPopup?: boolean;
  setShowDictionaryPopup?: (open: boolean) => void;
  showCategoryManager?: boolean;
  setShowCategoryManager?: (open: boolean) => void;
}

export function Header(props: HeaderProps) {
  // Default no-op function for onSaveWord to satisfy DictionarySearchModal's required prop
  const handleSaveWord = props.onSaveWord || (() => {});

  const getScreenIcon = (screenType?: ScreenType) => {
    switch (screenType) {
      case 'vocabulary':
        return '📝';
      case 'practice':
        return <Brain className="h-6 w-6" />;
      case 'listening':
        return <Headphones className="h-6 w-6" />;
      case 'story':
        return <Book className="h-6 w-6" />;
      case 'freestudy':
        return <Zap className="h-6 w-6" />;
      default:
        return '📝';
    }
  };

  const getScreenColor = (screenType?: ScreenType) => {
    switch (screenType) {
      case 'vocabulary':
        return 'bg-blue-600';
      case 'practice':
        return 'bg-purple-600';
      case 'listening':
        return 'bg-green-600';
      case 'story':
        return 'bg-orange-600';
      case 'freestudy':
        return 'bg-pink-600';
      default:
        return 'bg-blue-600';
    }
  };

  return (
    <div className={`${getScreenColor(props.screenType)} text-white p-6 shrink-0`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {props.onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={props.onBack}
              className="text-white hover:bg-white/20 p-2"
            >
              ←
            </Button>
          )}
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            {getScreenIcon(props.screenType)}
          </div>
          <div>
            <h1 className="text-xl">{props.title}</h1>
            {props.subtitle && (
              <p className="text-white/80 text-sm">
                {props.subtitle}
              </p>
            )}
          </div>
        </div>
        
        {(props.showDictionaryPopup !== undefined || props.showCategoryManager !== undefined) && (
          <div className="flex items-center space-x-2">
            {props.showDictionaryPopup !== undefined && props.setShowDictionaryPopup && (
              <Dialog open={props.showDictionaryPopup} onOpenChange={props.setShowDictionaryPopup}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    title="Tra từ điển"
                  >
                    <BookOpen className="h-5 w-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {props.showDictionaryPopup && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Tra từ điển</DialogTitle>
                      </DialogHeader>
                      <DictionarySearchModal
                        isOpen={props.showDictionaryPopup}
                        onClose={() => props.setShowDictionaryPopup(false)}
                        onSaveWord={handleSaveWord}
                        categories={props.categories || []}
                      />
                    </>
                  )}
                </DialogContent>
              </Dialog>
            )}
            
            {props.showCategoryManager !== undefined && props.setShowCategoryManager && (
              <Dialog open={props.showCategoryManager} onOpenChange={props.setShowCategoryManager}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20"
                    title="Quản lý danh mục"
                  >
                    <img
                      src="https://unpkg.com/heroicons@2.1.1/24/outline/folder.svg"
                      alt="Categories"
                      className="h-5 w-5 invert"
                    />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  {props.showCategoryManager && (
                    <>
                      <DialogHeader>
                        <DialogTitle>Quản lý danh mục</DialogTitle>
                      </DialogHeader>
                      <CategoryManagerModal
                        isOpen={props.showCategoryManager}
                        onClose={() => props.setShowCategoryManager(false)}
                      />
                    </>
                  )}
                </DialogContent>
              </Dialog>
            )}
          </div>
        )}
      </div>
    </div>
  );
}