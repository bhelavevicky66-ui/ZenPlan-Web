
import React, { useState } from 'react';

interface User {
  name: string;
  email: string;
  avatar: string;
}

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-4 md:px-8 py-4 flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Workspace</h2>
        <p className="text-slate-500 text-sm hidden sm:block">Focus on what's important today</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search tasks..."
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 transition-all w-64"
          />
          <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
        </div>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 p-1 pr-4 rounded-full transition-all border border-slate-200 group"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-9 h-9 rounded-full border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors"
              />
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-slate-800 leading-none mb-0.5">{user.name}</p>
                <p className="text-[10px] text-slate-400 font-bold leading-none uppercase tracking-tighter">Premium Member</p>
              </div>
              <i className={`fa-solid fa-chevron-down text-[10px] text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`}></i>
            </button>

            {showDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowDropdown(false)}></div>
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Account</p>
                  </div>
                  <button className="w-full text-left px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 flex items-center gap-3">
                    <i className="fa-solid fa-user-gear text-indigo-500"></i> Settings
                  </button>
                  <button
                    onClick={() => {
                      onLogout();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-3"
                  >
                    <i className="fa-solid fa-right-from-bracket"></i> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onLogin}
            className="group relative inline-flex items-center gap-3 bg-white text-slate-700 border-2 border-slate-100 px-6 py-2.5 rounded-full font-black text-sm shadow-sm transition-all hover:border-indigo-500 active:scale-95 overflow-hidden"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-4 h-4"
            />
            <span>Sign up</span>
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
