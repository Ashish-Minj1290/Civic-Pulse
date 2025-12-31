
import React, { useState, useMemo, useEffect } from 'react';
import { LiveEvent } from '../types';
import { Language, translations } from '../translations';
import { fetchLiveEventsAndProjects } from '../services/geminiService';

interface LiveEventsProps {
  language: Language;
}

const MOCK_EVENTS: LiveEvent[] = [
  {
    id: 'e1',
    title: 'Parliament Winter Session 2024',
    category: 'Parliament Session',
    description: 'Live coverage of the Winter Session discussions on education reform and infrastructure development',
    status: 'Live',
    date: 'Dec 15, 2024',
    time: '03:30 PM',
    views: 12450,
    highlights: [
      'Education Minister proposes new digital learning initiative',
      'Opposition raises concerns about rural infrastructure',
      'Budget allocation for highways discussed'
    ]
  },
  {
    id: 'e2',
    title: 'National Infrastructure Summit',
    category: 'Political Event',
    description: 'Review of major highway projects and smart city progress across the country.',
    status: 'Upcoming',
    date: 'Dec 20, 2024',
    time: '10:00 AM',
    views: 0,
    highlights: [
      'Key speakers from Ministry of Road Transport',
      'New smart city guidelines to be unveiled',
      'Interactive session with civic leaders'
    ]
  },
  {
    id: 'e3',
    title: 'Delhi-Mumbai Expressway Phase 3',
    category: 'Infrastructure',
    description: 'Development update on the massive 1,350 km expressway connecting India\'s two largest cities.',
    status: 'Ongoing',
    date: 'Ongoing',
    time: 'All Day',
    views: 8900,
    highlights: [
      'Focus on wayside amenities and charging stations',
      'Completion of tunnels in Maharashtra section',
      'Impact report on travel time reduction'
    ]
  }
];

const LiveEvents: React.FC<LiveEventsProps> = ({ language }) => {
  const t = translations[language] || translations['en'];
  const [activeTab, setActiveTab] = useState<string>('Live');
  const [events, setEvents] = useState<LiveEvent[]>(() => {
    const saved = localStorage.getItem('accountable_live_events');
    return saved ? JSON.parse(saved) : MOCK_EVENTS;
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('accountable_live_events', JSON.stringify(events));
  }, [events]);

  const handleSyncData = async () => {
    setIsSyncing(true);
    const result = await fetchLiveEventsAndProjects();
    if (result.data && result.data.length > 0) {
      setEvents(result.data);
      setSources(result.sources);
    }
    setIsSyncing(false);
  };

  const stats = useMemo(() => ({
    Live: events.filter(e => e.status === 'Live').length,
    Upcoming: events.filter(e => e.status === 'Upcoming').length,
    Ongoing: events.filter(e => e.status === 'Ongoing').length
  }), [events]);

  const filteredEvents = useMemo(() => 
    events.filter(e => e.status === activeTab),
  [activeTab, events]);

  return (
    <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in duration-700 pb-20">
      <div className="text-center space-y-3 relative">
        <div className="inline-flex items-center gap-2 px-4 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 mb-2">
           <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
           Live Project & Event Hub
        </div>
        <h1 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">{t.liveEventCoverage}</h1>
        <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Real-time status of India's governance events and major infrastructure projects</p>
        
        <button 
          onClick={handleSyncData}
          disabled={isSyncing}
          className="mt-6 px-8 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition shadow-lg shadow-indigo-500/30 flex items-center gap-3 mx-auto disabled:opacity-50"
        >
          {isSyncing ? (
             <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          )}
          {isSyncing ? 'Refreshing Live Data...' : 'Sync Live India Data'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button onClick={() => setActiveTab('Live')} className={`p-8 rounded-[2rem] text-center space-y-2 border transition-all ${activeTab === 'Live' ? 'bg-rose-50 dark:bg-rose-900/20 border-rose-200' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg'}`}>
           <div className="flex items-center justify-center gap-2 text-rose-500 mb-1">
             <div className="w-2 h-2 bg-rose-500 rounded-full animate-ping" />
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
             <span className="text-4xl font-black">{stats.Live}</span>
           </div>
           <p className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-widest">{t.liveNow}</p>
        </button>

        <button onClick={() => setActiveTab('Ongoing')} className={`p-8 rounded-[2rem] text-center space-y-2 border transition-all ${activeTab === 'Ongoing' ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg'}`}>
           <div className="flex items-center justify-center gap-2 text-indigo-500 mb-1">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
             <span className="text-4xl font-black">{stats.Ongoing}</span>
           </div>
           <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Ongoing Projects</p>
        </button>

        <button onClick={() => setActiveTab('Upcoming')} className={`p-8 rounded-[2rem] text-center space-y-2 border transition-all ${activeTab === 'Upcoming' ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-lg'}`}>
           <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             <span className="text-4xl font-black">{stats.Upcoming}</span>
           </div>
           <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">{t.upcoming}</p>
        </button>
      </div>

      {sources.length > 0 && (
        <div className="bg-slate-50 dark:bg-slate-950/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap gap-4 animate-in slide-in-from-top-2">
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest w-full mb-1">News Grounding Sources</span>
           {sources.map((source, i) => (
             <a key={i} href={source.uri} target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:shadow-md transition flex items-center gap-2">
               <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
               {source.title.length > 40 ? source.title.substring(0, 40) + '...' : source.title}
             </a>
           ))}
        </div>
      )}

      {/* Event Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredEvents.map(event => (
          <div key={event.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 transition-all hover:shadow-xl group">
            <div className="p-8 space-y-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-2">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                    event.status === 'Live' ? 'bg-rose-500 text-white' : 
                    event.status === 'Upcoming' ? 'bg-blue-500 text-white' : 
                    'bg-indigo-500 text-white'
                  }`}>
                    {event.status === 'Live' && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                    {event.status}
                  </span>
                  <span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-[9px] font-black text-slate-500 dark:text-slate-400 rounded-full uppercase tracking-wider">
                    {event.category}
                  </span>
                </div>
                {event.views > 0 && (
                  <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                    {event.views.toLocaleString()}
                  </div>
                )}
              </div>

              <div className="space-y-3">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">{event.title}</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed font-medium">{event.description}</p>
                
                <div className="flex gap-6 text-slate-400 font-black text-[10px] uppercase tracking-widest pt-2">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {event.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {event.time}
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-50 dark:border-slate-800">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.keyHighlights}:</h3>
                <div className="space-y-3">
                  {event.highlights.map((highlight, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                       <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 shrink-0" />
                       <span className="text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-8 py-4 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center group-hover:bg-indigo-600 transition-all">
               <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-indigo-100">Live Coverage Active</span>
               <svg className="w-4 h-4 text-indigo-600 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7-7 7M5 12h16" /></svg>
            </div>
          </div>
        ))}

        {filteredEvents.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-20 text-center bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
             <div className="text-8xl mb-6">📡</div>
             <h3 className="text-3xl font-black text-slate-800 dark:text-white mb-2">Searching the Feed</h3>
             <p className="text-slate-400 font-bold max-w-sm">Tap 'Sync Live India Data' to pull current events and ongoing projects across the nation using AI grounding.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveEvents;
