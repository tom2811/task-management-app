import { type Task } from "../store/taskStore";

const API_BASE_URL = "http://localhost:3001/tasks";

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  return response.json();
};

export const getTasks = async (): Promise<Task[]> => {
  const response = await fetch(API_BASE_URL);
  return handleResponse(response);
};

export const createTask = async (
  task: Omit<Task, "id" | "status">
): Promise<Task> => {
  const newTaskData = { ...task, status: "todo" };
  const response = await fetch(API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTaskData),
  });
  return handleResponse(response);
};

export const updateTask = async (
  taskId: string,
  updates: Partial<Task>
): Promise<Task> => {
  const response = await fetch(`${API_BASE_URL}/${taskId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });
  return handleResponse(response);
};

export const deleteTask = async (taskId: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${taskId}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
};
