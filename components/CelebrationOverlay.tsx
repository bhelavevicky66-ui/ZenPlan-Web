
import React, { useEffect } from 'react';

interface CelebrationOverlayProps {
    onClose: () => void;
}

const CelebrationOverlay: React.FC<CelebrationOverlayProps> = ({ onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-500"></div>
            <div className="relative z-10 text-center animate-in zoom-in-50 duration-500 slide-in-from-bottom-10">
                <div className="text-9xl mb-4 animate-bounce">🏆</div>
                <h2 className="text-5xl font-extrabold text-white mb-4 drop-shadow-lg">Outstanding!</h2>
                <p className="text-2xl text-emerald-200 font-bold drop-shadow-md">You crushed all your tasks today!</p>
            </div>

            {/* Simple CSS-only confetti */}
            {[...Array(50)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-3 h-3 bg-red-500 rounded-sm"
                    style={{
                        top: '-10%',
                        left: `${Math.random() * 100}%`,
                        backgroundColor: ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'][Math.floor(Math.random() * 5)],
                        animation: `fall ${Math.random() * 3 + 2}s linear forwards`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                ></div>
            ))}
            <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); }
        }
      `}</style>
        </div>
    );
};

export default CelebrationOverlay;
