import { BulkActions } from "@/components/tasks/BulkActions";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskList } from "@/components/tasks/TaskList";
import { useGetTasks } from "@/hooks/useGetTasks";
import { useTaskStore } from "@/store/taskStore";
import { useEffect, useState } from "react";

export const TaskPage = () => {
  const getInitialPage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pageParam = urlParams.get("page");
    return pageParam ? Math.max(1, parseInt(pageParam, 10)) : 1;
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const filter = useTaskStore((state) => state.filter);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (currentPage === 1) {
      url.searchParams.delete("page");
    } else {
      url.searchParams.set("page", currentPage.toString());
    }
    window.history.replaceState({}, "", url.toString());
  }, [currentPage]);

  const { data, isLoading, isError, error, refetch } = useGetTasks({
    page: currentPage,
    filter,
  });

  const tasks = data?.tasks || [];
  const totalCount = data?.totalCount || 0;

  return (
    <div className="container mx-auto p-4 pt-0">
      <header className="sticky top-0 z-10 bg-background flex items-center justify-between py-4 border-b">
        <h1 className="text-2xl font-bold tracking-wide">Task Management</h1>
        <TaskFormModal />
      </header>

      <div className="flex flex-row items-center justify-end my-8 space-y-0 space-x-2">
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
