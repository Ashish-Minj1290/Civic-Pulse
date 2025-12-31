
import React from 'react';
import { NavItem } from '../types';
import { Language, translations } from '../translations';

interface SidebarProps {
  isOpen: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose: () => void;
  language: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activeTab, onTabChange, onClose, language }) => {
  const t = translations[language];

  const navItems: NavItem[] = [
    { id: 'home', label: t.dashboard, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { id: 'leaders', label: t.leaders, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg> },
    { id: 'promises', label: t.promises, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
    { id: 'compare', label: t.compare, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg> },
    { id: 'polls', label: t.polls, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg> },
    { id: 'chatrooms', label: t.chatrooms, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9l-4 4v-4H3a2 2 0 01-2-2V10a2 2 0 012-2h2M9 21V5a2 2 0 012-2h10a2 2 0 012 2v16l-4-4h-6l-4 4z" /></svg> },
    { id: 'forums', label: t.forums, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg> },
    { id: 'complaints', label: t.reportIssue, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg> },
    { id: 'events', label: t.liveEvents, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> },
    { id: 'campaigns', label: t.campaigns, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg> },
    { id: 'leaderboard', label: t.leaderboards, icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" /></svg> },
  ];

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[60] transition-opacity duration-300 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <aside className={`
        fixed inset-y-0 left-0 z-[70] transition-all duration-500 ease-in-out bg-white border-r border-slate-100 flex flex-col
        ${isOpen ? 'w-72 translate-x-0 shadow-2xl' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-10
        md:w-20 xl:w-72
      `}>
        <div className="p-4 md:p-6 xl:p-8 flex items-center justify-between shrink-0 overflow-hidden">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center shrink-0 border border-orange-100 shadow-sm transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
               <img 
                 src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" 
                 className="w-6 h-4 object-cover rounded-sm shadow-sm" 
                 alt="India" 
               />
            </div>
            <div className="transition-all duration-300 hidden xl:block opacity-0 xl:opacity-100 whitespace-nowrap">
              <span className="text-xl font-black text-slate-800 tracking-tight">accountable_<span className="text-emerald-600">INDIA</span></span>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Political Transparency</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 md:hidden transition-transform hover:rotate-90">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <nav className="flex-1 px-3 md:px-2 xl:px-4 space-y-2 py-4 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                if (window.innerWidth < 768) onClose();
              }}
              title={item.label}
              className={`
                w-full flex items-center transition-all duration-300 group relative
                rounded-2xl
                ${activeTab === item.id 
                  ? 'bg-orange-500 text-white shadow-xl shadow-orange-500/30' 
                  : 'hover:bg-orange-50 text-slate-500 hover:text-orange-600'}
                px-4 xl:px-6 py-4
                md:justify-center xl:justify-start
              `}
            >
              <div className={`
                absolute left-0 w-1 h-6 bg-orange-600 rounded-r-full transition-all duration-300
                ${activeTab === item.id ? 'opacity-100' : 'opacity-0'}
                hidden md:block xl:hidden
              `} />

              <div className={`
                shrink-0 transition-all duration-300
                group-hover:scale-125 group-hover:rotate-3
                ${activeTab === item.id ? 'scale-110' : ''}
              `}>
                {item.icon}
              </div>
              
              <span className={`
                text-sm font-bold whitespace-nowrap transition-all duration-500 ml-4
                md:hidden xl:block
                ${activeTab === item.id ? 'translate-x-1' : ''}
              `}>
                {item.label}
              </span>

              <div className="
                absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider rounded-xl 
                opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[80] shadow-2xl border border-slate-700/50
                hidden md:flex xl:hidden translate-x-[-20px] group-hover:translate-x-0 items-center gap-2 whitespace-nowrap
              ">
                <div className="w-1 h-1 bg-orange-500 rounded-full animate-ping" />
                {item.label}
                <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-900" />
              </div>
            </button>
          ))}
        </nav>

        <div className="p-3 md:p-2 xl:p-6 border-t border-slate-50 bg-slate-50/30">
          <button 
            onClick={() => { onTabChange('settings'); if (window.innerWidth < 768) onClose(); }}
            title={t.settings}
            className={`
              flex items-center w-full p-3 rounded-2xl transition-all duration-300 group relative
              md:justify-center xl:justify-start
              ${activeTab === 'settings' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20' : 'hover:bg-white text-slate-500'}
            `}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 shrink-0
              ${activeTab === 'settings' ? 'bg-white/20' : 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'}
            `}>
              <svg className="w-5 h-5 group-hover:rotate-45 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37a1.724 1.724 0 002.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </div>
            <div className="text-left ml-4 hidden xl:block">
              <p className={`text-sm font-black transition-colors ${activeTab === 'settings' ? 'text-white' : 'text-slate-800'}`}>{t.settings}</p>
              <p className={`text-[10px] font-bold ${activeTab === 'settings' ? 'text-emerald-100' : 'text-slate-400'}`}>Profile & Preferences</p>
            </div>
            
            <div className="
              absolute left-full ml-6 px-4 py-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-wider rounded-xl 
              opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-[80] shadow-2xl border border-slate-700/50
              hidden md:flex xl:hidden translate-x-[-20px] group-hover:translate-x-0 items-center gap-2
            ">
              {t.settings}
              <div className="absolute left-[-6px] top-1/2 -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-slate-900" />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
