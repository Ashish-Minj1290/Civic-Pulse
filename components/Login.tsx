
import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Simulated Database Structure in LocalStorage
const DB_KEY = 'nexus_users_database';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Initialize "Database" if it doesn't exist
  useEffect(() => {
    if (!localStorage.getItem(DB_KEY)) {
      localStorage.setItem(DB_KEY, JSON.stringify([]));
    }
  }, []);

  const getUsers = (): any[] => {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
  };

  const saveUserToDb = (user: any) => {
    const users = getUsers();
    const existingIndex = users.findIndex((u: any) => u.email === user.email);
    if (existingIndex > -1) {
      users[existingIndex] = { ...users[existingIndex], ...user };
    } else {
      users.push(user);
    }
    localStorage.setItem(DB_KEY, JSON.stringify(users));
  };

  const handleEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Simulate Network Latency
    setTimeout(() => {
      const users = getUsers();
      
      if (isRegistering) {
        // Sign Up Logic
        const existingUser = users.find((u: any) => u.email === email);
        if (existingUser) {
          setError('An account with this email already exists.');
          setIsLoading(false);
          return;
        }

        const newUser: User = {
          id: Math.random().toString(36).substr(2, 9),
          name: userName || 'New Citizen',
          email: email,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userName || email}`,
          role: 'Citizen',
          credits: 1000, // Initial points for signing up
          impactScore: { daily: 0, weekly: 0 }
        };

        // Store with simulated password
        saveUserToDb({ ...newUser, password });
        onLogin(newUser);
      } else {
        // Login Logic
        const user = users.find((u: any) => u.email === email && u.password === password);
        if (!user) {
          setError('Invalid email or password.');
          setIsLoading(false);
          return;
        }

        // Remove password before passing to app state
        const { password: _, ...userSafe } = user;
        onLogin(userSafe);
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    setSocialLoading(provider);
    setError(null);
    
    // Simulate OAuth Popup window behavior
    setTimeout(() => {
      const users = getUsers();
      const socialEmail = `user.${provider.toLowerCase()}@example.com`;
      
      let user = users.find((u: any) => u.email === socialEmail);
      
      if (!user) {
        user = {
          id: Math.random().toString(36).substr(2, 9),
          name: `${provider} User`,
          email: socialEmail,
          avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${provider}`,
          role: 'Verified Member',
          credits: 1250,
          impactScore: { daily: 5, weekly: 35 },
          provider: provider // Keep track of auth provider
        };
        saveUserToDb(user);
      }

      onLogin(user);
      setSocialLoading(null);
    }, 2000);
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    setError(null);
    setEmail('');
    setPassword('');
    setUserName('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-slate-950 p-6 selection:bg-indigo-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[5%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[120px]"></div>
      </div>

      <div className="w-full max-w-[440px] z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-indigo-500/10 border border-slate-100 dark:border-slate-800 p-10 space-y-8 animate-in fade-in zoom-in duration-500">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-500/20 mb-2 transform hover:rotate-6 transition-transform cursor-pointer">
              <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Flag_of_India.svg" className="w-12 h-8 object-cover rounded shadow-sm" alt="India" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {isRegistering ? 'Join Accountable India' : 'Welcome Back'}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm px-6">
              {isRegistering ? 'Start tracking political accountability today.' : 'Sign in to monitor live governance data.'}
            </p>
          </div>

          {error && (
            <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 p-4 rounded-2xl flex items-center gap-3 animate-in slide-in-from-top-2">
              <div className="w-8 h-8 rounded-full bg-rose-500 flex items-center justify-center text-white shrink-0">!</div>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">{error}</p>
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-4">
            {isRegistering && (
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none font-medium dark:text-white"
                  placeholder="Rahul Kumar"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
            )}
            
            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none font-medium dark:text-white"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500 transition outline-none font-medium pr-12 dark:text-white"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition p-1"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" /></svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !!socialLoading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-2xl shadow-xl shadow-indigo-500/30 transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (isRegistering ? 'Create Account' : 'Sign In')}
            </button>
          </form>

          <div className="relative py-4 flex items-center gap-4">
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800"></div>
            <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Or Continue with</span>
            <div className="flex-1 border-t border-slate-100 dark:border-slate-800"></div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'Google', icon: 'https://www.svgrepo.com/show/475656/google-color.svg' },
              { id: 'Facebook', color: 'bg-[#1877F2]', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
              { id: 'Instagram', color: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888]', icon: <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg> },
              { id: 'X', color: 'bg-black', icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                disabled={!!socialLoading || isLoading}
                onClick={() => handleSocialLogin(p.id)}
                className={`h-14 rounded-2xl flex items-center justify-center transition hover:opacity-90 active:scale-95 border border-slate-100 dark:border-slate-800 ${p.color || 'bg-white dark:bg-slate-800'} ${socialLoading === p.id ? 'animate-pulse' : ''}`}
              >
                {socialLoading === p.id ? (
                  <div className={`w-5 h-5 border-2 ${p.color ? 'border-white/30 border-t-white' : 'border-indigo-500 border-t-transparent'} rounded-full animate-spin`}></div>
                ) : (
                  typeof p.icon === 'string' ? <img src={p.icon} className="w-6 h-6" alt={p.id} /> : <span className="text-white">{p.icon}</span>
                )}
              </button>
            ))}
          </div>

          <p className="text-center text-sm font-bold text-slate-400">
            {isRegistering ? 'Existing member?' : "Not a member yet?"} 
            <button 
              type="button"
              onClick={toggleMode}
              className="ml-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition underline decoration-indigo-200 underline-offset-4"
            >
              {isRegistering ? 'Sign In Here' : 'Join Accountability'}
            </button>
          </p>
        </div>
        
        <div className="mt-8 text-center px-10">
          <p className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy. All political data is verified in real-time.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
