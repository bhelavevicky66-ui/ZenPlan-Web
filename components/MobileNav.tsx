
import React from 'react';
import { TabType } from '../types';

interface MobileNavProps {
    activeTab: TabType;
    setActiveTab: (tab: TabType) => void;
    onAddTask: () => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab, onAddTask }) => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe md:hidden z-40">
            <div className="flex justify-around items-center p-2">
                <button
                    onClick={() => setActiveTab('home')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <i className={`fa-solid fa-house text-xl mb-1 ${activeTab === 'home' ? 'scale-110' : ''}`}></i>
                    <span className="text-[10px] font-bold">Home</span>
                </button>

                <button
                    onClick={() => setActiveTab('board')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'board' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <i className={`fa-solid fa-layer-group text-xl mb-1 ${activeTab === 'board' ? 'scale-110' : ''}`}></i>
                    <span className="text-[10px] font-bold">Board</span>
                </button>

                <div className="relative -top-6">
                    <button
                        onClick={onAddTask}
                        className="w-14 h-14 bg-indigo-600 rounded-full text-white shadow-lg shadow-indigo-300 flex items-center justify-center transform transition-transform active:scale-95"
                    >
                        <i className="fa-solid fa-plus text-2xl"></i>
                    </button>
                </div>

                <button
                    onClick={() => setActiveTab('goals')}
                    className={`flex flex-col items-center p-2 rounded-xl transition-all ${activeTab === 'goals' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                        }`}
                >
                    <i className={`fa-solid fa-bullseye text-xl mb-1 ${activeTab === 'goals' ? 'scale-110' : ''}`}></i>
                    <span className="text-[10px] font-bold">Goals</span>
                </button>

                <button
                    className="flex flex-col items-center p-2 rounded-xl text-slate-400 hover:text-slate-600 transition-all"
                >
                    <i className="fa-solid fa-gear text-xl mb-1"></i>
                    <span className="text-[10px] font-bold">Settings</span>
                </button>
            </div>
        </div>
    );
};

export default MobileNav;
