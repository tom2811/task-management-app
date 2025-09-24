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
import { useReorderTasks } from "@/hooks/useReorderTasks";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { type Task, type TaskFilter } from "../../store/taskStore";
import { DraggableTaskCard } from "./DraggableTaskCard";

interface TaskListProps {
  tasks: Task[];
  totalCount: number;
  page: number;
  setPage: (page: number) => void;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
  filter: TaskFilter;
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
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();
  const { mutate: reorderTasksMutation, isPending: isReordering } =
    useReorderTasks();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (!isLoading && tasks.length === 0 && page > 1) {
      setPage(page - 1);
    }
  }, [tasks.length, page, setPage, isLoading]);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = localTasks.findIndex((task) => task.id === active.id);
      const newIndex = localTasks.findIndex((task) => task.id === over.id);

      const reorderedTasks = arrayMove(localTasks, oldIndex, newIndex);
      setLocalTasks(reorderedTasks);

      // Persist the new order
      reorderTasksMutation({
        reorderedTasks,
        originalTasks: tasks,
      });
    }
  };

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
      {/* Task Grid with Drag and Drop */}
      <section className="space-y-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={localTasks.map((task) => task.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {localTasks.map((task) => (
                <DraggableTaskCard
                  key={task.id}
                  task={task}
                  onDelete={() => setTaskToDelete(task)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {isReordering && (
          <div className="flex justify-center items-center py-2">
            <Loader2Icon className="animate-spin h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-500">Saving order...</span>
          </div>
        )}
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center space-x-4 mt-8 md:mt-18">
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
