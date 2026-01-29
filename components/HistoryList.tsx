import React, { useMemo } from 'react';
import { Task, WeeklyGoal } from '../types';

interface HistoryListProps {
    tasks: Task[];
    goals: WeeklyGoal[];
}

const HistoryList: React.FC<HistoryListProps> = ({ tasks, goals }) => {
    const historyData = useMemo(() => {
        const weeksback = 12; // Show last 12 weeks
        const data = [];
        const now = new Date();

        // Align to current week's Monday
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const currentMonday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
        currentMonday.setHours(0, 0, 0, 0);

        for (let i = 0; i < weeksback; i++) {
            const startOfWeek = new Date(currentMonday);
            startOfWeek.setDate(startOfWeek.getDate() - (i * 7));
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(endOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);

            const startTs = startOfWeek.getTime();
            const endTs = endOfWeek.getTime();

            const weekGoals = goals.filter(g => g.createdAt >= startTs && g.createdAt <= endTs);
            const weekTasks = tasks.filter(t => t.createdAt >= startTs && t.createdAt <= endTs);

            if (weekGoals.length === 0 && weekTasks.length === 0) continue;

            const goalsCompleted = weekGoals.filter(g => g.isDone).length;
            const tasksCompleted = weekTasks.filter(t => t.status === 'completed').length;
            const tasksTotal = weekTasks.length;
            const goalsTotal = weekGoals.length;

            const goalPercent = goalsTotal > 0 ? Math.round((goalsCompleted / goalsTotal) * 100) : 0;
            const taskPercent = tasksTotal > 0 ? Math.round((tasksCompleted / tasksTotal) * 100) : 0;

            data.push({
                label: `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
                weekIndex: i, // 0 = current
                goalsStats: { total: goalsTotal, completed: goalsCompleted, percent: goalPercent },
                tasksStats: { total: tasksTotal, completed: tasksCompleted, percent: taskPercent }
            });
        }
        return data;
    }, [tasks, goals]);

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                    <i className="fa-solid fa-clock-rotate-left text-indigo-500"></i> Past Weeks
                </h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">History</span>
            </div>

            <div className="grid gap-4">
                {historyData.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 dark:text-slate-500 italic">
                        No history available yet. Start adding goals!
                    </div>
                ) : (
                    historyData.map((week) => (
                        <div key={week.label} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">

                                {/* Date Label */}
                                <div className="min-w-[150px]">
                                    <span className={`text-xs font-bold uppercase tracking-widest mb-1 block ${week.weekIndex === 0 ? 'text-indigo-500' : 'text-slate-400'}`}>
                                        {week.weekIndex === 0 ? 'Current Week' : `${week.weekIndex} Week(s) Ago`}
                                    </span>
                                    <h4 className="text-lg font-black text-slate-700 dark:text-slate-200">{week.label}</h4>
                                </div>

                                {/* Stats Grid */}
                                <div className="flex-1 grid grid-cols-2 gap-4">
                                    {/* Goals Stat */}
                                    <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-indigo-900 dark:text-indigo-200 text-xs font-bold uppercase tracking-wider mb-1">Goals</div>
                                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                                                {week.goalsStats.completed}<span className="text-base text-indigo-300 dark:text-indigo-600">/{week.goalsStats.total}</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full border-[3px] border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-300">
                                            {week.goalsStats.percent}%
                                        </div>
                                    </div>

                                    {/* Tasks Stat */}
                                    <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-4 flex items-center justify-between">
                                        <div>
                                            <div className="text-emerald-900 dark:text-emerald-200 text-xs font-bold uppercase tracking-wider mb-1">Tasks</div>
                                            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                                                {week.tasksStats.completed}<span className="text-base text-emerald-300 dark:text-emerald-600">/{week.tasksStats.total}</span>
                                            </div>
                                        </div>
                                        <div className="h-10 w-10 rounded-full border-[3px] border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-300">
                                            {week.tasksStats.percent}%
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default HistoryList;
