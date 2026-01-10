
import React from 'react';

interface HeaderProps {
  onAddTask: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddTask }) => {
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
        
        <button 
          onClick={onAddTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-full font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all active:scale-95 whitespace-nowrap"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Add Task</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
