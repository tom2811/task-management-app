import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";

export const TaskPage = () => {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <aside className="md:col-span-1">
          <TaskForm />
        </aside>
        <main className="md:col-span-2">
          <TaskList />
        </main>
      </div>
    </div>
  );
};
