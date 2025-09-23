import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ListFilter } from "lucide-react";
import {
  useTaskStore,
  type TaskFilter as TaskFilterType,
} from "../../store/taskStore";

export const TaskFilter = () => {
  const currentFilter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);

  const handleFilterChange = (value: string) => {
    setFilter(value as TaskFilterType);
  };

  return (
    <Select value={currentFilter} onValueChange={handleFilterChange}>
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
