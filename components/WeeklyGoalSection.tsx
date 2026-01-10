
import React, { useState } from 'react';
import { WeeklyGoal } from '../types';

interface WeeklyGoalSectionProps {
  goals: WeeklyGoal[];
  onAddGoal: (title: string) => void;
  onToggleGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

const WeeklyGoalSection: React.FC<WeeklyGoalSectionProps> = ({ goals, onAddGoal, onToggleGoal, onDeleteGoal }) => {
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

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <i className="fa-solid fa-trophy text-9xl"></i>
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-2">Weekly Objectives</h2>
          <p className="text-indigo-100 mb-6">Master your week by hitting these high-level targets.</p>
          
          <div className="flex items-center gap-6">
            <div className="flex-1 h-3 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xl font-bold whitespace-nowrap">{progress}% Complete</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-800 mb-4">Focus of the Week</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input 
                type="text" 
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="New major goal..." 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
              />
              <button 
                type="submit"
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-plus text-xs"></i> Add Goal
              </button>
            </form>
            
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-2 text-indigo-600 font-bold mb-2">
                <i className="fa-solid fa-lightbulb"></i>
                <span>Tip</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Try setting "SMART" goals that are specific and achievable within 7 days.
              </p>
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-4">
          {goals.length === 0 ? (
            <div className="bg-white/50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
              <p className="font-medium">No goals set for this week yet.</p>
            </div>
          ) : (
            goals.map(goal => (
              <div 
                key={goal.id}
                className={`flex items-center gap-4 p-5 rounded-3xl border transition-all ${
                  goal.isDone 
                    ? 'bg-emerald-50 border-emerald-100' 
                    : 'bg-white border-slate-100 hover:border-indigo-100 shadow-sm'
                }`}
              >
                <button 
                  onClick={() => onToggleGoal(goal.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all ${
                    goal.isDone 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 hover:border-indigo-400'
                  }`}
                >
                  {goal.isDone && <i className="fa-solid fa-check text-xs"></i>}
                </button>
                <span className={`flex-1 font-bold ${goal.isDone ? 'text-emerald-700 line-through opacity-60' : 'text-slate-700'}`}>
                  {goal.title}
                </span>
                <button 
                  onClick={() => onDeleteGoal(goal.id)}
                  className="text-slate-300 hover:text-rose-500 p-2 transition-all"
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
