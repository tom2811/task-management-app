import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { type Task } from "../../store/taskStore";
import { TaskCard } from "./TaskCard";

interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}

export const TaskList = ({
  tasks,
  totalCount,
  page,
  setPage,
  isLoading,
  isError,
  error,
  refetch,
}: TaskListProps) => {
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();

  useEffect(() => {
    if (!isLoading && tasks.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [tasks.length, page, setPage, isLoading]);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTaskMutation(taskToDelete.id, {
        onSuccess: () => {
          setTaskToDelete(null);
        },
      });
    }
  };

  const tasksPerPage = 6;
  const totalPages = Math.ceil(totalCount / tasksPerPage);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2Icon className="animate-spin h-12 w-12 text-gray-500" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center text-red-500 border-2 border-red-200 bg-red-50 rounded-lg p-8">
          <h3 className="text-2xl font-semibold mb-4">Error Loading Tasks</h3>
          <p className="text-lg mb-6">{error?.message}</p>
          <Button onClick={() => refetch()} variant="destructive">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <h3 className="text-lg font-semibold">No tasks found.</h3>
        <p>Add a new task to get started!</p>
      </div>
    );
  }

  return (
    <>
      {/* Task Grid */}
      <section className="space-y-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onDelete={() => setTaskToDelete(task)}
            />
          ))}
        </div>
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8">
        <Button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          variant="outline"
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
          variant="outline"
        >
          Next
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!taskToDelete}
        onOpenChange={(isOpen) => !isOpen && setTaskToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              task:
              <span className="font-semibold block mt-2 break-all">
                {"`"}
                {taskToDelete?.text && taskToDelete.text.length > 50
                  ? `${taskToDelete.text.slice(0, 30)}...`
                  : taskToDelete?.text}
                {"`"}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                "Confirm"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
