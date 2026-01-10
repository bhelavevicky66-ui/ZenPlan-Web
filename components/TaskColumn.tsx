
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
                <h4 className="font-bold text-slate-800 break-words flex-1 pr-4">{task.title}</h4>
                <button 
                  onClick={() => onDelete(task.id)}
                  className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-rose-500 transition-all p-1"
                >
                  <i className="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
              <p className="text-sm text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                {task.description || "No description provided."}
              </p>
              
              {/* Progress Slider */}
              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progress Achieved</span>
                  <span className={`text-xs font-bold ${task.progress === 100 ? 'text-emerald-600' : 'text-indigo-600'}`}>
                    {task.progress}%
                  </span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={task.progress}
                  onChange={(e) => onProgressChange(task.id, parseInt(e.target.value))}
                  className={`w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer ${style.slider}`}
                />
              </div>

              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50">
                {task.status !== 'completed' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'completed')}
                    className="flex-1 min-w-[100px] bg-emerald-50 hover:bg-emerald-100 text-emerald-600 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <i className="fa-solid fa-check"></i> Mark Done
                  </button>
                )}
                {task.status !== 'not-completed' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'not-completed')}
                    className="flex-1 min-w-[100px] bg-rose-50 hover:bg-rose-100 text-rose-600 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                    title="Mark as not fully done but keep progress"
                  >
                    <i className="fa-solid fa-xmark"></i> Not Done
                  </button>
                )}
                {task.status !== 'pending' && (
                  <button 
                    onClick={() => onStatusChange(task.id, 'pending')}
                    className="flex-1 min-w-[100px] bg-slate-50 hover:bg-slate-100 text-slate-600 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
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
