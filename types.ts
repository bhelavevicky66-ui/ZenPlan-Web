
export type TaskStatus = 'pending' | 'completed' | 'not-completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  createdAt: number;
  lastUpdated?: number;
}

export interface WeeklyGoal {
  id: string;
  title: string;
  isDone: boolean;
  createdAt: number;
}

export type TabType = 'home' | 'board' | 'goals' | 'admin';

export interface AppState {
  tasks: Task[];
  weeklyGoals: WeeklyGoal[];
}

export type UserRole = 'user' | 'admin' | 'super_admin';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: UserRole;
  createdAt: number;
  tasks?: Task[];
  weeklyGoals?: WeeklyGoal[];
  moodLogs?: MoodLog[];
}

export type Mood = 'happy' | 'neutral' | 'tired';

export interface MoodLog {
  id: string;
  mood: Mood;
  timestamp: number;
  context: 'completion' | 'failure'; // When it was asked
}
