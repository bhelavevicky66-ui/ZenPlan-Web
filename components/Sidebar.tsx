
import React from 'react';
import { TabType } from '../types';

interface SidebarProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  stats: { total: number; done: number; missed: number; completedPercent: number; remainingPercent: number };
  onAddTask: () => void;
  streak: number;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, stats, onAddTask, streak }) => {
  return (
    <aside className="hidden md:flex flex-col w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-screen sticky top-0 shadow-sm z-40 transition-colors duration-300">
      <div className="p-6 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
            <i className="fa-solid fa-bolt text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ZenPlan</h1>
        </div>
      </div>

      <div className="px-4 py-6">
        <button
          onClick={onAddTask}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 transition-all active:scale-[0.98] mb-8"
        >
          <i className="fa-solid fa-circle-plus"></i>
          <span>Add New Task</span>
        </button>

        <nav className="space-y-1.5">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-4 mb-3">Main Experience</div>

          <button
            onClick={() => setActiveTab('home')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'home' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <i className="fa-solid fa-house"></i>
            <span className="font-semibold">Home Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('board')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'board' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <i className="fa-solid fa-layer-group"></i>
            <span className="font-semibold">Task Board</span>
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === 'goals' ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 shadow-sm' : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400'}`}
          >
            <i className="fa-solid fa-calendar-check"></i>
            <span className="font-semibold">Weekly Goals</span>
          </button>
        </nav>
      </div>

      <div className="p-4 mt-auto border-t border-slate-100 dark:border-slate-800">
        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-4 mb-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Daily Streak</h3>
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${streak > 0 ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-700 dark:text-slate-400'}`}>
              <i className={`fa-solid fa-fire ${streak > 0 ? 'animate-pulse' : ''}`}></i>
              <span className="text-sm font-black">{streak}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Board Performance</h3>
          <div className="space-y-3">
            <StatRow label="Complete" val={stats.completedPercent} color="emerald" />
            <StatRow label="Incomplete" val={stats.remainingPercent} color="rose" />
          </div>
        </div>
      </div>
    </aside>
  );
};

const StatRow = ({ label, val, color }: { label: string; val: number; color: string }) => {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs font-medium">
        <span className="text-slate-500 dark:text-slate-400">{label}</span>
        <span className={`text-${color}-600 dark:text-${color}-400`}>{val}%</span>
      </div>
      <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full bg-${color}-500 rounded-full transition-all duration-500`}
          style={{ width: `${val}%` }}
        />
      </div>
    </div>
  );
};

export default Sidebar;
