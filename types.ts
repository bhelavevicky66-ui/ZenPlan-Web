
export type TaskStatus = 'pending' | 'completed' | 'not-completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  createdAt: number;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  isDone: boolean;
}

export type TabType = 'home' | 'board' | 'goals';

export interface AppState {
  tasks: Task[];
  weeklyGoals: WeeklyGoal[];
}
