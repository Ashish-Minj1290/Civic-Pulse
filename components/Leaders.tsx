
import React, { useState, useMemo, useEffect } from 'react';
import { PoliticalLeader } from '../types';
import { Language, translations } from '../translations';
import LeaderProfile from './LeaderProfile';
import { discoverLeaderProfile } from '../services/geminiService';

export const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

export const INDIAN_PARTIES = [
  "Bharatiya Janata Party (BJP)", "Indian National Congress (INC)", "Aam Aadmi Party (AAP)", "All India Trinamool Congress (TMC)", "Bahujan Samaj Party (BSP)", "Communist Party of India (Marxist)", "Communist Party of India", "National People's Party", "Samajwadi Party", "Dravida Munnetra Kazhagam (DMK)", "All India Anna Dravida Munnetra Kazhagam (AIADMK)", "Shiv Sena", "Nationalist Congress Party (NCP)", "Rashtriya Janata Dal (RJD)", "Janata Dal (United)", "Telugu Desam Party (TDP)", "Yuvajana Sramika Rythu Congress Party (YSRCP)", "Bharat Rashtra Samithi (BRS)", "Biju Janata Dal (BJD)", "Shiromani Akali Dal", "Jharkhand Mukti Morcha (JMM)", "All India United Democratic Front", "Mizo National Front", "Nationalist Democratic Progressive Party", "Sikkim Krantikari Morcha", "Asom Gana Parishad"
];

const INITIAL_MOCK_LEADERS: PoliticalLeader[] = [
  { id: '1', name: 'Narendra Modi', role: 'MP', party: 'Bharatiya Janata Party (BJP)', constituency: 'Varanasi', state: 'Uttar Pradesh', rating: 4.8, ratingCount: 12450, attendance: 100, bills: 0, debates: 15, questions: 0, sinceYear: 2014, isFollowed: true },
  { id: '2', name: 'Rahul Gandhi', role: 'MP', party: 'Indian National Congress (INC)', constituency: 'Rae Bareli', state: 'Uttar Pradesh', rating: 4.2, ratingCount: 8900, attendance: 55, bills: 1, debates: 12, questions: 25, sinceYear: 2004 },
  { id: '3', name: 'Mamata Banerjee', role: 'MLA', party: 'All India Trinamool Congress (TMC)', constituency: 'Bhabanipur', state: 'West Bengal', rating: 4.3, ratingCount: 7600, attendance: 95, bills: 12, debates: 45, questions: 0, sinceYear: 2011 },
  { id: '4', name: 'Arvind Kejriwal', role: 'MLA', party: 'Aam Aadmi Party (AAP)', constituency: 'New Delhi', state: 'Delhi', rating: 4.1, ratingCount: 6500, attendance: 92, bills: 8, debates: 30, questions: 0, sinceYear: 2013 },
  { id: '5', name: 'Priya Sharma', role: 'MP', party: 'Bharatiya Janata Party (BJP)', constituency: 'Delhi East', state: 'Delhi', rating: 4.5, ratingCount: 412, attendance: 92, bills: 12, debates: 34, questions: 89, sinceYear: 2019 },
  { id: '6', name: 'Vikram Singh', role: 'MLA', party: 'Bharatiya Janata Party (BJP)', constituency: 'Jaipur Central', state: 'Rajasthan', rating: 4.3, ratingCount: 189, attendance: 89, bills: 4, debates: 28, questions: 72, sinceYear: 2021 },
];

interface LeadersProps {
  language: Language;
}

const Leaders: React.FC<LeadersProps> = ({ language }) => {
  const t = translations[language];
  const [leaders, setLeaders] = useState<PoliticalLeader[]>(() => {
    const saved = localStorage.getItem('accountable_leaders');
    return saved ? JSON.parse(saved) : INITIAL_MOCK_LEADERS;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [partyFilter, setPartyFilter] = useState('All Parties');
  const [stateFilter, setStateFilter] = useState('All States');
  const [sortOption, setSortOption] = useState('Highest Rated');
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [isDiscovering, setIsDiscovering] = useState(false);

  useEffect(() => {
    localStorage.setItem('accountable_leaders', JSON.stringify(leaders));
  }, [leaders]);

  const parties = useMemo(() => ['All Parties', ...INDIAN_PARTIES], []);
  const states = useMemo(() => ['All States', ...INDIAN_STATES], []);

  const filteredLeaders = useMemo(() => {
    let result = leaders.filter(l => {
      const matchesSearch = l.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           l.constituency.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesParty = partyFilter === 'All Parties' || l.party === partyFilter;
      const matchesState = stateFilter === 'All States' || l.state === stateFilter;
      return matchesSearch && matchesParty && matchesState;
    });

    if (sortOption === 'Highest Rated') {
      result = result.sort((a, b) => b.rating - a.rating);
    } else if (sortOption === 'Lowest Rated') {
      result = result.sort((a, b) => a.rating - b.rating);
    }

    return result;
  }, [searchQuery, partyFilter, stateFilter, sortOption, leaders]);

  const handleDiscover = async () => {
    if (!searchQuery.trim()) return;
    setIsDiscovering(true);
    const profile = await discoverLeaderProfile(searchQuery);
    if (profile) {
      const newLeader: PoliticalLeader = {
        id: Math.random().toString(36).substr(2, 9),
        ...profile,
        rating: 3.0,
        ratingCount: 0,
        isFollowed: false
      };
      setLeaders(prev => [newLeader, ...prev]);
    }
    setIsDiscovering(false);
  };

  const selectedLeader = useMemo(() => 
    leaders.find(l => l.id === selectedLeaderId), 
  [selectedLeaderId, leaders]);

  const resetFilters = () => {
    setSearchQuery('');
    setPartyFilter('All Parties');
    setStateFilter('All States');
    setSortOption('Highest Rated');
  };

  if (selectedLeaderId && selectedLeader) {
    return <LeaderProfile 
      leader={selectedLeader} 
      onBack={() => setSelectedLeaderId(null)} 
      language={language}
      onUpdateRating={(id, newRating) => {
        setLeaders(prev => prev.map(l => {
          if (l.id === id) {
            const newCount = l.ratingCount + 1;
            const avgRating = ((l.rating * l.ratingCount) + newRating) / newCount;
            return { ...l, rating: Number(avgRating.toFixed(1)), ratingCount: newCount };
          }
          return l;
        }));
      }}
      onToggleFollow={(id) => {
        setLeaders(prev => prev.map(l => l.id === id ? { ...l, isFollowed: !l.isFollowed } : l));
      }}
    />;
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
          {t.leadersDirectory}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">
          {t.leadersSubtitle}
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
        <div className="relative">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder={t.searchLeaders} 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition text-sm dark:text-white"
          />
        </div>

        <select 
          value={partyFilter}
          onChange={(e) => setPartyFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white font-medium appearance-none"
        >
          {parties.map(p => <option key={p} value={p}>{p === 'All Parties' ? t.allParties : p}</option>)}
        </select>

        <select 
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white font-medium appearance-none"
        >
          {states.map(s => <option key={s} value={s}>{s === 'All States' ? t.allStates : s}</option>)}
        </select>

        <select 
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm dark:text-white font-medium appearance-none"
        >
          <option value="Highest Rated">{t.highestRated}</option>
          <option value="Lowest Rated">{t.lowestRated}</option>
        </select>
      </div>

      {/* Discovery Button for missing leaders */}
      {searchQuery && filteredLeaders.length === 0 && (
        <div className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-[2rem] border border-indigo-100 dark:border-indigo-900/30 text-center space-y-4 animate-in zoom-in duration-300">
           <h3 className="text-xl font-black text-indigo-900 dark:text-indigo-300">Can't find {searchQuery}?</h3>
           <p className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">Use our AI engine to discover and verify this leader's profile from live government records.</p>
           <button 
             onClick={handleDiscover}
             disabled={isDiscovering}
             className="px-10 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 disabled:opacity-50 flex items-center gap-3 mx-auto"
           >
             {isDiscovering ? (
               <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
             ) : '⚡ Discover with Google Search'}
           </button>
        </div>
      )}

      <div className="flex justify-between items-center">
        <p className="text-sm font-bold text-slate-500">
          {t.showing} <span className="text-slate-900 dark:text-white">{filteredLeaders.length}</span> {t.leaders.toLowerCase()}
        </p>
        <button 
          onClick={resetFilters}
          className="px-4 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition"
        >
          {t.resetFilters}
        </button>
      </div>

      {/* Results Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredLeaders.map(leader => (
          <div 
            key={leader.id} 
            onClick={() => setSelectedLeaderId(leader.id)}
            className="bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col group cursor-pointer"
          >
            <div className="p-6 space-y-4 flex-1">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    {leader.name}
                    {leader.isFollowed && (
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" title="Following" />
                    )}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-[10px] font-black text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">{leader.role}</span>
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-black text-slate-500 dark:text-slate-400 rounded-md uppercase tracking-wider">{leader.party}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-1 text-amber-500">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{leader.rating}</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400">{leader.ratingCount} {t.ratings}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                {leader.constituency}, {leader.state}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-blue-50 dark:bg-blue-900/10 p-4 rounded-2xl border border-blue-100 dark:border-blue-900/20">
                  <div className="text-xl font-black text-blue-600 dark:text-blue-400">{leader.attendance}%</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.attendance}</div>
                </div>
                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/20">
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">{leader.bills}</div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{t.billsIntroduced}</div>
                </div>
              </div>
            </div>

            <div className="w-full py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between px-6 bg-slate-50/30 dark:bg-slate-800/30">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Click to view full profile</span>
              <svg className="w-4 h-4 text-indigo-600 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 12h16" /></svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaders;
