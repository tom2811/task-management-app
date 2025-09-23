import { updateTask } from "@/lib/api";
import { type Task } from "@/store/taskStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      taskId,
      updates,
    }: {
      taskId: string;
      updates: Partial<Task>;
    }) => updateTask(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
