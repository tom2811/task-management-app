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
  filter: TaskFilter;
  selectedTaskIds: string[];
  setFilter: (filter: TaskFilter) => void;
  toggleTaskSelection: (taskId: string) => void;
  clearTaskSelection: () => void;
}

export const useTaskStore = create<StoreState>((set) => ({
  tasks: [],
  filter: (localStorage.getItem("task-filter") as TaskFilter) || "all",
  selectedTaskIds: [],

  setFilter: (filter) => {
    localStorage.setItem("task-filter", filter);
    set(() => ({ filter }));
  },

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
