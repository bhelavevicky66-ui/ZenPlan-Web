
import React, { useEffect, useState } from 'react';

interface WelcomeScreenProps {
  onFinish: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onFinish }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    // Small delay to trigger entry animations
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-50 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-200/40 rounded-full blur-[120px] transition-all duration-[2000ms] ${animate ? 'translate-x-10 translate-y-10' : ''}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-violet-200/40 rounded-full blur-[120px] transition-all duration-[2000ms] ${animate ? '-translate-x-10 -translate-y-10' : ''}`}></div>
      </div>

      <div className={`relative z-10 text-center px-6 transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-indigo-200 animate-bounce">
            <i className="fa-solid fa-bolt text-white text-5xl"></i>
          </div>
        </div>

        {/* Text Content */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-4">
          Welcome to <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">ZenPlan</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-lg mx-auto mb-12 font-medium leading-relaxed">
          Master your workflow, conquer your daily goals, and track your weekly performance with clarity.
        </p>

        {/* Action Button */}
        <button
          onClick={onFinish}
          className="group relative inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
        >
          <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <span className="relative">Start Planning</span>
          <i className="fa-solid fa-arrow-right relative transition-transform group-hover:translate-x-1"></i>
        </button>

        {/* Footer Feature Pills */}
        <div className="mt-20 flex flex-wrap justify-center gap-4 opacity-60">
          <FeatureBadge icon="fa-chart-pie" text="Progress Tracking" />
          <FeatureBadge icon="fa-calendar-check" text="Weekly Goals" />
          <FeatureBadge icon="fa-bolt" text="Fast & Responsive" />
        </div>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
    <i className={`fa-solid ${icon} text-indigo-500 text-xs`}></i>
    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">{text}</span>
  </div>
);

export default WelcomeScreen;
