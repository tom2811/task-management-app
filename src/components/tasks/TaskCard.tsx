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
import { useUpdateTask } from "@/hooks/useUpdateTask";
import {
  priorityConfig,
  statusConfig,
  statusOptions,
} from "@/lib/task-configs";
import { isTaskOverdue } from "@/lib/task-utils";
import { cn } from "@/lib/utils";
import { Loader2Icon } from "lucide-react";
import { useState, type MouseEvent } from "react";
import {
  useTaskStore,
  type Task,
  type TaskStatus,
} from "../../store/taskStore";

interface TaskCardProps {
  task: Task;
  onDelete: () => void;
}

export const TaskCard = ({ task, onDelete }: TaskCardProps) => {
  const { selectedTaskIds, toggleTaskSelection } = useTaskStore();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const { mutate: updateTaskMutation, isPending: isUpdating } = useUpdateTask();

  const handleSaveEdit = () => {
    if (editedText.trim() && editedText.trim() !== task.text) {
      updateTaskMutation(
        { taskId: task.id, updates: { text: editedText.trim() } },
        {
          onSuccess: () => setIsEditing(false),
        }
      );
    } else {
      setIsEditing(false);
      setEditedText(task.text);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedText(task.text);
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    updateTaskMutation({ taskId: task.id, updates: { status: newStatus } });
  };

  const handleCardClick = (e: MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button, input, a, [role="combobox"], [role="option"]')
    ) {
      return;
    }
    toggleTaskSelection(task.id);
  };

  const overdue = isTaskOverdue(task.dueDate);

  return (
    <Card
      onClick={handleCardClick}
      className={cn(
        "h-56 cursor-pointer flex flex-col",
        task.status === "done" ? "bg-muted/50" : "",
        overdue && task.status !== "done" && !selectedTaskIds.includes(task.id)
          ? "border-red-500"
          : "",
        selectedTaskIds.includes(task.id) ? "ring-2 ring-blue-500" : ""
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
            {isEditing ? (
              <Input
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
                className="w-full"
                maxLength={120}
                autoFocus
              />
            ) : (
              <CardTitle
                className={cn(
                  "text-base leading-tight break-words hyphens-auto",
                  task.status === "done"
                    ? "line-through text-muted-foreground"
                    : "",
                  overdue && task.status !== "done" ? "text-red-600" : ""
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
                priorityConfig[task.priority].styles
              )}
            >
              {task.priority}
              {priorityConfig[task.priority].icon}
            </span>
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Select
            value={task.status}
            onValueChange={(value: TaskStatus) => handleStatusChange(value)}
          >
            <SelectTrigger className="w-auto border-none focus:ring-0 p-0 h-auto bg-transparent">
              <SelectValue asChild>
                <span
                  className={cn(
                    "inline-flex items-center text-sm",
                    statusConfig[task.status].styles
                  )}
                >
                  {statusConfig[task.status].icon}
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
                    {statusConfig[status].icon}
                    <span className="ml-1">
                      {status.replace("-", " ").toUpperCase()}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex-shrink-0">
            {isEditing ? (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveEdit}
                  disabled={isUpdating || editedText === task.text}
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
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={onDelete}>
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
