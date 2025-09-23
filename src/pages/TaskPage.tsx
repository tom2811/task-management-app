import { BulkActions } from "@/components/tasks/BulkActions";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskForm } from "@/components/tasks/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useGetTasks } from "@/hooks/useGetTasks";

export const TaskPage = () => {
  const { data: tasks, isLoading, isError, error } = useGetTasks();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 md:p-8 text-center text-red-500">
        <h1 className="text-3xl font-bold tracking-tight">Task Management</h1>
        <p className="text-muted-foreground">
          Error loading tasks: {error?.message}
        </p>
      </div>
    );
  }

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
          <div className="mb-4">
            <TaskFilter />
            <BulkActions />
          </div>
          <TaskList tasks={tasks || []} />
        </main>
      </div>
    </div>
  );
};
