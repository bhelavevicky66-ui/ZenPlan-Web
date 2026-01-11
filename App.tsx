
import React, { useState, useEffect, useMemo } from 'react';
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User as FirebaseUser
} from 'https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js';
import { Task, WeeklyGoal, TaskStatus, TabType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import WeeklyGoalSection from './components/WeeklyGoalSection';
import HomeDashboard from './components/HomeDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import CelebrationOverlay from './components/CelebrationOverlay';

// NOTE: To make this fully functional, replace these placeholders with your Firebase project credentials from the Firebase Console.
const firebaseConfig = {
  apiKey: "AIzaSyAs-EXAMPLE-KEY",
  authDomain: "zenplan-productivity.firebaseapp.com",
  projectId: "zenplan-productivity",
  storageBucket: "zenplan-productivity.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface User {
  name: string;
  email: string;
  avatar: string;
}

const App: React.FC = () => {
  // Entrance state
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebratedDay, setLastCelebratedDay] = useState<string>(() => {
    return localStorage.getItem('zenplan_last_celebrated') || '';
  });
  
  // User Authentication State
  const [user, setUser] = useState<User | null>(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Persistence logic for tasks and goals
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zenplan_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [weeklyGoals, setWeeklyGoals] = useState<WeeklyGoal[]>(() => {
    const saved = localStorage.getItem('zenplan_goals');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Sync Firebase Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        setUser({
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`
        });
      } else {
        setUser(null);
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('zenplan_tasks', JSON.stringify(tasks));
    
    // Check for celebration
    const todayStr = new Date().toDateString();
    const todayTasks = tasks.filter(t => new Date(t.createdAt).toDateString() === todayStr);
    
    if (todayTasks.length > 0 && 
        todayTasks.every(t => t.status === 'completed') && 
        lastCelebratedDay !== todayStr) {
      setShowCelebration(true);
      setLastCelebratedDay(todayStr);
      localStorage.setItem('zenplan_last_celebrated', todayStr);
    }
  }, [tasks, lastCelebratedDay]);

  useEffect(() => {
    localStorage.setItem('zenplan_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

  // Auth Handlers
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      console.error("Login failed:", error);
      if (error.code === 'auth/invalid-api-key' || error.code === 'auth/network-request-failed') {
        alert("Authentication failed. Please check your Firebase Configuration.");
      }
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Task Management
  const addTask = (title: string, description: string) => {
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      status: 'pending',
      progress: 0,
      createdAt: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
  };

  const updateTask = (id: string, title: string, description: string) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, title, description } : task
    ));
    setEditingTask(null);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newProgress = status === 'completed' ? 100 : (status === 'pending' && task.progress === 100 ? 50 : task.progress);
        return { ...task, status, progress: newProgress };
      }
      return task;
    }));
  };

  const updateTaskProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        let status = task.status;
        if (progress === 100) status = 'completed';
        else if (progress < 100 && status === 'completed') status = 'pending';
        return { ...task, progress, status };
      }
      return task;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // Weekly Goal Management
  const addGoal = (title: string) => {
    const newGoal: WeeklyGoal = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      isDone: false,
      createdAt: Date.now()
    };
    setWeeklyGoals([...weeklyGoals, newGoal]);
  };

  const toggleGoal = (id: string) => {
    setWeeklyGoals(prev => prev.map(g => 
      g.id === id ? { ...g, isDone: !g.isDone } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setWeeklyGoals(prev => prev.filter(g => g.id !== id));
  };

  // Stats calculation
  const stats = useMemo(() => {
    const total = tasks.length;
    const weightedDone = tasks.reduce((acc, curr) => acc + (curr.progress / 100), 0);
    const missedCount = tasks.filter(t => t.status === 'not-completed').length;
    const completedPercent = total > 0 ? Math.round((weightedDone / total) * 100) : 0;
    const remainingPercent = total > 0 ? 100 - completedPercent : 0;

    return {
      total,
      done: weightedDone,
      missed: missedCount,
      completedPercent,
      remainingPercent
    };
  }, [tasks]);

  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);
  const missedTasks = useMemo(() => tasks.filter(t => t.status === 'not-completed'), [tasks]);

  if (showWelcome) {
    return <WelcomeScreen onFinish={() => setShowWelcome(false)} />;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800 relative">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddTask={() => setShowTaskModal(true)}
        stats={stats}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
        />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          {loadingAuth ? (
            <div className="flex items-center justify-center h-full">
               <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'home' && (
            <HomeDashboard 
              tasks={tasks} 
              goals={weeklyGoals} 
              onNavigate={setActiveTab} 
              onAddTask={() => setShowTaskModal(true)}
              stats={stats}
            />
          )}
          
          {!loadingAuth && activeTab === 'board' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
              <TaskColumn 
                title="Pending Tasks" 
                icon="fa-clock" 
                tasks={pendingTasks} 
                color="indigo"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
              <TaskColumn 
                title="Completed" 
                icon="fa-circle-check" 
                tasks={completedTasks} 
                color="emerald"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
              <TaskColumn 
                title="Not Completed" 
                icon="fa-circle-xmark" 
                tasks={missedTasks} 
                color="rose"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
                onEdit={setEditingTask}
              />
            </div>
          )}
          
          {!loadingAuth && activeTab === 'goals' && (
            <WeeklyGoalSection 
              goals={weeklyGoals} 
              tasks={tasks}
              onAddGoal={addGoal} 
              onToggleGoal={toggleGoal}
              onDeleteGoal={deleteGoal}
            />
          )}
        </div>
      </main>

      {(showTaskModal || editingTask) && (
        <TaskForm 
          taskToEdit={editingTask || undefined}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }} 
          onSubmit={(title, description) => {
            if (editingTask) {
              updateTask(editingTask.id, title, description);
            } else {
              addTask(title, description);
            }
          }} 
        />
      )}

      {showCelebration && (
        <CelebrationOverlay onClose={() => setShowCelebration(false)} />
      )}
    </div>
  );
};

export default App;
