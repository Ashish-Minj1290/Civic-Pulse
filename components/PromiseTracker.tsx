
import React, { useState, useMemo, useEffect } from 'react';
import { PoliticalPromise } from '../types';
import { Language, translations } from '../translations';
import { fetchAndVerifyPromises } from '../services/geminiService';

interface PromiseTrackerProps {
  language: Language;
}

const INITIAL_PROMISES: PoliticalPromise[] = [
  {
    id: 'p1',
    title: 'Street Vendor Welfare Scheme',
    description: 'Provide identity cards and insurance to registered street vendors',
    authority: 'Ministry of Housing and Urban Affairs',
    party: 'Trinamool Congress',
    date: '20/12/2024',
    targetDate: '31/03/2025',
    status: 'In Progress',
    category: 'Social Welfare',
    scope: 'State',
    progress: 75
  },
  {
    id: 'p2',
    title: 'Farm Loan Waiver',
    description: 'Waive all agricultural loans up to ₹2 lakhs for small farmers',
    authority: 'Ministry of Agriculture',
    party: 'Indian National Congress',
    date: '15/10/2024',
    targetDate: '31/12/2024',
    status: 'Delayed',
    category: 'Agriculture',
    scope: 'State',
    progress: 30
  }
];

const PromiseTracker: React.FC<PromiseTrackerProps> = ({ language }) => {
  const t = translations[language];
  const [promises, setPromises] = useState<PoliticalPromise[]>(() => {
    const saved = localStorage.getItem('accountable_verified_promises');
    return saved ? JSON.parse(saved) : INITIAL_PROMISES;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncSources, setLastSyncSources] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('accountable_verified_promises', JSON.stringify(promises));
  }, [promises]);

  const handleAISync = async () => {
    setIsSyncing(true);
    const result = await fetchAndVerifyPromises(searchQuery || undefined);
    if (result.promises && result.promises.length > 0) {
      // Add IDs to new promises
      const newPromises = result.promises.map((p: any) => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9)
      }));
      
      // Unique check (simple title-based)
      const existingTitles = new Set(promises.map(p => p.title.toLowerCase()));
      const uniqueNew = newPromises.filter((np: any) => !existingTitles.has(np.title.toLowerCase()));
      
      setPromises(prev => [...uniqueNew, ...prev]);
      setLastSyncSources(result.sources);
    }
    setIsSyncing(false);
  };

  const categories = useMemo(() => {
    const cats = new Set(promises.map(p => p.category));
    return ['All Categories', ...Array.from(cats)];
  }, [promises]);

  const filteredPromises = useMemo(() => {
    return promises.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           p.authority.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All Status' || p.status === statusFilter;
      const matchesCategory = categoryFilter === 'All Categories' || p.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter, promises]);

  const stats = useMemo(() => ({
    total: filteredPromises.length,
    completed: filteredPromises.filter(p => p.status === 'Completed' || p.status === 'Resolved').length,
    inProgress: filteredPromises.filter(p => p.status === 'In Progress' || p.status === 'Processing' || p.status === 'Active').length,
    delayed: filteredPromises.filter(p => p.status === 'Delayed').length
  }), [filteredPromises]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 mb-2">
           <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
           AI Verified Real-time Data
        </div>
        <h1 className="text-5xl font-black text-slate-800 dark:text-white tracking-tight">{t.promiseTracker}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">{t.promiseTrackerSubtitle}</p>
      </div>

      {/* Sync Action Area */}
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="flex-1 w-full relative">
          <svg className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input 
            type="text" 
            placeholder="Search promises or keywords (e.g., 'Modi Infrastructure' or 'Congress Health')..." 
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition font-medium dark:text-white"
          />
        </div>
        <button 
          onClick={handleAISync}
          disabled={isSyncing}
          className="w-full md:w-auto px-10 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/30 hover:bg-indigo-700 transition flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
        >
          {isSyncing ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          )}
          {isSyncing ? 'Verifying with AI...' : 'Refresh & Discover'}
        </button>
      </div>

      {/* Citations if available */}
      {lastSyncSources.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 animate-in slide-in-from-top-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full mb-1">Latest Fact-Check Sources</span>
           {lastSyncSources.slice(0, 5).map((source, i) => (
             <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:shadow-md transition flex items-center gap-2">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               {source.title.length > 30 ? source.title.substring(0, 30) + '...' : source.title}
             </a>
           ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.total}</p>
             <h3 className="text-4xl font-black text-slate-900 dark:text-white">{stats.total}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/10 flex items-center justify-center text-blue-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.completed}</p>
             <h3 className="text-4xl font-black text-emerald-600 dark:text-emerald-400">{stats.completed}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-center text-emerald-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.inProgress}</p>
             <h3 className="text-4xl font-black text-indigo-600 dark:text-indigo-400">{stats.inProgress}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-900/10 flex items-center justify-center text-indigo-500">
             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between">
           <div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{t.delayed}</p>
             <h3 className="text-4xl font-black text-orange-600 dark:text-orange-400">{stats.delayed}</h3>
           </div>
           <div className="w-14 h-14 rounded-2xl bg-orange-50 dark:bg-orange-900/10 flex items-center justify-center text-orange-500 text-2xl font-black">
             ×
           </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-6 relative">
          <select 
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none font-bold appearance-none dark:text-white text-sm"
          >
            <option>{t.allStatus}</option>
            <option value="Completed">Verified Completed</option>
            <option value="In Progress">Actively Processing</option>
            <option value="Delayed">Stalled / Delayed</option>
          </select>
        </div>
        <div className="md:col-span-6">
          <select 
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-xl outline-none font-bold appearance-none dark:text-white text-sm"
          >
            {categories.map(c => <option key={c} value={c}>{c === 'All Categories' ? t.allCategories : c}</option>)}
          </select>
        </div>
      </div>

      {/* Promise Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPromises.map(promise => (
          <div key={promise.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden p-8 space-y-6 transition-all hover:shadow-2xl hover:-translate-y-1 group border-l-[6px] border-l-transparent hover:border-l-indigo-500">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                   <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-[9px] font-black text-indigo-600 dark:text-indigo-400 rounded-lg uppercase tracking-wider">{promise.category}</span>
                   <span className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-[9px] font-black text-slate-500 dark:text-slate-400 rounded-lg uppercase tracking-wider">{promise.scope}</span>
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white leading-tight">{promise.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium text-sm leading-relaxed line-clamp-2">{promise.description}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl space-y-2">
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Authority</span>
                  <span className="text-slate-900 dark:text-white font-black">{promise.authority}</span>
               </div>
               <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400 font-bold uppercase tracking-widest">Party</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-black">{promise.party}</span>
               </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-end text-[10px] font-black uppercase tracking-widest">
                <span className="text-slate-400">Implementation Progress</span>
                <span className={`${promise.progress === 100 ? 'text-emerald-500' : 'text-indigo-600 dark:text-indigo-400'}`}>{promise.progress}%</span>
              </div>
              <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shadow-inner">
                <div 
                  className={`h-full transition-all duration-1000 ease-out ${
                    promise.status === 'Completed' || promise.progress === 100 ? 'bg-emerald-500' :
                    promise.status === 'Delayed' ? 'bg-orange-500' : 'bg-indigo-600'
                  }`} 
                  style={{ width: `${promise.progress}%` }} 
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-800">
               <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    promise.status === 'Completed' ? 'bg-emerald-500' :
                    promise.status === 'Delayed' ? 'bg-orange-500' : 'bg-indigo-500'
                  }`} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{promise.status}</span>
               </div>
               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Target: <span className="text-slate-900 dark:text-slate-200">{promise.targetDate}</span>
               </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPromises.length === 0 && (
        <div className="flex flex-col items-center justify-center p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
           <div className="text-8xl mb-6">🛰️</div>
           <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">No verified promises found</h3>
           <p className="text-slate-400 font-bold max-w-sm">Tap 'Refresh & Discover' to search live government records for recent commitments.</p>
        </div>
      )}
    </div>
  );
};

export default PromiseTracker;
