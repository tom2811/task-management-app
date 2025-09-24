import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { TaskFilter as TaskFilterType } from "@/store/taskStore";
import { ListFilter } from "lucide-react";
import { useCallback } from "react";
import { useSearchParams } from "react-router-dom";

export const TaskFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const validFilters: TaskFilterType[] = ["all", "active", "completed"];
  const filter = validFilters.includes(
    searchParams.get("filter") as TaskFilterType
  )
    ? (searchParams.get("filter") as TaskFilterType)
    : "all";

  const setFilter = useCallback(
    (newFilter: TaskFilterType) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (newFilter === "all") {
          newParams.delete("filter");
        } else {
          newParams.set("filter", newFilter);
        }
        return newParams;
      });
    },
    [setSearchParams]
  );

  const handleFilterChange = (value: string) => {
    setFilter(value as TaskFilterType);
  };

  return (
    <Select value={filter} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-fit px-3 py-2 h-9 cursor-pointer">
        <ListFilter className="h-4 w-4" />
        <SelectValue placeholder="Filter Tasks" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all" className="cursor-pointer">
          All Tasks
        </SelectItem>
        <SelectItem value="active" className="cursor-pointer">
          Active Tasks
        </SelectItem>
        <SelectItem value="completed" className="cursor-pointer">
          Completed Tasks
        </SelectItem>
      </SelectContent>
    </Select>
  );
};
