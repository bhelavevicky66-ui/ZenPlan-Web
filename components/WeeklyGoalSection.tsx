
import React, { useState, useMemo } from 'react';
import { WeeklyGoal, Task } from '../types';

interface WeeklyGoalSectionProps {
  goals: WeeklyGoal[];
  tasks: Task[];
  onAddGoal: (title: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const WeeklyGoalSection: React.FC<WeeklyGoalSectionProps> = ({ goals, tasks, onAddGoal, onToggleGoal, onDeleteGoal }) => {
  const [newGoal, setNewGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal);
      setNewGoal('');
    }
  };

  const completedCount = goals.filter(g => g.isDone).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  // Weekly Tracker Logic
  const weeklyTracker = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const now = new Date();
    
    // Find Monday of the current week
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diff = now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(now.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    return days.map((dayName, index) => {
      const currentDay = new Date(monday);
      currentDay.setDate(monday.getDate() + index);
      const startTime = currentDay.getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000;

      const dayTasks = tasks.filter(t => t.createdAt >= startTime && t.createdAt < endTime);
      
      let donePercent = 0;
      if (dayTasks.length > 0) {
        const weightedDone = dayTasks.reduce((acc, curr) => acc + (curr.progress / 100), 0);
        donePercent = Math.round((weightedDone / dayTasks.length) * 100);
      }

      return {
        name: dayName,
        shortName: dayName.substring(0, 3),
        percent: donePercent,
        isToday: new Date().toDateString() === currentDay.toDateString()
      };
    });
  }, [tasks]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Premium Header Card */}
      <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex-1">
                <h2 className="text-3xl font-extrabold mb-2">Weekly Objectives</h2>
                <p className="text-indigo-100 mb-6 text-lg">Achieve your biggest milestones this week.</p>
                <div className="flex items-center gap-6">
                    <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden p-0.5">
                    <div 
                        className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                        style={{ width: `${progress}%` }}
                    />
                    </div>
                    <span className="text-2xl font-black whitespace-nowrap">{progress}%</span>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 text-center">
                <div className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Status</div>
                <div className="text-2xl font-black">{completedCount} / {goals.length}</div>
                <div className="text-[10px] text-indigo-100 font-medium">Major Milestones Met</div>
            </div>
        </div>
      </div>

      {/* NEW: Weekly Performance Grid (Mon to Sun) */}
      <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3">
               <i className="fa-solid fa-chart-line text-indigo-500"></i> Weekly Performance Tracker
            </h3>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Daily Task Progress</span>
         </div>
         
         <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
            {weeklyTracker.map((day) => (
               <div key={day.name} className={`flex flex-col items-center p-4 rounded-3xl transition-all ${day.isToday ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50 border border-transparent hover:border-slate-200'}`}>
                  <div className="relative w-20 h-20 mb-3">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-200" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        <circle 
                           className={`${day.percent > 0 ? 'text-emerald-500' : 'text-slate-300'} transition-all duration-1000 ease-out`} 
                           strokeWidth="8" 
                           strokeDasharray={2 * Math.PI * 40}
                           strokeDashoffset={2 * Math.PI * 40 * (1 - day.percent / 100)}
                           strokeLinecap="round" 
                           stroke="currentColor" 
                           fill="transparent" 
                           r="40" 
                           cx="50" 
                           cy="50" 
                        />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-sm font-black text-slate-800">{day.percent}%</span>
                     </div>
                  </div>
                  <span className={`text-xs font-black uppercase tracking-widest ${day.isToday ? 'text-indigo-600' : 'text-slate-500'}`}>
                     {day.shortName}
                  </span>
                  {day.isToday && <div className="w-1 h-1 bg-indigo-600 rounded-full mt-1"></div>}
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
               <i className="fa-solid fa-flag text-indigo-600"></i> New Weekly Goal
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What's the big target?" 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
              <button 
                type="submit"
                className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200"
              >
                <i className="fa-solid fa-plus text-xs"></i> Add Goal
              </button>
            </form>
            
            <div className="mt-10 pt-8 border-t border-slate-50">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-3">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span className="text-sm">Quick Pro Tip</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed italic font-medium">
                Set goals that scare you a little and excite you a lot. Break them down into tasks in your Board view!
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          {goals.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-16 text-center text-slate-400">
               <i className="fa-solid fa-mountain-sun text-5xl mb-4 opacity-10"></i>
               <p className="font-bold text-lg">Start your journey.</p>
               <p className="text-sm">Set your first high-level objective to get started.</p>
            </div>
          ) : (
            goals.map(goal => (
              <div 
                key={goal.id}
                className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-300 ${
                  goal.isDone 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
                }`}
              >
                <button 
                  onClick={() => onToggleGoal(goal.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    goal.isDone 
                      ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                      : 'border-slate-300 hover:border-indigo-400 bg-white'
                  }`}
                >
                  {goal.isDone && <i className="fa-solid fa-check text-xs"></i>}
                </button>
                <span className={`flex-1 font-bold text-lg ${goal.isDone ? 'text-emerald-700 line-through opacity-60' : 'text-slate-700'}`}>
                  {goal.title}
                </span>
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-slate-300 hover:text-rose-500 p-2 transition-all opacity-0 group-hover:opacity-100"
                >
                  <i className="fa-solid fa-trash-can"></i>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoalSection;
