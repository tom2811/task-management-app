import { getTasks } from "@/lib/api";
import { type TaskFilter } from "@/store/taskStore";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = ({
  page,
  filter,
}: {
  page: number;
  filter: TaskFilter;
}) => {
  return useQuery({
    queryKey: ["tasks", { page, filter }],
    queryFn: () => getTasks({ page, filter }),
  });
};
