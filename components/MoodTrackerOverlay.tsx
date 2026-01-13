
import React, { useState } from 'react';
import { Mood } from '../types';

interface MoodTrackerOverlayProps {
    onSelect: (mood: Mood) => void;
    onClose: () => void;
    context: 'completion' | 'failure';
}

const MoodTrackerOverlay: React.FC<MoodTrackerOverlayProps> = ({ onSelect, onClose, context }) => {
    const [selected, setSelected] = useState<Mood | null>(null);

    const handleSelect = (mood: Mood) => {
        setSelected(mood);
        // Determine analytic message
        let analytic = "";
        if (mood === 'happy') analytic = "🔥 You complete 30% more tasks when you're Happy!";
        if (mood === 'tired') analytic = "😴 Rest is productive too. Take a break to boost energy.";
        if (mood === 'neutral') analytic = "⚡ Consistency is your superpower.";

        // Slight delay to show the insight before closing
        setTimeout(() => {
            onSelect(mood);
        }, 2000);
    };

    if (selected) {
        return (
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
                <div className="text-center animate-in zoom-in duration-300 px-6">
                    <div className="text-6xl mb-6 animate-bounce">
                        {selected === 'happy' ? '😄' : selected === 'neutral' ? '😐' : '😴'}
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">Mood Logged</h2>
                    <div className="bg-white/10 rounded-2xl p-6 border border-white/10 max-w-sm mx-auto">
                        <p className="text-indigo-300 font-bold uppercase text-xs tracking-widest mb-2">✨ Smart Insight</p>
                        <p className="text-xl text-white font-medium">{selected === 'happy' ? "🔥 You complete 30% more tasks when you're Happy!" : selected === 'tired' ? "😴 Rest is productive too. Take a break." : "⚡ Consistency is your superpower."}</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="max-w-2xl w-full mx-4 text-center">
                <h2 className="text-3xl md:text-4xl font-black text-white mb-2">
                    {context === 'completion' ? 'Task Crushed! 🚀' : 'Task Status Updated'}
                </h2>
                <p className="text-slate-400 text-lg mb-10">How are you feeling right now?</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <button
                        onClick={() => handleSelect('happy')}
                        className="group bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 hover:from-emerald-500 hover:to-emerald-600 border border-emerald-500/30 hover:border-emerald-400 p-8 rounded-[2rem] transition-all duration-300 hover:scale-105"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">😄</div>
                        <div className="text-emerald-200 font-bold text-xl group-hover:text-white">Happy</div>
                        <div className="text-emerald-200/50 text-sm mt-2 font-medium">High Energy</div>
                    </button>

                    <button
                        onClick={() => handleSelect('neutral')}
                        className="group bg-gradient-to-br from-blue-500/20 to-blue-600/20 hover:from-blue-500 hover:to-blue-600 border border-blue-500/30 hover:border-blue-400 p-8 rounded-[2rem] transition-all duration-300 hover:scale-105"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">😐</div>
                        <div className="text-blue-200 font-bold text-xl group-hover:text-white">Neutral</div>
                        <div className="text-blue-200/50 text-sm mt-2 font-medium">Focused</div>
                    </button>

                    <button
                        onClick={() => handleSelect('tired')}
                        className="group bg-gradient-to-br from-slate-500/20 to-slate-600/20 hover:from-slate-500 hover:to-slate-600 border border-slate-500/30 hover:border-slate-400 p-8 rounded-[2rem] transition-all duration-300 hover:scale-105"
                    >
                        <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">😴</div>
                        <div className="text-slate-200 font-bold text-xl group-hover:text-white">Tired</div>
                        <div className="text-slate-200/50 text-sm mt-2 font-medium">Low Energy</div>
                    </button>
                </div>

                <button onClick={onClose} className="mt-12 text-slate-500 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                    Skip for now
                </button>
            </div>
        </div>
    );
};

export default MoodTrackerOverlay;
