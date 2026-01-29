
import React, { useState, useEffect, useMemo } from 'react';
import {
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { Task, WeeklyGoal, TaskStatus, TabType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import WeeklyGoalSection from './components/WeeklyGoalSection';
import HomeDashboard from './components/HomeDashboard';
import WelcomeScreen from './components/WelcomeScreen';
import CelebrationOverlay from './components/CelebrationOverlay';
import StreakCelebration from './components/StreakCelebration';
import MoodTrackerOverlay from './components/MoodTrackerOverlay';
import StarOverlay from './components/StarOverlay';
import { Mood, MoodLog } from './types';

const googleProvider = new GoogleAuthProvider();

interface User {
  name: string;
  email: string;
  avatar: string;
  uid: string;
}

const App: React.FC = () => {
  // Entrance state
  const [showWelcome, setShowWelcome] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [lastCelebratedDay, setLastCelebratedDay] = useState<string>(() => {
    return localStorage.getItem('zenplan_last_celebrated') || '';
  });

  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showStarOverlay, setShowStarOverlay] = useState(false);
  const [moodContext, setMoodContext] = useState<'completion' | 'failure'>('completion');
  const [moodLogs, setMoodLogs] = useState<MoodLog[]>(() => {
    const saved = localStorage.getItem('zenplan_moods');
    return saved ? JSON.parse(saved) : [];
  });

  // Streak State
  const [streak, setStreak] = useState<number>(() => {
    return parseInt(localStorage.getItem('zenplan_streak') || '0', 10);
  });
  const [lastStreakDate, setLastStreakDate] = useState<string>(() => {
    return localStorage.getItem('zenplan_last_streak_date') || '';
  });

  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('zenplan_theme') === 'dark' ||
        (!('zenplan_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenplan_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenplan_theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

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
  const [isDataLoaded, setIsDataLoaded] = useState(false); // New flag to prevent overwriting before load
  const [isSaving, setIsSaving] = useState(false);

  // Sync Firebase Auth State & Data Loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userData = {
          name: firebaseUser.displayName || 'User',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || '',
          uid: firebaseUser.uid
        };
        setUser(userData);

        // Load data from Firestore
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            // User exists, load and MERGE their data with any local data to avoid accidental deletion
            const data = userDoc.data();
            const cloudTasks = data.tasks || [];
            const cloudGoals = data.weeklyGoals || [];

            // Merge helper: prefer the item with the latest createdAt, and include any local-only items
            const mergeById = (localArr: any[], cloudArr: any[]) => {
              const map = new Map<string, any>();
              for (const item of cloudArr) {
                if (item && item.id) map.set(item.id, item);
              }
              for (const item of localArr) {
                if (!item) continue;
                if (!item.id) item.id = Math.random().toString(36).substr(2, 9);
                if (!map.has(item.id)) {
                  map.set(item.id, item);
                } else {
                  const existing = map.get(item.id);
                  if ((item.createdAt || 0) > (existing.createdAt || 0)) {
                    map.set(item.id, item);
                  }
                }
              }
              return Array.from(map.values());
            };

            const mergedTasks = mergeById(tasks, cloudTasks);
            const mergedGoals = mergeById(weeklyGoals, cloudGoals);

            // Update local state with merged data (this will also persist to localStorage via existing effects)
            setTasks(mergedTasks);
            setWeeklyGoals(mergedGoals);

            // If merge added any local-only items, push them back to Firestore so cloud is preserved
            if (mergedTasks.length !== cloudTasks.length || mergedGoals.length !== cloudGoals.length) {
              await setDoc(userDocRef, {
                tasks: mergedTasks,
                weeklyGoals: mergedGoals
              }, { merge: true });
            }
          } else {
            // New user (or first time logging in with this code), upload local data to init their account
            await setDoc(userDocRef, {
              tasks: tasks, // Upload current local tasks
              weeklyGoals: weeklyGoals
            }, { merge: true });
          }
        } catch (error) {
          console.error("Error loading user data:", error);
        }
      } else {
        setUser(null);
        // Optionally switch back to local storage or clear? 
        // For now, keeping current state is safer than clearing, 
        // effectively "converting" cloud data to local session if they logout, 
        // though typically you might want to clear sensitive info.
        // Let's stick to the user's "persistence" request.
      }
      setLoadingAuth(false);
      setIsDataLoaded(true);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array - runs once on mount/auth-init

  // Check for streak reset on load/day change
  useEffect(() => {
    const checkStreak = () => {
      if (!lastStreakDate) return;

      const now = new Date();
      const todayStr = now.toDateString();
      const yesterdayFn = new Date(now);
      yesterdayFn.setDate(yesterdayFn.getDate() - 1);
      const yesterdayStr = yesterdayFn.toDateString();

      // If last streak date was older than yesterday, and it's not today (meaning we haven't done today's yet), reset.
      // Actually, if we missed yesterday, streak should be 0 (or 1 if we did today's).
      // But we only want to reset if the user visits and we realize the chain is broken.

      if (lastStreakDate !== todayStr && lastStreakDate !== yesterdayStr) {
        // Chain broken
        setStreak(0);
        localStorage.setItem('zenplan_streak', '0');
      }
    };
    checkStreak();
  }, [lastStreakDate]);

  // Save to Firestore (or LocalStorage) whenever tasks/goals change
  useEffect(() => {
    const saveData = async () => {
      // Always save to local storage as backup/offline cache
      localStorage.setItem('zenplan_tasks', JSON.stringify(tasks));

      // Check for celebration & streak
      const todayStr = new Date().toDateString();
      const todayTasks = tasks.filter(t => {
        const d = new Date(t.createdAt);
        // Check if created today OR updated today (if we want activity based)
        // For strict streak, let's stick to "Tasks for Today" being completed.
        return d.toDateString() === todayStr;
      });

      if (todayTasks.length > 0 && todayTasks.every(t => t.status === 'completed')) {
        // Celebration
        if (lastCelebratedDay !== todayStr) {
          setShowCelebration(true);
          setLastCelebratedDay(todayStr);
          localStorage.setItem('zenplan_last_celebrated', todayStr);

          // Increment Streak if not already done for today
          if (lastStreakDate !== todayStr) {
            const newStreak = (lastStreakDate === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString() ? streak : 0) + 1;
            // Determine if we continue or reset (double check logic handled in effect above, but here we enforce increment validity)
            // Simple logic: If last was yesterday, streak++. Else streak=1.

            let finalStreak = 1;
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            if (lastStreakDate === yesterday.toDateString()) {
              finalStreak = streak + 1;
            }

            setStreak(finalStreak);
            setLastStreakDate(todayStr);
            localStorage.setItem('zenplan_streak', finalStreak.toString());
            localStorage.setItem('zenplan_last_streak_date', todayStr);

            // Update cloud if possible
            if (user && isDataLoaded) {
              setDoc(doc(db, 'users', user.uid), { streak: finalStreak, lastStreakDate: todayStr }, { merge: true });
            }

            // Show Streak Celebration
            setShowStreakCelebration(true);
          }
        }
      }

      // If logged in and initial load is done, save to Firestore
      if (user && isDataLoaded) {
        setIsSaving(true);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            tasks: tasks
          }, { merge: true });
        } catch (err) {
          console.error("Error saving tasks to cloud:", err);
        } finally {
          setTimeout(() => setIsSaving(false), 800); // Small delay for visual feedback
        }
      }
    };
    saveData();
  }, [tasks, lastCelebratedDay, user, isDataLoaded]);

  useEffect(() => {
    const saveGoals = async () => {
      localStorage.setItem('zenplan_goals', JSON.stringify(weeklyGoals));

      if (user && isDataLoaded) {
        setIsSaving(true);
        try {
          await setDoc(doc(db, 'users', user.uid), {
            weeklyGoals: weeklyGoals
          }, { merge: true });
        } catch (err) {
          console.error("Error saving goals to cloud:", err);
        } finally {
          setTimeout(() => setIsSaving(false), 800);
        }
      }
    };
    saveGoals();
  }, [weeklyGoals, user, isDataLoaded]);

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
      // Ensure latest local data is saved to the user's Firestore doc before signing out
      if (user && isDataLoaded) {
        try {
          await setDoc(doc(db, 'users', user.uid), {
            tasks,
            weeklyGoals
          }, { merge: true });
        } catch (err) {
          console.error("Error saving data before logout:", err);
          // Continue to sign out even if saving fails to avoid locking the user out
        }
      }

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
      lastUpdated: Date.now(),
    };
    setTasks([newTask, ...tasks]);
    setShowTaskModal(false);
  };

  const updateTask = (id: string, title: string, description: string) => {
    setTasks(prev => prev.map(task =>
      task.id === id ? { ...task, title, description, lastUpdated: Date.now() } : task
    ));
    setEditingTask(null);
  };

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        const newProgress = status === 'completed' ? 100 : (status === 'pending' && task.progress === 100 ? 50 : task.progress);
        return { ...task, status, progress: newProgress, lastUpdated: Date.now() };
      }
      return task;
    }));

    // Show Star Rating Update only on completion
    if (status === 'completed') {
      setShowStarOverlay(true);
    }

    if (status === 'completed') {
      const hasRecentLog = moodLogs.some(log => Date.now() - log.timestamp < 1000 * 60 * 5); // 5 mins cooldown
      if (!hasRecentLog) {
        setMoodContext('completion');
        setShowMoodTracker(true);
      }
    }
  };

  const updateTaskProgress = (id: string, progress: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        let status = task.status;
        if (progress === 100) status = 'completed';
        else if (progress < 100 && status === 'completed') status = 'pending';
        return { ...task, progress, status, lastUpdated: Date.now() };
      }
      return task;
    }));

    // Show Star Rating Update only on completion
    if (progress === 100) {
      setShowStarOverlay(true);

      const hasRecentLog = moodLogs.some(log => Date.now() - log.timestamp < 1000 * 60 * 5);
      if (!hasRecentLog) {
        setMoodContext('completion');
        setShowMoodTracker(true);
      }
    }
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
    <div className={`flex min-h-screen relative transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-[#F8FAFC] text-slate-800'}`}>
      {/* Overlays */}
      {showCelebration && <CelebrationOverlay onClose={() => setShowCelebration(false)} />}
      {showStreakCelebration && <StreakCelebration streak={streak} onClose={() => setShowStreakCelebration(false)} />}
      {showStarOverlay && <StarOverlay percentage={stats.completedPercent} onClose={() => setShowStarOverlay(false)} />}
      {showMoodTracker && (
        <MoodTrackerOverlay
          context={moodContext}
          onClose={() => setShowMoodTracker(false)}
          onSelect={(mood) => {
            const newLog: MoodLog = {
              id: Math.random().toString(36).substr(2, 9),
              mood,
              timestamp: Date.now(),
              context: moodContext
            };
            setMoodLogs(prev => {
              const updated = [...prev, newLog];
              localStorage.setItem('zenplan_moods', JSON.stringify(updated));
              // Also sync to cloud if needed
              if (user && isDataLoaded) {
                setDoc(doc(db, 'users', user.uid), { moodLogs: updated }, { merge: true });
              }
              return updated;
            });
            setShowMoodTracker(false);
          }}
        />
      )}

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onAddTask={() => setShowTaskModal(true)}
        stats={stats}
        streak={streak}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          user={user}
          onLogin={handleLogin}
          onLogout={handleLogout}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          isSaving={isSaving}
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
