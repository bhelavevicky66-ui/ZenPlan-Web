
import React, { useEffect, useState } from 'react';

interface StreakCelebrationProps {
    streak: number;
    onClose: () => void;
}

const StreakCelebration: React.FC<StreakCelebrationProps> = ({ streak, onClose }) => {
    const [displayStreak, setDisplayStreak] = useState(streak - 1);
    const [scale, setScale] = useState(false);

    useEffect(() => {
        // Start animation sequence
        const timer1 = setTimeout(() => {
            setScale(true);
            setDisplayStreak(streak);
        }, 500);

        const timer2 = setTimeout(() => {
            onClose();
        }, 4000);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        };
    }, [streak, onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col items-center">
                {/* Fire Animation */}
                <div className="relative mb-8">
                    <div className={`text-[120px] filter drop-shadow-[0_0_50px_rgba(249,115,22,0.6)] ${scale ? 'animate-bounce' : 'scale-90 opacity-80'} transition-all duration-500`}>
                        🔥
                    </div>
                    {scale && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-full bg-orange-500 rounded-full blur-[80px] opacity-20 animate-pulse"></div>
                        </div>
                    )}
                </div>

                {/* Text */}
                <div className="text-center space-y-2">
                    <h2 className="text-4xl font-extrabold text-white mb-2 tracking-tight">Daily Streak Increased!</h2>
                    <div className="flex items-center justify-center gap-4 text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-400 to-red-600">
                        <span className="tabular-nums transition-all duration-700 transform">
                            {displayStreak}
                        </span>
                    </div>
                    <p className="text-orange-200 text-xl font-medium mt-4">Keep the fire burning!</p>
                </div>
            </div>

            {/* Confetti particles */}
            <style>{`
        @keyframes float-up {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(-10vh) scale(1); opacity: 0; }
        }
      `}</style>
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute rounded-full bg-orange-500"
                    style={{
                        width: Math.random() * 10 + 5 + 'px',
                        height: Math.random() * 10 + 5 + 'px',
                        left: Math.random() * 100 + 'vw',
                        animation: `float-up ${Math.random() * 2 + 2}s linear infinite`,
                        animationDelay: Math.random() * 2 + 's',
                        opacity: Math.random() * 0.5 + 0.2
                    }}
                ></div>
            ))}
        </div>
    );
};

export default StreakCelebration;
