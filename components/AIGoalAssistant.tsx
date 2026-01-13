
import React, { useState } from 'react';

interface AIPlan {
    dailyPlan: string[];
    bestTime: string;
    priority: string[];
}

const AIGoalAssistant: React.FC = () => {
    const [goal, setGoal] = useState('');
    const [loading, setLoading] = useState(false);
    const [plan, setPlan] = useState<AIPlan | null>(null);

    const generateSmartPlan = () => {
        if (!goal.trim()) return;

        setLoading(true);
        setPlan(null);

        // Simulate AI Delay
        setTimeout(() => {
            const lowerGoal = goal.toLowerCase();
            let response: AIPlan = {
                dailyPlan: [
                    "Break the goal into small chunks.",
                    "Dedicate 1 hour daily.",
                    "Review progress at night."
                ],
                bestTime: "10:00 AM - 12:00 PM",
                priority: ["High Priority: Start immediately", "Consistency is key"]
            };

            if (lowerGoal.includes('code') || lowerGoal.includes('react') || lowerGoal.includes('project') || lowerGoal.includes('dev')) {
                response = {
                    dailyPlan: [
                        "Set up the project environment",
                        "Code core features (Focus Mode)",
                        "Debug and Refactor"
                    ],
                    bestTime: "08:00 AM - 11:00 AM (Deep Work)",
                    priority: ["1. Core Logic", "2. UI/UX", "3. Testing"]
                };
            } else if (lowerGoal.includes('gym') || lowerGoal.includes('workout') || lowerGoal.includes('fit') || lowerGoal.includes('loss')) {
                response = {
                    dailyPlan: [
                        "Warm-up for 10 mins",
                        "High Intensity Training / Lifting",
                        "Post-workout Nutrition"
                    ],
                    bestTime: "06:00 PM - 07:30 PM",
                    priority: ["Consistency", "Proper Form", "Recovery"]
                };
            } else if (lowerGoal.includes('study') || lowerGoal.includes('learn') || lowerGoal.includes('read')) {
                response = {
                    dailyPlan: [
                        "Read/Watch material for 45 mins",
                        "Take notes using Active Recall",
                        "Practice/Quiz for 15 mins"
                    ],
                    bestTime: "Early Morning (06:00 AM - 08:00 AM)",
                    priority: ["Understanding Concepts", "Daily Revision"]
                };
            }

            setPlan(response);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 dark:from-indigo-950 dark:to-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl border border-indigo-500/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

            <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                        <i className="fa-solid fa-robot text-2xl animate-bounce-slow"></i>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold">AI Goal Assistant</h2>
                        <p className="text-indigo-200 text-sm">Tell me your goal, I'll make a plan.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="relative">
                        <textarea
                            value={goal}
                            onChange={(e) => setGoal(e.target.value)}
                            placeholder="e.g., Build a Portfolio Website, Lose 5kg..."
                            className="w-full bg-white/10 border border-white/10 rounded-2xl p-4 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none h-24"
                        ></textarea>
                        {goal && (
                            <button
                                onClick={() => setGoal('')}
                                className="absolute top-3 right-3 text-slate-400 hover:text-white transition-colors"
                            >
                                <i className="fa-solid fa-xmark"></i>
                            </button>
                        )}
                    </div>

                    <button
                        onClick={generateSmartPlan}
                        disabled={loading || !goal.trim()}
                        className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl font-bold shadow-lg shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-circle-notch fa-spin"></i> Generating Plan...
                            </>
                        ) : (
                            <>
                                <i className="fa-solid fa-wand-magic-sparkles group-hover:rotate-12 transition-transform"></i> Generate Smart Plan
                            </>
                        )}
                    </button>
                </div>

                {plan && (
                    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                            <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                <i className="fa-solid fa-list-check"></i> Daily Breakdown
                            </h3>
                            <ul className="space-y-2">
                                {plan.dailyPlan.map((step, i) => (
                                    <li key={i} className="flex items-start gap-3 text-sm font-medium text-slate-200">
                                        <span className="bg-indigo-500/20 text-indigo-300 w-5 h-5 rounded-full flex items-center justify-center text-[10px] mt-0.5">{i + 1}</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="text-emerald-300 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-clock"></i> Best Time
                                </h3>
                                <p className="text-sm font-bold text-white">{plan.bestTime}</p>
                            </div>
                            <div className="bg-white/5 rounded-2xl p-5 border border-white/10">
                                <h3 className="text-amber-300 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                    <i className="fa-solid fa-layer-group"></i> Priority
                                </h3>
                                <div className="flex flex-col gap-1">
                                    {plan.priority.map((p, i) => (
                                        <span key={i} className="text-xs font-medium text-slate-300 truncate">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AIGoalAssistant;
