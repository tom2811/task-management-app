import { BulkActions } from "@/components/tasks/BulkActions";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
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
    <div className="container mx-auto p-4">
      <header className="flex items-center justify-between pb-4 border-b">
        <h1 className="text-2xl font-bold tracking-wide">Task Management</h1>
        <TaskFormModal />
      </header>

      <div className="flex flex-row items-center justify-end my-6 space-y-0 space-x-2">
        <BulkActions />
        <TaskFilter />
      </div>

      <TaskList tasks={tasks || []} />
    </div>
  );
};
