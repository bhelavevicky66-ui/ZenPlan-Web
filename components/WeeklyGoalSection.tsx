
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
  const [weekOffset, setWeekOffset] = useState(0);

  const weekInfo = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
    const shiftedMonday = new Date(monday);
    shiftedMonday.setDate(monday.getDate() + (weekOffset * 7));
    shiftedMonday.setHours(0, 0, 0, 0);
    const sunday = new Date(shiftedMonday);
    sunday.setDate(shiftedMonday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);
    const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const rangeLabel = `${formatShort(shiftedMonday)} - ${formatShort(sunday)}`;
    return { monday: shiftedMonday, sunday, rangeLabel, isCurrentWeek: weekOffset === 0 };
  }, [weekOffset]);

  const filteredGoals = useMemo(() => {
    return goals.filter(g => g.createdAt >= weekInfo.monday.getTime() && g.createdAt <= weekInfo.sunday.getTime());
  }, [goals, weekInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal);
      setNewGoal('');
      if (weekOffset !== 0) setWeekOffset(0);
    }
  };

  const progress = filteredGoals.length > 0 ? Math.round((filteredGoals.filter(g => g.isDone).length / filteredGoals.length) * 100) : 0;

  const weeklyTracker = useMemo(() => {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayShort, index) => {
      const currentDay = new Date(weekInfo.monday);
      currentDay.setDate(weekInfo.monday.getDate() + index);
      const startTime = currentDay.getTime();
      const endTime = startTime + 24 * 60 * 60 * 1000;
      const dayTasks = tasks.filter(t => t.createdAt >= startTime && t.createdAt < endTime);
      let donePercent = 0;
      if (dayTasks.length > 0) {
        donePercent = Math.round((dayTasks.reduce((acc, curr) => acc + (curr.progress / 100), 0) / dayTasks.length) * 100);
      }
      return { name: dayShort, percent: donePercent, isToday: new Date().toDateString() === currentDay.toDateString() };
    });
  }, [tasks, weekInfo]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      
      {/* Week Navigation */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 backdrop-blur-md p-3 md:p-4 rounded-[1.5rem] md:rounded-[2rem] border border-white shadow-sm">
        <div className="flex items-center gap-2">
           <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${weekInfo.isCurrentWeek ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
              {weekInfo.isCurrentWeek ? 'Current' : 'History'}
           </div>
           <span className="text-xs font-bold text-slate-400 hidden xs:inline">Offset: {weekOffset}</span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button onClick={() => setWeekOffset(prev => prev - 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
          <div className="bg-white px-4 md:px-8 py-2 rounded-xl border border-slate-200 shadow-sm min-w-[140px] text-center">
            <span className="text-xs md:text-sm font-black text-indigo-600">{weekInfo.rangeLabel}</span>
          </div>
          <button onClick={() => setWeekOffset(prev => prev + 1)} className="w-9 h-9 flex items-center justify-center bg-white border border-slate-200 rounded-full text-slate-600"><i className="fa-solid fa-chevron-right text-xs"></i></button>
        </div>
      </div>

      {/* Main Stats Banner */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[1.5rem] md:rounded-[2.5rem] p-6 md:p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="w-full md:flex-1">
                <h2 className="text-2xl md:text-3xl font-extrabold mb-1">Weekly Goals</h2>
                <p className="text-indigo-100 mb-6 text-sm md:text-lg">Performance for selected week</p>
                <div className="flex items-center gap-4">
                    <div className="flex-1 h-2.5 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-white transition-all duration-1000" style={{ width: `${progress}%` }} />
                    </div>
                    <span className="text-xl font-black">{progress}%</span>
                </div>
            </div>
            <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 md:p-6 border border-white/20 text-center w-full md:w-auto md:min-w-[160px]">
                <div className="text-3xl font-black">{filteredGoals.filter(g => g.isDone).length} / {filteredGoals.length}</div>
                <div className="text-[10px] text-indigo-100 uppercase font-bold tracking-widest mt-1">Milestones</div>
            </div>
        </div>
      </div>

      {/* Daily Performance Grid */}
      <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] p-4 md:p-8 border border-slate-100">
         <div className="grid grid-cols-4 sm:grid-cols-7 gap-3 md:gap-6">
            {weeklyTracker.map((day) => (
               <div key={day.name} className={`flex flex-col items-center p-2 md:p-4 rounded-2xl ${day.isToday ? 'bg-indigo-50' : 'bg-slate-50'}`}>
                  <div className="relative w-12 h-12 md:w-16 md:h-16 mb-2">
                     <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                        <circle className="text-slate-200" strokeWidth="10" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                        <circle className="text-indigo-500" strokeWidth="10" strokeDasharray={251.2} strokeDashoffset={251.2 * (1 - day.percent / 100)} strokeLinecap="round" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                     </svg>
                     <span className="absolute inset-0 flex items-center justify-center text-[10px] md:text-xs font-black">{day.percent}%</span>
                  </div>
                  <span className={`text-[10px] font-bold uppercase ${day.isToday ? 'text-indigo-600' : 'text-slate-500'}`}>{day.name}</span>
               </div>
            ))}
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 flex items-center gap-2"><i className="fa-solid fa-flag text-indigo-600"></i> New Goal</h3>
            <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Target for this week..." className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
            <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl text-sm">Add to Week</button>
          </form>
        </div>

        <div className="md:col-span-8 space-y-3">
          {filteredGoals.map(goal => (
            <div key={goal.id} className={`flex items-center gap-4 p-4 rounded-2xl border ${goal.isDone ? 'bg-emerald-50 border-emerald-100' : 'bg-white border-slate-100 shadow-sm'}`}>
              <button onClick={() => onToggleGoal(goal.id)} className={`w-6 h-6 rounded-full flex items-center justify-center border-2 ${goal.isDone ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'}`}>
                {goal.isDone && <i className="fa-solid fa-check text-[10px]"></i>}
              </button>
              <span className={`flex-1 font-bold text-sm md:text-base ${goal.isDone ? 'text-emerald-700 line-through opacity-60' : 'text-slate-700'}`}>{goal.title}</span>
              <button onClick={() => onDeleteGoal(goal.id)} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="fa-solid fa-trash-can text-sm"></i></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeeklyGoalSection;
