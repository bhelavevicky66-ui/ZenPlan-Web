
import React, { useMemo } from 'react';
import { Task, WeeklyGoal, TabType } from '../types';

interface HomeDashboardProps {
  tasks: Task[];
  goals: WeeklyGoal[];
  onNavigate: (tab: TabType) => void;
  onAddTask: () => void;
  stats: { total: number; done: number; missed: number; completedPercent: number; remainingPercent: number };
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ tasks, goals, onNavigate, onAddTask, stats }) => {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Date Calculation Helpers
  const { todayTasks, yesterdayTasks, todayStr, yesterdayStr } = useMemo(() => {
    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

    const yesterdayDateObj = new Date(now);
    yesterdayDateObj.setDate(yesterdayDateObj.getDate() - 1);
    const yesterdayDate = new Date(yesterdayDateObj.getFullYear(), yesterdayDateObj.getMonth(), yesterdayDateObj.getDate()).getTime();

    const tTasks = tasks.filter(t => {
      const d = new Date(t.createdAt);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === todayDate;
    });

    const yTasks = tasks.filter(t => {
      const d = new Date(t.createdAt);
      return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime() === yesterdayDate;
    });

    const format = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    return {
      todayTasks: tTasks,
      yesterdayTasks: yTasks,
      todayStr: format(now),
      yesterdayStr: format(yesterdayDateObj)
    };
  }, [tasks]);

  const getDayStats = (taskList: Task[]) => {
    if (taskList.length === 0) return { done: 0, fail: 0, count: 0 };
    const weightedDone = taskList.reduce((acc, curr) => acc + (curr.progress / 100), 0);
    const donePercent = Math.round((weightedDone / taskList.length) * 100);
    return { done: donePercent, fail: 100 - donePercent, count: taskList.length };
  };

  const todayStats = getDayStats(todayTasks);
  const yesterdayStats = getDayStats(yesterdayTasks);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">{greeting}, Achiever!</h2>
            <p className="text-indigo-100 text-lg max-w-md">
              Your overall completion rate is <span className="font-bold text-white underline decoration-indigo-300">{stats.completedPercent}%</span>. Keep up the momentum!
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={onAddTask}
                className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> New Task
              </button>
            </div>
          </div>

          <div className="flex gap-4 w-full md:w-auto">
            {/* Completed Stat */}
            <div className="bg-emerald-500/20 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 flex-1 min-w-[140px]">
              <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Done</div>
              <div className="text-4xl font-black">{stats.completedPercent}%</div>
              <div className="mt-3 h-1 w-full bg-white/20 rounded-full">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats.completedPercent}%` }}></div>
              </div>
            </div>
            {/* Not Completed Stat */}
            <div className="bg-rose-500/20 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 flex-1 min-w-[140px]">
              <div className="text-rose-100 text-[10px] font-bold uppercase tracking-widest mb-1">Total Incomplete</div>
              <div className="text-4xl font-black">{stats.remainingPercent}%</div>
              <div className="mt-3 h-1 w-full bg-white/20 rounded-full">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${stats.remainingPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Comparison Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
              <i className="fa-solid fa-calendar-day text-indigo-500"></i> Daily Comparison
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Yesterday Card */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Yesterday</span>
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30 dark:text-indigo-400 px-2 py-0.5 rounded-md">{yesterdayStr}</span>
                </div>
                <h4 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6">Past Performance</h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-500">DONE</span>
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{yesterdayStats.done}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-rose-500">FAILED</span>
                      <span className="text-2xl font-black text-slate-800 dark:text-slate-100">{yesterdayStats.fail}%</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-rose-100 dark:bg-rose-900/30 rounded-full overflow-hidden flex shadow-inner">
                    <div className="h-full bg-emerald-500" style={{ width: `${yesterdayStats.done}%` }} />
                    <div className="h-full bg-rose-400 opacity-60" style={{ width: `${yesterdayStats.fail}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-50 dark:border-slate-800 text-[10px] text-slate-400 font-bold">
                {yesterdayStats.count} tasks logged yesterday
              </div>
            </div>

            {/* Today Card */}
            <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-xl hover:shadow-indigo-200/50 transition-all flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Today</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-md">{todayStr}</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-6">Current Progress</h4>

                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-400">DONE</span>
                      <span className="text-2xl font-black text-white">{todayStats.done}%</span>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-rose-400">REMAINING</span>
                      <span className="text-2xl font-black text-white">{todayStats.fail}%</span>
                    </div>
                  </div>
                  <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden flex">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${todayStats.done}%` }} />
                    <div className="h-full bg-rose-500/30" style={{ width: `${todayStats.fail}%` }} />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-white/5 text-[10px] text-slate-500 font-bold">
                {todayStats.count} active tasks today
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('board')}
            className="w-full py-4 bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-indigo-100 dark:border-indigo-800"
          >
            Manage Your Detailed Task Board <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>

        {/* Performance Visualization */}
        <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6 w-full text-left">Today's Goal Performance</h3>

          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle className="text-rose-100 dark:text-rose-900/20" strokeWidth="12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
              <circle
                className="text-emerald-500 transition-all duration-1000 ease-out"
                strokeWidth="12"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - todayStats.done / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="40"
                cx="50"
                cy="50"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{todayStats.done}%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase">DONE</span>
            </div>
          </div>

          <div className="flex gap-8 w-full justify-center">
            <div className="text-center">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-500">{todayStats.done}%</div>
              <div className="text-xs font-bold text-slate-400">COMPLETE</div>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-slate-800"></div>
            <div className="text-center">
              <div className="text-2xl font-black text-rose-500">{todayStats.fail}%</div>
              <div className="text-xs font-bold text-slate-400">INCOMPLETE</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
