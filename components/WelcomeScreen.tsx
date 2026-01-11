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
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F0F1A] overflow-hidden">
      {/* Background Image/Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-120"
        style={{
          backgroundImage: `url('/new-lightning-bg.png')`,
          // User provided background
        }}
      ></div>

      {/* Overlay Gradient for Central Glow */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#2a0e66]/50 via-transparent to-transparent"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[800px] h-[800px] bg-indigo-100/10 rounded-full blur-[100px] mix-blend-overlay"></div>
        <div className="absolute w-[600px] h-[600px] bg-white/10 rounded-full blur-[80px]"></div>
      </div>

      <div className={`relative z-10 text-center px-6 transition-all duration-1000 transform ${animate ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        {/* Logo/Icon */}
        <div className="flex justify-center mb-8 -mt-12">
          <div className="w-24 h-24 bg-gradient-to-br from-[#8B5CF6] to-[#7C3AED] rounded-[2rem] flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(124,58,237,0.5)] animate-bounce-slow">
            <i className="fa-solid fa-bolt text-white text-5xl drop-shadow-md"></i>
          </div>
        </div>
        {/* Text Content */}
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">ZenPlan</span>
        </h1>
        <p className="text-slate-600 text-lg md:text-xl max-w-lg mx-auto mb-12 font-bold leading-relaxed">
          Master your workflow, conquer your daily goals, and track your weekly performance with clarity.
        </p>

        {/* Action Button */}
        <button
          onClick={onFinish}
          className="group relative inline-flex items-center gap-3 bg-[#0F172A] text-white px-10 py-5 rounded-[2rem] font-black text-lg shadow-2xl hover:shadow-[0_20px_40px_-10px_rgba(15,23,42,0.4)] transition-all hover:scale-105 active:scale-95 overflow-hidden"
        >
          <span className="relative z-10">Start Planning</span>
          <i className="fa-solid fa-arrow-right relative z-10 transition-transform group-hover:translate-x-1"></i>
        </button>

        {/* Footer Feature Pills */}
        <div className="mt-20 flex flex-wrap justify-center gap-4">
          <FeatureBadge icon="fa-chart-pie" text="Progress Tracking" />
          <FeatureBadge icon="fa-calendar-check" text="Weekly Goals" />
          <FeatureBadge icon="fa-bolt" text="Fast & Responsive" />
        </div>
      </div>
    </div>
  );
};

const FeatureBadge = ({ icon, text }: { icon: string; text: string }) => (
  <div className="flex items-center gap-2 bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-full border border-indigo-100 shadow-lg text-slate-800 hover:bg-white transition-colors">
    <i className={`fa-solid ${icon} text-violet-600 text-xs`}></i>
    <span className="text-[10px] font-bold uppercase tracking-widest">{text}</span>
  </div>
);

export default WelcomeScreen;
