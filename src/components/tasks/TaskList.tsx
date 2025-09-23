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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDeleteTask } from "@/hooks/useDeleteTask";
import { useUpdateTask } from "@/hooks/useUpdateTask";
import { isTaskOverdue } from "@/lib/task-utils";
import { cn } from "@/lib/utils";
import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleCheck,
  CircleDot,
  CircleDotDashed,
  Loader2Icon,
  MinusCircle,
} from "lucide-react";
import { useEffect, useState, type MouseEvent } from "react";
import {
  useTaskStore,
  type Task,
  type TaskPriority,
  type TaskStatus,
} from "../../store/taskStore";

const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];

const getPriorityStyles = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return "text-green-500 font-semibold";
    case "medium":
      return "text-yellow-500 font-semibold";
    case "high":
      return "text-red-500 font-semibold";
    default:
      return "";
  }
};

const getPriorityIcon = (priority: TaskPriority) => {
  switch (priority) {
    case "low":
      return <ArrowDownCircle className="h-4 w-4 ml-1" />;
    case "medium":
      return <MinusCircle className="h-4 w-4 ml-1" />;
    case "high":
      return <ArrowUpCircle className="h-4 w-4 ml-1" />;
    default:
      return null;
  }
};

const getStatusStyles = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return "text-gray-500 font-semibold";
    case "in-progress":
      return "text-blue-500 font-semibold";
    case "done":
      return "text-green-500 font-semibold";
    default:
      return "";
  }
};

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "todo":
      return <CircleDotDashed className="h-4 w-4" />;
    case "in-progress":
      return <CircleDot className="h-4 w-4" />;
    case "done":
      return <CircleCheck className="h-4 w-4" />;
    default:
      return null;
  }
};

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
  const selectedTaskIds = useTaskStore((state) => state.selectedTaskIds);
  const toggleTaskSelection = useTaskStore(
    (state) => state.toggleTaskSelection
  );

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const { mutate: deleteTaskMutation, isPending: isDeleting } = useDeleteTask();
  const { mutate: updateTaskMutation, isPending: isUpdating } = useUpdateTask();

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

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingText.trim() !== "") {
      updateTaskMutation(
        { taskId, updates: { text: editingText.trim() } },
        {
          onSuccess: () => {
            setEditingTaskId(null);
            setEditingText("");
          },
        }
      );
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation({ taskId, updates: { status: newStatus } });
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>, taskId: string) => {
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest("a")
    ) {
      return;
    }
    toggleTaskSelection(taskId);
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
      <section className="space-y-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => {
            const overdue = isTaskOverdue(task.dueDate);
            return (
              <Card
                key={task.id}
                onClick={(e) => handleCardClick(e, task.id)}
                className={cn(
                  "h-56 cursor-pointer flex flex-col",
                  task.status === "done" ? "bg-muted/50" : "",
                  overdue &&
                    task.status !== "done" &&
                    !selectedTaskIds.includes(task.id)
                    ? "border-red-500"
                    : "",
                  selectedTaskIds.includes(task.id)
                    ? "ring-2 ring-blue-500"
                    : ""
                )}
              >
                <CardHeader className="h-32 flex flex-col justify-start">
                  <div className="flex items-start space-x-2 w-full">
                    <Checkbox
                      className="cursor-pointer flex-shrink-0 mt-1"
                      checked={selectedTaskIds.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                      aria-label="Select task for bulk operation"
                    />
                    <div className="flex-1">
                      {editingTaskId === task.id ? (
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(task.id);
                            if (e.key === "Escape") handleCancelEdit();
                          }}
                          className="w-full"
                          maxLength={120}
                        />
                      ) : (
                        <CardTitle
                          className={cn(
                            "text-base leading-tight break-words hyphens-auto",
                            task.status === "done"
                              ? "line-through text-muted-foreground"
                              : "",
                            overdue && task.status !== "done"
                              ? "text-red-600"
                              : ""
                          )}
                          title={task.text}
                        >
                          {task.text}
                        </CardTitle>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-end">
                  <div className="space-y-1">
                    <p
                      className={cn(
                        "text-sm text-muted-foreground",
                        overdue && task.status !== "done"
                          ? "text-red-500 font-semibold"
                          : ""
                      )}
                    >
                      {task.dueDate ? `Due: ${task.dueDate}` : "Due: Not Set"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Priority:{" "}
                      <span
                        className={cn(
                          "inline-flex items-center",
                          getPriorityStyles(task.priority)
                        )}
                      >
                        {task.priority}
                        {getPriorityIcon(task.priority)}
                      </span>
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <Select
                      value={task.status}
                      onValueChange={(value: TaskStatus) =>
                        handleStatusChange(task.id, value)
                      }
                    >
                      <SelectTrigger className="w-auto border-none focus:ring-0 p-0 h-auto bg-transparent">
                        <SelectValue asChild>
                          <span
                            className={cn(
                              "inline-flex items-center text-sm",
                              getStatusStyles(task.status)
                            )}
                          >
                            {getStatusIcon(task.status)}
                            <span className="ml-1">
                              {task.status.replace("-", " ").toUpperCase()}
                            </span>
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem
                            key={status}
                            value={status}
                            className="cursor-pointer"
                          >
                            <div className="inline-flex items-center">
                              {getStatusIcon(status)}
                              <span className="ml-1">
                                {status.replace("-", " ").toUpperCase()}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex-shrink-0">
                      {editingTaskId === task.id ? (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSaveEdit(task.id)}
                            disabled={isUpdating || editingText === task.text}
                          >
                            {isUpdating ? (
                              <Loader2Icon className="animate-spin" />
                            ) : (
                              "Save"
                            )}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(task)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => setTaskToDelete(task)}
                          >
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

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

      {/* Alert Dialog */}
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
