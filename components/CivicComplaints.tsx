
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { CivicComplaint, ComplaintStatus, PriorityLevel } from '../types';
import { Language, translations } from '../translations';

interface CivicComplaintsProps {
  language: Language;
}

const CATEGORIES = [
  'Roads', 
  'Electricity', 
  'Water', 
  'Sanitation', 
  'Safety', 
  'Public Transport', 
  'Health',
  'Waste Management',
  'Street Lighting',
  'Noise Pollution',
  'Traffic & Parking',
  'Illegal Encroachment',
  'Animal Welfare',
  'Parks & Playgrounds'
];

const PRIORITIES: PriorityLevel[] = ['Low', 'Medium', 'High'];
const STATUSES: ComplaintStatus[] = ['Active', 'Processing', 'Resolved', 'In Progress'];

const CivicComplaints: React.FC<CivicComplaintsProps> = ({ language }) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [complaints, setComplaints] = useState<CivicComplaint[]>(() => {
    const saved = localStorage.getItem('nexus_complaints_v3');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState<Partial<CivicComplaint>>({
    title: '',
    category: CATEGORIES[0],
    description: '',
    location: '',
    constituency: '',
    state: '',
    priority: 'Medium',
    photo: ''
  });

  const [isLocating, setIsLocating] = useState(false);
  const [filters, setFilters] = useState({
    category: 'All Categories',
    status: 'All Status'
  });

  useEffect(() => {
    localStorage.setItem('nexus_complaints_v3', JSON.stringify(complaints));
  }, [complaints]);

  const filteredComplaints = useMemo(() => {
    return complaints.filter(c => {
      const matchCat = filters.category === 'All Categories' || c.category === filters.category;
      const matchStatus = filters.status === 'All Status' || c.status === filters.status;
      return matchCat && matchStatus;
    });
  }, [complaints, filters]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData(prev => ({ 
          ...prev, 
          location: `${latitude.toFixed(6)}, ${longitude.toFixed(6)} (GPS Coords)` 
        }));
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Unable to retrieve your location. Please type it manually.");
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const newComplaint: CivicComplaint = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title || '',
      category: formData.category || CATEGORIES[0],
      description: formData.description || '',
      location: formData.location || '',
      constituency: formData.constituency || '',
      state: formData.state || '',
      priority: formData.priority || 'Medium',
      photo: formData.photo,
      date: new Date().toLocaleDateString(),
      status: 'Active'
    };

    setComplaints([newComplaint, ...complaints]);
    setFormData({
      title: '',
      category: CATEGORIES[0],
      description: '',
      location: '',
      constituency: '',
      state: '',
      priority: 'Medium',
      photo: ''
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in duration-500 pb-20">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-black text-[#1e293b] dark:text-white tracking-tight leading-tight">
          {t.reportTitle}
        </h1>
        <p className="text-[#64748b] dark:text-slate-400 font-medium text-lg">
          {t.reportSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-2">
               <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               <h2 className="font-bold text-[#1e293b] dark:text-white">{t.reportAnIssue}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Title</label>
                <input 
                  required
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition"
                  placeholder={t.briefDescription}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Category</label>
                <select 
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white appearance-none cursor-pointer"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Description</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white resize-none transition"
                  placeholder={t.provideDetails}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Location</label>
                  <button 
                    type="button"
                    onClick={handleGetLocation}
                    className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest flex items-center gap-1 hover:text-blue-700 transition"
                  >
                    {isLocating ? (
                      <span className="animate-pulse">Fetching...</span>
                    ) : (
                      <>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        Get GPS Location
                      </>
                    )}
                  </button>
                </div>
                <input 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition"
                  placeholder={t.streetAreaLandmark}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Constituency</label>
                  <input 
                    value={formData.constituency}
                    onChange={e => setFormData({...formData, constituency: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition"
                    placeholder={t.yourConstituency}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[#475569] dark:text-slate-400">State</label>
                  <input 
                    value={formData.state}
                    onChange={e => setFormData({...formData, state: e.target.value})}
                    className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white transition"
                    placeholder={t.yourState}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569] dark:text-slate-400">Priority</label>
                <select 
                  value={formData.priority}
                  onChange={e => setFormData({...formData, priority: e.target.value as PriorityLevel})}
                  className="w-full px-3 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 outline-none dark:text-white appearance-none cursor-pointer"
                >
                  {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#475569] dark:text-slate-400">{t.photoOptional}</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handlePhotoUpload}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 transition relative overflow-hidden"
                >
                  {formData.photo ? (
                    <div className="w-full h-32 relative">
                      <img src={formData.photo} className="w-full h-full object-cover rounded-lg" alt="Preview" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition">
                        <span className="text-white text-[10px] font-black uppercase">Change Photo</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      <span className="text-xs font-bold text-slate-500">{t.clickToUpload}</span>
                    </>
                  )}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-[#2563eb] text-white font-bold rounded-lg hover:bg-blue-700 transition active:scale-[0.98] shadow-md shadow-blue-500/20"
              >
                {t.reportIssueBtn}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Feed & Filters */}
        <div className="lg:col-span-8 space-y-6">
          {/* List Filters */}
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4">
             <div className="flex-1">
               <select 
                 value={filters.category}
                 onChange={e => setFilters({...filters, category: e.target.value})}
                 className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-[#475569] dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
               >
                 <option>All Categories</option>
                 {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
             </div>
             <div className="flex-1">
               <select 
                 value={filters.status}
                 onChange={e => setFilters({...filters, status: e.target.value})}
                 className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-lg text-xs font-bold text-[#475569] dark:text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none cursor-pointer"
               >
                 <option>All Status</option>
                 {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
          </div>

          {/* Complaints Feed */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm min-h-[500px]">
            {filteredComplaints.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-20 text-center animate-in fade-in duration-500">
                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border-2 border-slate-100 dark:border-slate-700">
                  <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                </div>
                <h3 className="text-xl font-bold text-[#1e293b] dark:text-white mb-2">{t.noIssuesFound}</h3>
                <p className="text-slate-400 dark:text-slate-500 font-medium text-sm max-w-xs">{t.beFirstToReport}</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50 dark:divide-slate-800">
                {filteredComplaints.map(complaint => (
                  <div key={complaint.id} className="p-8 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition group animate-in slide-in-from-right-2 duration-300">
                    <div className="flex justify-between items-start mb-3">
                       <div className="space-y-1">
                          <h4 className="text-xl font-black text-[#1e293b] dark:text-white group-hover:text-blue-600 transition-colors">{complaint.title}</h4>
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-3 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-[9px] font-black text-blue-600 dark:text-blue-400 rounded-md uppercase tracking-wider">{complaint.category}</span>
                            <span className={`px-3 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${
                              complaint.priority === 'High' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' :
                              complaint.priority === 'Medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' :
                              'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                            }`}>Priority: {complaint.priority}</span>
                          </div>
                       </div>
                       <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                         complaint.status === 'Resolved' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                       }`}>
                         {complaint.status}
                       </span>
                    </div>

                    <p className="text-[#64748b] dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 font-medium">
                      {complaint.description}
                    </p>

                    {complaint.photo && (
                      <div className="mb-6 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 max-w-sm">
                        <img src={complaint.photo} alt="Report attachment" className="w-full h-auto object-cover" />
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50 dark:border-slate-800">
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                          <p className="text-xs font-bold text-[#1e293b] dark:text-slate-200 truncate">{complaint.location}</p>
                       </div>
                       <div className="space-y-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Constituency</span>
                          <p className="text-xs font-bold text-[#1e293b] dark:text-slate-200 truncate">{complaint.constituency}, {complaint.state}</p>
                       </div>
                       <div className="space-y-1 hidden md:block text-right">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Reported On</span>
                          <p className="text-xs font-bold text-[#1e293b] dark:text-slate-200">{complaint.date}</p>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CivicComplaints;
