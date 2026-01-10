
import React from 'react';
import { Task, TaskStatus } from '../types';

interface TaskColumnProps {
  title: string;
  icon: string;
  tasks: Task[];
  color: 'indigo' | 'emerald' | 'rose';
  onStatusChange: (id: string, status: TaskStatus) => void;
  onProgressChange: (id: string, progress: number) => void;
  onDelete: (id: string) => void;
}

const TaskColumn: React.FC<TaskColumnProps> = ({ title, icon, tasks, color, onStatusChange, onProgressChange, onDelete }) => {
  const colorClasses = {
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-700',
      dot: 'bg-indigo-400',
      border: 'border-indigo-100',
      accent: 'indigo',
      slider: 'accent-indigo-600'
    },
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      dot: 'bg-emerald-400',
      border: 'border-emerald-100',
      accent: 'emerald',
      slider: 'accent-emerald-600'
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      dot: 'bg-rose-400',
      border: 'border-rose-100',
      accent: 'rose',
      slider: 'accent-rose-600'
    }
  };

  const style = colorClasses[color];

  return (
    <div className="flex flex-col h-full min-h-[500px] space-y-4">
      <div className={`flex items-center justify-between p-4 ${style.bg} border-b-2 border-${style.accent}-500 rounded-t-2xl shadow-sm`}>
        <div className="flex items-center gap-3">
          <i className={`fa-solid ${icon} ${style.text} text-xl`}></i>
          <h3 className={`font-bold ${style.text}`}>{title}</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${style.bg} ${style.text} border ${style.border}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-4 custom-scrollbar overflow-y-auto pr-1 flex-1">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-400 bg-white/50 border-2 border-dashed border-slate-200 rounded-2xl">
            <i className="fa-regular fa-folder-open text-4xl mb-2 opacity-20"></i>
            <p className="text-sm font-medium">No tasks here</p>
          </div>
        ) : (
          tasks.map(task => (
            <div 
              key={task.id} 
              className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-indigo-100 transition-all group"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col gap-1">
                   <h4 className="font-bold text-slate-800 break-words flex-1 pr-4">{task.title}</h4>
                   <div className="flex gap-2">
                      <span className={`text-[9px] font-bold uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${
                        task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                        task.status === 'not-completed' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {task.status}
                      </span>
                   </div>
                </div>
                <button 
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
              <p className="text-sm text-slate-400 mb-4 line-clamp-1 leading-relaxed italic">
                {task.description || "No description provided."}
              </p>
              
              {/* Dual Progress Visuals */}
              <div className="mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                <div className="flex justify-between items-end">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Done</span>
                      <span className="text-lg font-black text-slate-800 leading-none">{task.progress}%</span>
                   </div>
                   <div className="flex flex-col items-end">
                      <span className="text-[9px] font-black text-rose-500 uppercase tracking-widest">Remaining</span>
                      <span className="text-lg font-black text-slate-800 leading-none">{100 - task.progress}%</span>
                   </div>
                </div>

                {/* Dual Progress Bar */}
                <div className="h-2.5 w-full bg-rose-100 rounded-full overflow-hidden flex shadow-inner">
                   <div 
                      className="h-full bg-emerald-500 transition-all duration-500" 
                      style={{ width: `${task.progress}%` }}
                   />
                   <div 
                      className="h-full bg-rose-400 opacity-50 transition-all duration-500" 
                      style={{ width: `${100 - task.progress}%` }}
                   />
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="1"
                  value={task.progress}
                  onChange={(e) => onProgressChange(task.id, parseInt(e.target.value))}
                  className={`w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${style.slider}`}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'completed')}
                    className="flex-1 min-w-[100px] bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-1 active:scale-95"
                  >
                    <i className="fa-solid fa-check"></i> Complete
                  </button>
                )}
                {task.status !== 'not-completed' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'not-completed')}
                    className="flex-1 min-w-[100px] bg-rose-50 hover:bg-rose-100 text-rose-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border border-rose-100"
                  >
                    <i className="fa-solid fa-xmark"></i> Not Done
                  </button>
                )}
                {task.status !== 'pending' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'pending')}
                    className="flex-1 min-w-[100px] bg-slate-50 hover:bg-slate-100 text-slate-600 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 border border-slate-200"
                  >
                    <i className="fa-solid fa-rotate-left"></i> Re-open
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TaskColumn;
