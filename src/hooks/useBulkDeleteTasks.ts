import { deleteTask } from "@/lib/api";
import { useTaskStore, type Task } from "@/store/taskStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useBulkDeleteTasks = () => {
  const queryClient = useQueryClient();
  const clearTaskSelection = useTaskStore((state) => state.clearTaskSelection);

  return useMutation({
    mutationFn: async (taskIds: string[]) => {
      // Execute all delete promises concurrently
      await Promise.all(taskIds.map((id) => deleteTask(id)));
    },
    onMutate: async (taskIdsToDelete) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(["tasks"]);

      // Optimistically update to remove the tasks
      queryClient.setQueryData(["tasks"], (old: Task[] | undefined) =>
        old ? old.filter((task) => !taskIdsToDelete.includes(task.id)) : []
      );

      clearTaskSelection();

      return { previousTasks };
    },
    onError: (err, _taskIdsToDelete, context) => {
      queryClient.setQueryData(["tasks"], context?.previousTasks);
      console.error("Bulk delete failed:", err);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
