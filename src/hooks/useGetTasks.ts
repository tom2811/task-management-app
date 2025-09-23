import { getTasks } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });
};
