import { createTask } from "@/lib/api";
import { type Task } from "@/store/taskStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (task: Omit<Task, "id" | "status">) => createTask(task),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
