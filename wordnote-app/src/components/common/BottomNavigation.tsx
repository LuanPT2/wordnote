import React from 'react';
import { Screen } from '../../App';

interface BottomNavigationProps {
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
}

export function BottomNavigation({ currentScreen, onNavigate }: BottomNavigationProps) {
  const navItems = [
    {
      id: 'vocabulary' as Screen,
      label: 'Từ vựng',
      icon: '📝',
      activeIcon: '📝'
    },
    {
      id: 'practice' as Screen,
      label: 'Luyện tập',
      icon: '🎯',
      activeIcon: '🎯'
    },
    {
      id: 'listening' as Screen,
      label: 'Nghe',
      icon: '🎵',
      activeIcon: '🎵'
    },
    {
      id: 'story' as Screen,
      label: 'Story',
      icon: '📺',
      activeIcon: '📺'
    },
    {
      id: 'free-study' as Screen,
      label: 'Tự do',
      icon: '📚',
      activeIcon: '📚'
    }
  ];

  // Don't show bottom nav on login, terms, main, and settings screens
  const hideOnScreens: Screen[] = ['login', 'terms', 'main', 'settings'];
  if (hideOnScreens.includes(currentScreen)) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 safe-area-pb">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center space-y-1 transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="text-lg">
                {isActive ? item.activeIcon : item.icon}
              </span>
              <span className="text-xs font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}