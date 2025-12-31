
import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import DashboardLayout from './components/DashboardLayout';
import WelcomePage from './components/WelcomePage';
import { User } from './types';
import { Language } from './translations';

export type ThemePreference = 'light' | 'dark' | 'auto';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('nexus_user');
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    return {
      ...parsed,
      credits: parsed.credits ?? 1250,
      impactScore: parsed.impactScore ?? { daily: 4, weekly: 28 }
    };
  });
  
  const [view, setView] = useState<'auth' | 'welcome' | 'dashboard'>('auth');
  
  const [themePreference, setThemePreference] = useState<ThemePreference>(() => {
    const saved = localStorage.getItem('themePreference') as ThemePreference;
    return saved || 'auto';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  const calculateTheme = useCallback(() => {
    if (themePreference === 'dark') return true;
    if (themePreference === 'light') return false;
    const hour = new Date().getHours();
    return hour < 6 || hour >= 18;
  }, [themePreference]);

  useEffect(() => {
    const updateTheme = () => {
      const shouldBeDark = calculateTheme();
      setIsDarkMode(shouldBeDark);
      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
    updateTheme();
    localStorage.setItem('themePreference', themePreference);
    const interval = setInterval(updateTheme, 60000);
    return () => clearInterval(interval);
  }, [themePreference, calculateTheme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('nexus_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('nexus_user');
    }
  }, [user]);

  const handleLogin = (userData: User) => {
    const fullUserData = {
      ...userData,
      credits: userData.credits ?? 1250,
      impactScore: userData.impactScore ?? { daily: 4, weekly: 28 }
    };
    setUser(fullUserData);
    setView('welcome');
  };

  const handleLogout = () => {
    setUser(null);
    setView('auth');
  };

  const handleStartDashboard = () => {
    setView('dashboard');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
  };

  if (!user || view === 'auth') {
    return <Login onLogin={handleLogin} />;
  }

  if (view === 'welcome') {
    return <WelcomePage user={user} onContinue={handleStartDashboard} language={language} />;
  }

  return (
    <DashboardLayout 
      user={user} 
      onLogout={handleLogout} 
      onUpdateUser={handleUpdateUser}
      isDarkMode={isDarkMode} 
      themePreference={themePreference}
      setThemePreference={setThemePreference}
      language={language}
      setLanguage={setLanguage}
    />
  );
};

export default App;
