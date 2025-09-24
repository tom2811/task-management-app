import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reorderTasksOnPage } from "../lib/api";
import { type Task } from "../store/taskStore";

interface ReorderTasksParams {
  reorderedTasks: Task[];
  originalTasks: Task[];
}

export const useReorderTasks = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ reorderedTasks, originalTasks }: ReorderTasksParams) =>
      reorderTasksOnPage(reorderedTasks, originalTasks),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Failed to reorder tasks:", error);
    },
  });
};
