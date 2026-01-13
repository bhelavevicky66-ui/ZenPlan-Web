
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
  const [weekOffset, setWeekOffset] = useState(0); // 0 = Current Week, -1 = Last Week, etc.

  // Date Logic for Navigation
  const weekInfo = useMemo(() => {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 (Sun) to 6 (Sat)
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

    // Start of current week (Monday)
    const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);

    // Shift by offset
    const shiftedMonday = new Date(monday);
    shiftedMonday.setDate(monday.getDate() + (weekOffset * 7));
    shiftedMonday.setHours(0, 0, 0, 0);

    const sunday = new Date(shiftedMonday);
    sunday.setDate(shiftedMonday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    const formatShort = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const rangeLabel = `${formatShort(shiftedMonday)} - ${formatShort(sunday)}`;

    return {
      monday: shiftedMonday,
      sunday,
      rangeLabel,
      isCurrentWeek: weekOffset === 0
    };
  }, [weekOffset]);

  // Filtering Goals for the selected week
  const filteredGoals = useMemo(() => {
    return goals.filter(g =>
      g.createdAt >= weekInfo.monday.getTime() &&
      g.createdAt <= weekInfo.sunday.getTime()
    );
  }, [goals, weekInfo]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onAddGoal(newGoal);
      setNewGoal('');
      // If user adds a goal while browsing past, maybe we should reset to current?
      // For now, assume goals are added to the "current" view context if they stay on that week.
      if (weekOffset !== 0) setWeekOffset(0);
    }
  };

  const completedCount = filteredGoals.filter(g => g.isDone).length;
  const progress = filteredGoals.length > 0 ? Math.round((completedCount / filteredGoals.length) * 100) : 0;

  // Weekly Tracker Logic based on shifted week
  const weeklyTracker = useMemo(() => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return days.map((dayName, index) => {
      const currentDay = new Date(weekInfo.monday);
      currentDay.setDate(weekInfo.monday.getDate() + index);
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
  }, [tasks, weekInfo]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Week Navigation Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md p-4 rounded-[2rem] border border-white dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${weekInfo.isCurrentWeek ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
            {weekInfo.isCurrentWeek ? 'Live Week' : 'History View'}
          </div>
          <h3 className="text-sm font-bold text-slate-400">Week Offset: {weekOffset === 0 ? 'Current' : weekOffset}</h3>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setWeekOffset(prev => prev - 1)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 active:scale-90"
          >
            <i className="fa-solid fa-chevron-left"></i>
          </button>

          <div className="bg-white dark:bg-slate-900 px-8 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm min-w-[180px] text-center">
            <span className="text-sm font-black text-indigo-600 dark:text-indigo-400 tracking-tight">{weekInfo.rangeLabel}</span>
          </div>

          <button
            onClick={() => setWeekOffset(prev => prev + 1)}
            className="w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition-all text-slate-600 dark:text-slate-300 active:scale-90"
          >
            <i className="fa-solid fa-chevron-right"></i>
          </button>
        </div>

        {!weekInfo.isCurrentWeek && (
          <button
            onClick={() => setWeekOffset(0)}
            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline px-4"
          >
            Reset to Current Week
          </button>
        )}
      </div>

      {/* Premium Header Card */}
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-extrabold mb-2">Weekly Objectives</h2>
            <p className="text-indigo-100 mb-6 text-lg">Goal completion for {weekInfo.rangeLabel}</p>
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
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-6 border border-white/20 text-center min-w-[160px]">
            <div className="text-indigo-200 text-[10px] font-bold uppercase tracking-widest mb-1">Status</div>
            <div className="text-3xl font-black">{completedCount} / {filteredGoals.length}</div>
            <div className="text-[10px] text-indigo-100 font-medium">Milestones Met</div>
          </div>
        </div>
      </div>

      {/* Weekly Performance Grid */}
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-3">
            <i className="fa-solid fa-chart-line text-indigo-500"></i> Performance History
          </h3>
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress Tracker</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
          {weeklyTracker.map((day) => (
            <div key={day.name} className={`flex flex-col items-center p-4 rounded-3xl transition-all ${day.isToday ? 'bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800' : 'bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-slate-200 dark:hover:border-slate-700'}`}>
              <div className="relative w-20 h-20 mb-3">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle className="text-slate-200 dark:text-slate-700" strokeWidth="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                  <circle
                    className={`${day.percent > 0 ? (day.percent === 100 ? 'text-emerald-500' : 'text-indigo-500') : 'text-slate-300'} transition-all duration-1000 ease-out`}
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
                  <span className="text-sm font-black text-slate-800 dark:text-slate-200">{day.percent}%</span>
                </div>
              </div>
              <span className={`text-xs font-black uppercase tracking-widest ${day.isToday ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'}`}>
                {day.shortName}
              </span>
              {day.isToday && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-1 animate-pulse"></div>}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
              <i className="fa-solid fa-flag text-indigo-600"></i> New Goal
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="What's the big target?"
                className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-800 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-300"
              />
              <button
                type="submit"
                className="w-full py-4 bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-slate-200 dark:shadow-none"
              >
                <i className="fa-solid fa-plus text-xs"></i> Add to {weekInfo.isCurrentWeek ? 'Current Week' : 'this Week'}
              </button>
            </form>

            <div className="mt-10 pt-8 border-t border-slate-50 dark:border-slate-800">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-3">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span className="text-sm">Weekly Focus</span>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed italic font-medium">
                Browsing week {Math.abs(weekOffset)} {weekOffset < 0 ? 'ago' : 'ahead'}. Reviewing history helps you stay consistent!
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          {filteredGoals.length === 0 ? (
            <div className="bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-[2.5rem] p-16 text-center text-slate-400">
              <i className="fa-solid fa-calendar-xmark text-5xl mb-4 opacity-10"></i>
              <p className="font-bold text-lg">No goals for this period.</p>
              <p className="text-sm">Try navigating back or forward to see other weeks.</p>
            </div>
          ) : (
            filteredGoals.map(goal => (
              <div
                key={goal.id}
                className={`flex items-center gap-5 p-6 rounded-[2rem] border transition-all duration-300 group ${goal.isDone
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/30'
                  : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-indigo-100 dark:hover:border-indigo-900 shadow-sm'
                  }`}
              >
                <button
                  onClick={() => onToggleGoal(goal.id)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${goal.isDone
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                    : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 bg-white dark:bg-slate-800'
                    }`}
                >
                  {goal.isDone && <i className="fa-solid fa-check text-xs"></i>}
                </button>
                <span className={`flex-1 font-bold text-lg ${goal.isDone ? 'text-emerald-700 dark:text-emerald-400 line-through opacity-60' : 'text-slate-700 dark:text-slate-200'}`}>
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
