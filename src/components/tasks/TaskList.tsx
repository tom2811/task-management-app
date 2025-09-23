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
import { useState } from "react";
import { useTaskStore, type Task } from "../../store/taskStore";

export const TaskList = () => {
  const tasks = useTaskStore((state) => state.tasks);
  const deleteTask = useTaskStore((state) => state.deleteTask);
  const toggleTaskStatus = useTaskStore((state) => state.toggleTaskStatus);

  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask(taskToDelete.id);
      setTaskToDelete(null);
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-500 mt-12">
        <h3 className="text-lg font-semibold">No Tasks Yet</h3>
        <p>Add a new task using the form to get started!</p>
      </div>
    );
  }

  return (
    <>
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Your Tasks</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tasks.map((task) => (
            <Card
              key={task.id}
              className={task.status === "done" ? "bg-muted/50" : ""}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-4">
                <CardTitle
                  className={`text-lg ${
                    task.status === "done"
                      ? "line-through text-muted-foreground"
                      : ""
                  }`}
                >
                  {task.text}
                </CardTitle>
                <Checkbox
                  aria-label={`Mark task ${task.text} as complete`}
                  checked={task.status === "done"}
                  onCheckedChange={() => toggleTaskStatus(task.id)}
                />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Due: {task.dueDate}
                </p>
                <p className="text-sm text-muted-foreground">
                  Priority:{" "}
                  <span className="font-medium text-primary">
                    {task.priority}
                  </span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Status:{" "}
                  <span className="font-medium text-primary">
                    {task.status}
                  </span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setTaskToDelete(task)}
                >
                  Delete
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

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
