
import React from 'react';
import { Task, WeeklyGoal, TabType } from '../types';

interface HomeDashboardProps {
  tasks: Task[];
  goals: WeeklyGoal[];
  onNavigate: (tab: TabType) => void;
  onAddTask: () => void;
  stats: { total: number; done: number; missed: number; completedPercent: number; remainingPercent: number };
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ tasks, goals, onNavigate, onAddTask, stats }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const goalProgress = goals.length > 0 ? Math.round((goals.filter(g => g.isDone).length / goals.length) * 100) : 0;
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">{greeting}, Achiever!</h2>
            <p className="text-indigo-100 text-lg max-w-md">
              Focus on crushing your targets. You've already reached <span className="font-bold text-white">{stats.completedPercent}%</span> of your daily goals!
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
              <div className="text-emerald-100 text-[10px] font-bold uppercase tracking-widest mb-1">Completed</div>
              <div className="text-4xl font-black">{stats.completedPercent}%</div>
              <div className="mt-3 h-1 w-full bg-white/20 rounded-full">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${stats.completedPercent}%` }}></div>
              </div>
            </div>
            {/* Not Completed Stat */}
            <div className="bg-rose-500/20 backdrop-blur-xl rounded-[2rem] p-6 border border-white/20 flex-1 min-w-[140px]">
              <div className="text-rose-100 text-[10px] font-bold uppercase tracking-widest mb-1">Not Completed</div>
              <div className="text-4xl font-black">{stats.remainingPercent}%</div>
              <div className="mt-3 h-1 w-full bg-white/20 rounded-full">
                <div className="h-full bg-rose-400 rounded-full" style={{ width: `${stats.remainingPercent}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <i className="fa-solid fa-list-check text-indigo-500"></i> Active Tasks
            </h3>
            <button onClick={() => onNavigate('board')} className="text-sm font-bold text-indigo-600 hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 4).map(task => (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${task.progress > 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                      {task.progress}%
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">{task.title}</div>
                      <div className="text-xs text-slate-500">{task.progress < 100 ? `${100 - task.progress}% remaining` : 'Finished'}</div>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${task.progress}%` }}></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-slate-400">
                <i className="fa-solid fa-champagne-glasses text-3xl mb-2 opacity-30"></i>
                <p>No active tasks at the moment!</p>
              </div>
            )}
          </div>
        </div>

        {/* Performance Visualization */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center justify-center text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-6 w-full text-left">Today's Goal Performance</h3>
            
            <div className="relative w-48 h-48 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                    {/* Background Circle */}
                    <circle className="text-rose-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    {/* Foreground Circle */}
                    <circle 
                        className="text-emerald-500 transition-all duration-1000 ease-out" 
                        strokeWidth="12" 
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - stats.completedPercent / 100)}
                        strokeLinecap="round" 
                        stroke="currentColor" 
                        fill="transparent" 
                        r="40" 
                        cx="50" 
                        cy="50" 
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-black text-slate-800">{stats.completedPercent}%</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">DONE</span>
                </div>
            </div>

            <div className="flex gap-8 w-full justify-center">
                <div className="text-center">
                    <div className="text-2xl font-black text-emerald-600">{stats.completedPercent}%</div>
                    <div className="text-xs font-bold text-slate-400">COMPLETE</div>
                </div>
                <div className="w-px h-10 bg-slate-100"></div>
                <div className="text-center">
                    <div className="text-2xl font-black text-rose-500">{stats.remainingPercent}%</div>
                    <div className="text-xs font-bold text-slate-400">INCOMPLETE</div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
