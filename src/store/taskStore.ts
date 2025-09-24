import { create } from "zustand";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";
export type TaskFilter = "all" | "active" | "completed";

export interface Task {
  id: string;
  text: string;
  dueDate?: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface StoreState {
  tasks: Task[];
  selectedTaskIds: string[];
  toggleTaskSelection: (taskId: string) => void;
  clearTaskSelection: () => void;
}

export const useTaskStore = create<StoreState>((set) => ({
  tasks: [],
  selectedTaskIds: [],

  toggleTaskSelection: (taskId) => {
    set((state) => ({
      selectedTaskIds: state.selectedTaskIds.includes(taskId)
        ? state.selectedTaskIds.filter((id) => id !== taskId)
        : [...state.selectedTaskIds, taskId],
    }));
  },

  clearTaskSelection: () => {
    set({ selectedTaskIds: [] });
  },
}));
