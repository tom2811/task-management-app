import { BulkActions } from "@/components/tasks/BulkActions";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskList } from "@/components/tasks/TaskList";
import { useGetTasks } from "@/hooks/useGetTasks";
import { useTaskStore } from "@/store/taskStore";
import { useState } from "react";

export const TaskPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const filter = useTaskStore((state) => state.filter);

  const { data, isLoading, isError, error, refetch } = useGetTasks({
    page: currentPage,
    filter,
  });

  const tasks = data?.tasks || [];
  const totalCount = data?.totalCount || 0;

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

      <TaskList
        tasks={tasks}
        totalCount={totalCount}
        page={currentPage}
        setPage={setCurrentPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
      />
    </div>
  );
};
