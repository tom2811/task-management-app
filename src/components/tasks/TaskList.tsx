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
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { ArrowDownCircle, ArrowUpCircle, MinusCircle } from "lucide-react";
import { useState } from "react";
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

interface TaskListProps {
  tasks: Task[];
}

export const TaskList = ({ tasks }: TaskListProps) => {
  const filter = useTaskStore((state) => state.filter);
  const selectedTaskIds = useTaskStore((state) => state.selectedTaskIds);
  const toggleTaskSelection = useTaskStore(
    (state) => state.toggleTaskSelection
  );

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");

  const { mutate: deleteTaskMutation } = useDeleteTask();
  const { mutate: updateTaskMutation } = useUpdateTask();

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTaskMutation(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (taskId: string) => {
    if (editingText.trim() !== "") {
      updateTaskMutation({ taskId, updates: { text: editingText.trim() } });
      setEditingTaskId(null);
      setEditingText("");
    }
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setEditingText("");
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskMutation({ taskId, updates: { status: newStatus } });
  };

  // Filtering logic
  const filteredTasks = tasks.filter((task) => {
    if (filter === "all") return true;
    if (filter === "active") return task.status !== "done";
    if (filter === "completed") return task.status === "done";
    return true;
  });

  if (filteredTasks.length === 0) {
    let emptyMessage = "No tasks yet. Add one above!";
    if (filter === "active") emptyMessage = "No active tasks.";
    if (filter === "completed") emptyMessage = "No completed tasks.";

    return (
      <div className="text-center text-gray-500 mt-12">
        <h3 className="text-lg font-semibold">{emptyMessage}</h3>
        {filter === "all" && (
          <p>Add a new task using the form to get started!</p>
        )}
      </div>
    );
  }

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => {
            const overdue = isTaskOverdue(task.dueDate);
            return (
              <Card
                key={task.id}
                className={cn(
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
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={selectedTaskIds.includes(task.id)}
                      onCheckedChange={() => toggleTaskSelection(task.id)}
                      aria-label="Select task for bulk operation"
                    />
                    {editingTaskId === task.id ? (
                      <Input
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleSaveEdit(task.id);
                          if (e.key === "Escape") handleCancelEdit();
                        }}
                        className="mr-2"
                      />
                    ) : (
                      <CardTitle
                        className={cn(
                          `text-lg`,
                          task.status === "done"
                            ? "line-through text-muted-foreground"
                            : "",
                          overdue && task.status !== "done"
                            ? "text-red-600"
                            : ""
                        )}
                      >
                        {task.text}
                      </CardTitle>
                    )}
                  </div>

                  <Select
                    value={task.status}
                    onValueChange={(value: TaskStatus) =>
                      handleStatusChange(task.id, value)
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.replace("-", " ").toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardHeader>
                <CardContent>
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
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  {editingTaskId === task.id ? (
                    <>
                      <Button size="sm" onClick={() => handleSaveEdit(task.id)}>
                        Save
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setTaskToDelete(task)}
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </section>

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
              <span className="font-semibold block mt-2">
                "{taskToDelete?.text}"
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
