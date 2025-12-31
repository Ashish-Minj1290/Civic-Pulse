
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';
import { Language, translations } from '../translations';

interface ForumProps {
  user: User;
  language: Language;
}

interface PostMedia {
  type: 'image' | 'video';
  url: string;
}

interface Post {
  id: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  tag: string;
  date: string;
  likes: number;
  comments: number;
  reposts: number;
  views: number;
  isLiked?: boolean;
  media?: PostMedia[];
}

const TRENDING_TOPICS = [
  { category: 'Politics', title: 'Local Issues', posts: '2.4k' },
  { category: 'Politics', title: 'General Discussion', posts: '1.8k' },
  { category: 'Politics', title: 'Policy Debate', posts: '942' },
  { category: 'Politics', title: 'Fact Check', posts: '512' },
  { category: 'Politics', title: 'Question', posts: '320' },
];

const TODAY_NEWS = [
  { category: 'Political News', time: '2h', title: 'Parliament passes new education bill' },
  { category: 'State News', time: '4h', title: 'Chief Minister announces infrastructure projects' },
  { category: 'Policy Update', time: '6h', title: 'Opposition demands debate on healthcare reforms' },
];

const Forum: React.FC<ForumProps> = ({ user, language }) => {
  const t = translations[language];
  const [activeTab, setActiveTab] = useState<'For you' | 'Following'>('For you');
  const [newPostContent, setNewPostContent] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<PostMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load posts
  useEffect(() => {
    const initialPosts: Post[] = [
      {
        id: '1',
        authorName: 'Kuldeep Negi',
        authorHandle: '@kuldeepnegi',
        authorAvatar: 'https://i.pravatar.cc/150?u=kuldeep',
        content: 'No one concerned about environmental issues in our ward? The park maintenance is at an all-time low.',
        tag: 'Local Issues',
        date: 'Oct 1',
        likes: 24,
        comments: 12,
        reposts: 5,
        views: 459,
      },
      {
        id: '2',
        authorName: 'Kuldeep Negi',
        authorHandle: '@kuldeepnegi',
        authorAvatar: 'https://i.pravatar.cc/150?u=kuldeep',
        content: 'Great discussion on the new policy reforms today. We need more transparency in budget allocation.',
        tag: 'Policy Debate',
        date: 'Oct 3',
        likes: 56,
        comments: 8,
        reposts: 12,
        views: 989,
        media: [
          { type: 'image', url: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?q=80&w=1000&auto=format&fit=crop' }
        ]
      },
    ];

    const savedPosts = localStorage.getItem('accountable_forum_posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    } else {
      setPosts(initialPosts);
    }
  }, []);

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Fix: Explicitly type 'file' as 'File' to resolve 'unknown' type issues on lines 105/108
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const type = file.type.startsWith('video') ? 'video' : 'image';
        setSelectedMedia(prev => [...prev, { type, url }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeMedia = (index: number) => {
    setSelectedMedia(prev => prev.filter((_, i) => i !== index));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim() && selectedMedia.length === 0) return;

    setIsPosting(true);
    const newPost: Post = {
      id: Date.now().toString(),
      authorName: user.name,
      authorHandle: `@${user.name.toLowerCase().replace(/\s/g, '')}`,
      authorAvatar: user.avatar,
      content: newPostContent,
      tag: 'General Discussion',
      date: 'Just now',
      likes: 0,
      comments: 0,
      reposts: 0,
      views: 1,
      media: selectedMedia.length > 0 ? selectedMedia : undefined
    };

    const updatedPosts = [newPost, ...posts];
    setPosts(updatedPosts);
    localStorage.setItem('accountable_forum_posts', JSON.stringify(updatedPosts));
    setNewPostContent('');
    setSelectedMedia([]);
    setTimeout(() => setIsPosting(false), 500);
  };

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          likes: p.isLiked ? p.likes - 1 : p.likes + 1, 
          isLiked: !p.isLiked 
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    localStorage.setItem('accountable_forum_posts', JSON.stringify(updatedPosts));
  };

  return (
    <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-500">
      
      {/* Middle Column: Feed */}
      <div className="lg:col-span-8 border-x border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 min-h-screen">
        
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-6 py-4">
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Community Forum</h2>
          <div className="flex mt-4">
            {(['For you', 'Following'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="flex-1 py-3 text-sm font-bold relative group"
              >
                <span className={`${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                  {tab}
                </span>
                {activeTab === tab && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-indigo-600 rounded-full" />
                )}
                <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 opacity-0 group-hover:opacity-20 transition-opacity" />
              </button>
            ))}
          </div>
        </div>

        {/* Post Composer */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <form onSubmit={handleCreatePost} className="flex gap-4">
            <img src={user.avatar} className="w-12 h-12 rounded-full object-cover shrink-0" alt="me" />
            <div className="flex-1 space-y-4">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="What's happening?"
                className="w-full bg-transparent text-xl text-slate-900 dark:text-white placeholder-slate-400 border-none outline-none resize-none min-h-[80px]"
              />

              {/* Media Preview Grid */}
              {selectedMedia.length > 0 && (
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {selectedMedia.map((m, idx) => (
                    <div key={idx} className="relative aspect-video rounded-2xl overflow-hidden group">
                      {m.type === 'image' ? (
                        <img src={m.url} className="w-full h-full object-cover" alt="" />
                      ) : (
                        <video src={m.url} className="w-full h-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(idx)}
                        className="absolute top-2 right-2 p-1.5 bg-slate-900/60 text-white rounded-full hover:bg-slate-900 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-900">
                <div className="flex gap-2 text-indigo-500">
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*,video/*" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleMediaUpload} 
                  />
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  </button>
                  <button type="button" className="p-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-full transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={(!newPostContent.trim() && selectedMedia.length === 0) || isPosting}
                  className="px-6 py-2 bg-indigo-600 text-white font-black rounded-full hover:bg-indigo-700 transition disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                  {isPosting ? 'Posting...' : 'Post'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Feed List */}
        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {posts.map((post) => (
            <div key={post.id} className="p-6 hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition group">
              <div className="flex gap-4">
                <img src={post.authorAvatar} className="w-12 h-12 rounded-full object-cover shrink-0" alt="" />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 dark:text-white">{post.authorName}</span>
                      <span className="text-sm text-slate-400">{post.authorHandle} • {post.date}</span>
                    </div>
                    <button className="text-slate-400 hover:text-indigo-500 p-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                    </button>
                  </div>
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                  
                  {/* Media Content */}
                  {post.media && post.media.length > 0 && (
                    <div className={`mt-3 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 ${post.media.length === 1 ? '' : 'grid grid-cols-2 gap-1'}`}>
                      {post.media.map((m, idx) => (
                        <div key={idx} className="relative">
                          {m.type === 'image' ? (
                            <img src={m.url} className="w-full h-auto max-h-[500px] object-cover" alt="post attachment" />
                          ) : (
                            <video src={m.url} controls className="w-full h-auto max-h-[500px]" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="inline-block mt-3 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {post.tag}
                  </div>

                  {/* Interaction Bar */}
                  <div className="flex items-center justify-between pt-4 text-slate-400">
                    <button className="flex items-center gap-2 hover:text-indigo-500 transition group/icon">
                      <div className="p-2 group-hover/icon:bg-indigo-50 dark:group-hover/icon:bg-indigo-900/20 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </div>
                      <span className="text-xs">{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-emerald-500 transition group/icon">
                      <div className="p-2 group-hover/icon:bg-emerald-50 dark:group-hover/icon:bg-emerald-900/20 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                      </div>
                      <span className="text-xs">{post.reposts}</span>
                    </button>
                    <button 
                      onClick={() => handleLike(post.id)}
                      className={`flex items-center gap-2 transition group/icon ${post.isLiked ? 'text-rose-500' : 'hover:text-rose-500'}`}
                    >
                      <div className={`p-2 rounded-full ${post.isLiked ? 'bg-rose-50 dark:bg-rose-900/20' : 'group-hover/icon:bg-rose-50 dark:group-hover/icon:bg-rose-900/20'}`}>
                        <svg className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                      </div>
                      <span className="text-xs">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-blue-500 transition group/icon">
                      <div className="p-2 group-hover/icon:bg-blue-50 dark:bg-blue-900/20 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                      </div>
                      <span className="text-xs">{post.views}</span>
                    </button>
                    <button className="flex items-center gap-2 hover:text-indigo-500 transition group/icon">
                      <div className="p-2 group-hover/icon:bg-indigo-50 dark:group-hover/icon:bg-indigo-900/20 rounded-full">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column: Sidebar */}
      <div className="lg:col-span-4 space-y-6 hidden lg:block sticky top-8 h-fit pb-12">
        
        {/* Search */}
        <div className="relative group">
          <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            placeholder="Try searching for people, lists, or keywords"
            className="w-full pl-12 pr-4 py-3 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-950 rounded-full outline-none transition dark:text-white"
          />
        </div>

        {/* Premium Card */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-sm space-y-4">
          <h3 className="text-xl font-black text-slate-900 dark:text-white">Subscribe to Premium</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            Subscribe to unlock new features and if eligible, receive a share of ads revenue.
          </p>
          <button className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-full hover:opacity-90 transition">
            Subscribe
          </button>
        </div>

        {/* Trending Section */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">What's happening</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {TRENDING_TOPICS.map((topic, i) => (
              <button key={i} className="w-full p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left group">
                <div className="flex justify-between">
                  <span className="text-xs text-slate-400 font-medium">Trending in {topic.category}</span>
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-indigo-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2 s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" /></svg>
                </div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{topic.title}</div>
                <div className="text-xs text-slate-400 mt-1">{topic.posts} posts</div>
              </button>
            ))}
            <button className="w-full p-4 text-sm text-indigo-600 font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left">
              Show more
            </button>
          </div>
        </div>

        {/* Today's News */}
        <div className="bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2">
            <svg className="w-5 h-5 text-slate-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 2v4h4" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h0M7 12h8M7 16h8" /></svg>
            <h3 className="text-xl font-black text-slate-900 dark:text-white">Today's news</h3>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {TODAY_NEWS.map((news, i) => (
              <button key={i} className="w-full p-4 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left">
                <div className="text-xs text-slate-400 font-medium">{news.category} • {news.time}</div>
                <div className="font-bold text-slate-900 dark:text-white mt-1 leading-tight">{news.title}</div>
              </button>
            ))}
            <button className="w-full p-4 text-sm text-indigo-600 font-bold hover:bg-slate-100 dark:hover:bg-slate-800/50 transition text-left">
              Show more
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Help Center</a>
          <span>© 2024 accountable_INDIA</span>
        </div>

      </div>
    </div>
  );
};

export default Forum;
