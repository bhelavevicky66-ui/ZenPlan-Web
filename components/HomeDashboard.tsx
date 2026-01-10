
import React from 'react';
import { Task, WeeklyGoal, TabType } from '../types';

interface HomeDashboardProps {
  tasks: Task[];
  goals: WeeklyGoal[];
  onNavigate: (tab: TabType) => void;
  onAddTask: () => void;
  stats: { total: number; done: number; missed: number };
}

const HomeDashboard: React.FC<HomeDashboardProps> = ({ tasks, goals, onNavigate, onAddTask, stats }) => {
  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const goalProgress = goals.length > 0 ? Math.round((goals.filter(g => g.isDone).length / goals.length) * 100) : 0;
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  // Overall weighted task completion percentage
  const taskProgressPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-violet-600 to-purple-700 rounded-[2.5rem] p-8 md:p-12 text-white shadow-2xl">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-5xl font-extrabold mb-3 tracking-tight">{greeting}, Achiever!</h2>
            <p className="text-indigo-100 text-lg max-w-md">
              You've completed <span className="font-bold text-white underline decoration-indigo-300">{taskProgressPercent}% of your workload</span> today. Keep pushing!
            </p>
            <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
              <button 
                onClick={onAddTask}
                className="bg-white text-indigo-600 px-8 py-3.5 rounded-2xl font-bold shadow-xl shadow-indigo-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <i className="fa-solid fa-plus"></i> New Task
              </button>
              <button 
                onClick={() => onNavigate('board')}
                className="bg-indigo-500/30 backdrop-blur-md border border-white/20 text-white px-8 py-3.5 rounded-2xl font-bold transition-all hover:bg-indigo-500/40 flex items-center gap-2"
              >
                View Board <i className="fa-solid fa-arrow-right text-xs"></i>
              </button>
            </div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-[2rem] p-8 border border-white/20 w-full md:w-auto text-center md:text-left min-w-[240px]">
            <div className="text-indigo-200 text-sm font-bold uppercase tracking-widest mb-2">Overall Mastery</div>
            <div className="text-6xl font-black mb-4">{taskProgressPercent}%</div>
            <div className="h-2 w-full bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${taskProgressPercent}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Tasks */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <i className="fa-solid fa-list-check text-indigo-500"></i> Up Next
            </h3>
            <button onClick={() => onNavigate('board')} className="text-sm font-bold text-indigo-600 hover:underline">See All</button>
          </div>
          <div className="space-y-4">
            {pendingTasks.length > 0 ? (
              pendingTasks.slice(0, 4).map(task => (
                <div key={task.id} className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-xs">
                      {task.progress}%
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">{task.title}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{task.description || 'No details'}</div>
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
                <p>All caught up!</p>
              </div>
            )}
          </div>
        </div>

        {/* Weekly Progress Summary */}
        <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
              <i className="fa-solid fa-bullseye text-emerald-500"></i> Weekly Mission
            </h3>
            <button onClick={() => onNavigate('goals')} className="text-sm font-bold text-emerald-600 hover:underline">Focus Goals</button>
          </div>
          <div className="space-y-4 text-center py-4">
             <div className="text-4xl font-bold text-slate-800 mb-2">{goalProgress}%</div>
             <p className="text-slate-500 text-sm mb-6">of your big weekly goals are finished.</p>
             <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden p-1">
                <div className="h-full bg-emerald-500 rounded-full transition-all duration-1000" style={{ width: `${goalProgress}%` }}></div>
             </div>
          </div>
          <div className="mt-6 space-y-3">
            {goals.slice(0, 3).map(goal => (
              <div key={goal.id} className="flex items-center gap-3 text-sm">
                <i className={`fa-solid ${goal.isDone ? 'fa-check-circle text-emerald-500' : 'fa-circle text-slate-200'}`}></i>
                <span className={goal.isDone ? 'line-through text-slate-400' : 'text-slate-600'}>{goal.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeDashboard;
