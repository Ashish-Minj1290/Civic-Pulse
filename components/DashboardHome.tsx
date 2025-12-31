
import React, { useState, useEffect } from 'react';
import { PoliticalPromise, User, Insight } from '../types';
import { Language, translations } from '../translations';
import { getDashboardInsights } from '../services/geminiService';

interface DashboardHomeProps {
  language: Language;
  user: User;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({ language, user }) => {
  const [scope, setScope] = useState<'Centre' | 'State'>('Centre');
  const [searchQuery, setSearchQuery] = useState('');
  const [promises, setPromises] = useState<PoliticalPromise[]>([]);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isInsightsLoading, setIsInsightsLoading] = useState(true);
  const t = translations[language];

  useEffect(() => {
    const saved = localStorage.getItem('nexus_complaints');
    if (saved) {
      setPromises(JSON.parse(saved));
    }

    const fetchInsights = async () => {
      setIsInsightsLoading(true);
      const data = await getDashboardInsights(user.name);
      setInsights(data);
      setIsInsightsLoading(false);
    };

    fetchInsights();
  }, [user.name]);

  const stats = {
    total: promises.length,
    completed: promises.filter(p => p.status === 'Resolved' || p.status === 'Completed').length,
    inProgress: promises.filter(p => p.status === 'Processing' || p.status === 'Active').length,
    delayed: promises.filter(p => p.status === 'Delayed').length,
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            {t.developIndia}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
            {t.trackAccountability}
          </p>
        </div>
        
        {/* Scope Toggles */}
        <div className="bg-white dark:bg-slate-900 p-1 rounded-2xl flex gap-1 shadow-sm border border-slate-100 dark:border-slate-800 shrink-0">
          <button 
            onClick={() => setScope('Centre')}
            className={`px-8 py-2.5 rounded-xl font-black text-sm transition flex items-center gap-2 ${scope === 'Centre' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
            {t.centre}
          </button>
          <button 
            onClick={() => setScope('State')}
            className={`px-8 py-2.5 rounded-xl font-black text-sm transition flex items-center gap-2 ${scope === 'State' ? 'bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            {t.stateUt}
          </button>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="px-2 py-0.5 bg-indigo-600 text-[10px] font-black text-white rounded uppercase tracking-widest flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            AI Insights
          </div>
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Updates for {user.name.split(' ')[0]}</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isInsightsLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm animate-pulse h-32" />
            ))
          ) : (
            insights.map((insight, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:scale-110 transition-transform duration-500">
                   <svg className="w-12 h-12 text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                </div>
                <h4 className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1.5">
                   <span className="w-1 h-1 bg-indigo-500 rounded-full" />
                   {insight.topic}
                </h4>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
                  {insight.summary}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.total}</p>
              <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stats.total}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.completed}</p>
              <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.completed}</h3>
            </div>
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.inProgress}</p>
              <h3 className="text-4xl font-black text-blue-600 dark:text-blue-400">{stats.inProgress}</h3>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.delayed}</p>
              <h3 className="text-4xl font-black text-orange-600 dark:text-orange-400">{stats.delayed}</h3>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-[1.5rem] border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input 
            type="text" 
            placeholder={t.searchPromises} 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition font-medium dark:text-white"
          />
        </div>
        <div className="md:col-span-3">
          <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium appearance-none dark:text-white">
            <option>{t.allStatus}</option>
            <option>{t.completed}</option>
            <option>{t.inProgress}</option>
            <option>{t.delayed}</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <select className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none font-medium appearance-none dark:text-white">
            <option>{t.allCategories}</option>
            <option>Infrastructure</option>
            <option>Education</option>
            <option>Environment</option>
          </select>
        </div>
      </div>

      {/* Empty State / Content */}
      <div className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm min-h-[400px] flex flex-col items-center justify-center p-20 text-center">
        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
          <svg className="w-12 h-12 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-2">{t.noPromisesFound}</h3>
        <p className="text-slate-400 dark:text-slate-500 font-bold max-w-sm">{t.adjustFilters}</p>
      </div>
    </div>
  );
};

export default DashboardHome;
