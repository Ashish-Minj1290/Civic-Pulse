
import React, { useState } from 'react';
import { User } from '../types';
import { ThemePreference } from '../App';
import { Language, translations } from '../translations';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onProfileClick?: () => void;
  toggleSidebar: () => void;
  themePreference: ThemePreference;
  setThemePreference: (pref: ThemePreference) => void;
  language: Language;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onLogout, onProfileClick, toggleSidebar, themePreference, setThemePreference, language
}) => {
  const [showProfile, setShowProfile] = useState(false);
  const t = translations[language];

  return (
    <header className="h-20 bg-transparent flex items-center justify-between px-8 md:px-12 shrink-0 z-20">
      <div className="flex items-center gap-4">
        <button 
          onClick={toggleSidebar}
          className="p-3 hover:bg-white dark:hover:bg-slate-800 rounded-xl text-slate-500 transition border border-transparent hover:border-slate-100 dark:hover:border-slate-700 shadow-sm lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button 
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-4 p-2 pl-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition group"
          >
            <div className="text-right">
              <div className="text-sm font-black text-slate-800 dark:text-white leading-none">{user.name}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{t.verifiedCitizen}</div>
            </div>
            <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border-2 border-slate-50 dark:border-slate-800 shadow-inner group-hover:scale-105 transition" alt="profile" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowProfile(false)}></div>
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-100 dark:border-slate-800 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-200">
                <button onClick={() => { onProfileClick?.(); setShowProfile(false); }} className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">{t.yourProfile}</button>
                <button className="w-full text-left px-5 py-3 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800">{t.notifications}</button>
                <hr className="my-2 border-slate-50 dark:border-slate-800" />
                <button onClick={onLogout} className="w-full text-left px-5 py-3 text-sm font-black text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/30 transition">{t.signOut}</button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
