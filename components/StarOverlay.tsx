
import React, { useEffect } from 'react';

interface StarOverlayProps {
    percentage: number;
    onClose: () => void;
}

const StarOverlay: React.FC<StarOverlayProps> = ({ percentage, onClose }) => {
    const stars = Math.round(percentage / 20);

    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2000); // Show for 2 seconds
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm pointer-events-none animate-in fade-in duration-300">
            <div className="flex flex-col items-center justify-center transform animate-in zoom-in-50 duration-300">
                <div className="bg-slate-900/90 border border-slate-700 p-8 rounded-[3rem] shadow-2xl flex flex-col items-center">
                    <h2 className="text-white text-lg font-bold uppercase tracking-widest mb-4">Impact Score Updated</h2>
                    <div className="flex gap-2">
                        {[...Array(5)].map((_, i) => (
                            <i
                                key={i}
                                className={`fa-solid fa-star text-5xl transition-all duration-500 transform ${i < stars ? 'text-yellow-400 scale-110 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]' : 'text-slate-700 scale-90'}`}
                            ></i>
                        ))}
                    </div>
                    <div className="mt-4 text-slate-400 font-medium">
                        {stars} / 5 Stars
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StarOverlay;
