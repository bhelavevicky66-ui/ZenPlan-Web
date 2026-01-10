
import React, { useState, useEffect, useMemo } from 'react';
import { Task, WeeklyGoal, TaskStatus, TabType } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import TaskColumn from './components/TaskColumn';
import TaskForm from './components/TaskForm';
import WeeklyGoalSection from './components/WeeklyGoalSection';
import HomeDashboard from './components/HomeDashboard';

const App: React.FC = () => {
  // Persistence logic
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

  useEffect(() => {
    localStorage.setItem('zenplan_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zenplan_goals', JSON.stringify(weeklyGoals));
  }, [weeklyGoals]);

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

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === id) {
        // If moving to complete, we assume 100% unless user manually adjusted slider before
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

  // Stats calculation including weighted progress
  const stats = useMemo(() => {
    const total = tasks.length;
    // Total weighted completion (0 to total tasks)
    const weightedDone = tasks.reduce((acc, curr) => acc + (curr.progress / 100), 0);
    const missedCount = tasks.filter(t => t.status === 'not-completed').length;
    
    // Percentage split for the whole board
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

  // Filters for Board View
  const pendingTasks = useMemo(() => tasks.filter(t => t.status === 'pending'), [tasks]);
  const completedTasks = useMemo(() => tasks.filter(t => t.status === 'completed'), [tasks]);
  const missedTasks = useMemo(() => tasks.filter(t => t.status === 'not-completed'), [tasks]);

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-800">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onAddTask={() => setShowTaskModal(true)}
        stats={stats}
      />
      
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header onAddTask={() => setShowTaskModal(true)} />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-10 custom-scrollbar">
          {activeTab === 'home' && (
            <HomeDashboard 
              tasks={tasks} 
              goals={weeklyGoals} 
              onNavigate={setActiveTab} 
              onAddTask={() => setShowTaskModal(true)}
              stats={stats}
            />
          )}
          
          {activeTab === 'board' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right-4 duration-500">
              <TaskColumn 
                title="Pending Tasks" 
                icon="fa-clock" 
                tasks={pendingTasks} 
                color="indigo"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
              />
              <TaskColumn 
                title="Completed" 
                icon="fa-circle-check" 
                tasks={completedTasks} 
                color="emerald"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
              />
              <TaskColumn 
                title="Not Completed" 
                icon="fa-circle-xmark" 
                tasks={missedTasks} 
                color="rose"
                onStatusChange={updateTaskStatus}
                onProgressChange={updateTaskProgress}
                onDelete={deleteTask}
              />
            </div>
          )}
          
          {activeTab === 'goals' && (
            <WeeklyGoalSection 
              goals={weeklyGoals} 
              onAddGoal={addGoal} 
              onToggleGoal={toggleGoal}
              onDeleteGoal={deleteGoal}
            />
          )}
        </div>
      </main>

      {showTaskModal && (
        <TaskForm 
          onClose={() => setShowTaskModal(false)} 
          onSubmit={addTask} 
        />
      )}
    </div>
  );
};

export default App;
