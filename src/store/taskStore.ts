import { create } from "zustand";

export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in-progress" | "done";

export interface Task {
  id: string;
  text: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface StoreState {
  tasks: Task[];
  addTask: (task: Omit<Task, "id" | "status">) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskStatus: (taskId: string) => void;
}

export const useTaskStore = create<StoreState>((set) => ({
  tasks: [], // Initial state

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: crypto.randomUUID(),
      status: "todo",
    };
    set((state) => ({ tasks: [...state.tasks, newTask] }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

  toggleTaskStatus: (taskId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, status: task.status === "done" ? "todo" : "done" }
          : task
      ),
    }));
  },
}));
