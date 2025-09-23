import { type Task, type TaskFilter } from "../store/taskStore";

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

export interface GetTasksResult {
  tasks: Task[];
  totalCount: number;
}

const handleGetTasksResponse = async (
  response: Response
): Promise<GetTasksResult> => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }
  const tasks = await response.json();
  const totalCount = Number(
    response.headers.get("X-Total-Count") || tasks.length
  );
  return { tasks, totalCount };
};

export const getTasks = async ({
  page = 1,
  filter = "all",
}: {
  page: number;
  filter: TaskFilter;
}): Promise<GetTasksResult> => {
  const tasksPerPage = 6;
  let url = `${API_BASE_URL}?_sort=id&_order=desc&_page=${page}&_limit=${tasksPerPage}`;

  if (filter === "active") {
    url += `&status_ne=done`;
  } else if (filter === "completed") {
    url += `&status=done`;
  }

  const response = await fetch(url);
  return handleGetTasksResponse(response);
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
