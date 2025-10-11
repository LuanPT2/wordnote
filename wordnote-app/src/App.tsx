import React, { useState } from 'react';
import { LoginScreen } from './components/screen/login/LoginScreen';
import { TermsScreen } from './components/TermsScreen';
import { MainScreen } from './components/screen/main/MainScreen';
import { VocabularyScreen } from './components/screen/vocabulary/VocabularyScreen';
import { PracticeScreen } from './components/screen/practice/PracticeScreen';
import { ListeningScreen } from './components/screen/listening/ListeningScreen';
import { StoryScreen } from './components/screen/story/StoryScreen';
import { FreeStudyScreen } from './components/screen/freestudy/FreeStudyScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { BottomNavigation } from './components/common/BottomNavigation';

export type Screen = 'login' | 'terms' | 'main' | 'vocabulary' | 'practice' | 'listening' | 'story' | 'free-study' | 'settings';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [user, setUser] = useState<any>(null);

  const navigateToScreen = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleLogin = (provider: string) => {
    // Mock login
    setUser({ name: 'Người dùng', provider });
    setCurrentScreen('terms');
  };

  const handleAcceptTerms = () => {
    setCurrentScreen('main');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'login':
        return <LoginScreen onLogin={handleLogin} />;
      case 'terms':
        return <TermsScreen onAccept={handleAcceptTerms} />;
      case 'main':
        return <MainScreen onNavigate={navigateToScreen} onLogout={handleLogout} user={user} />;
      case 'vocabulary':
        return <VocabularyScreen onBack={() => navigateToScreen('main')} />;
      case 'practice':
        return <PracticeScreen onBack={() => navigateToScreen('main')} />;
      case 'listening':
        return <ListeningScreen onBack={() => navigateToScreen('main')} />;
      case 'story':
        return <StoryScreen onBack={() => navigateToScreen('main')} />;
      case 'free-study':
        return <FreeStudyScreen onBack={() => navigateToScreen('main')} />;
      case 'settings':
        return <SettingsScreen onBack={() => navigateToScreen('main')} user={user} />;
      default:
        return <LoginScreen onLogin={handleLogin} />;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-16">
      {renderScreen()}
      <BottomNavigation 
        currentScreen={currentScreen} 
        onNavigate={navigateToScreen} 
      />
    </div>
  );
}