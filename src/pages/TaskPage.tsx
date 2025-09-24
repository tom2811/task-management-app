import { BulkActions } from "@/components/tasks/BulkActions";
import { TaskFilter } from "@/components/tasks/TaskFilter";
import { TaskFormModal } from "@/components/tasks/TaskFormModal";
import { TaskList } from "@/components/tasks/TaskList";
import { useGetTasks } from "@/hooks/useGetTasks";
import type { TaskFilter as TaskFilterType } from "@/store/taskStore";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const TaskPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const validFilters: TaskFilterType[] = ["all", "active", "completed"];
  const filter = validFilters.includes(
    searchParams.get("filter") as TaskFilterType
  )
    ? (searchParams.get("filter") as TaskFilterType)
    : "all";

  const setPage = useCallback(
    (newPage: number) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newPage === 1) {
          newParams.delete("page");
        } else {
          newParams.set("page", newPage.toString());
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const { data, isLoading, isError, error, refetch } = useGetTasks({
    page,
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
        page={page}
        setPage={setPage}
        isLoading={isLoading}
        isError={isError}
        error={error}
        refetch={refetch}
        filter={filter}
      />
    </div>
  );
};
