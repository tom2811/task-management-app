import { Button } from "@/components/ui/button";
import {
  useTaskStore,
  type TaskFilter as TaskFilterType,
} from "../../store/taskStore";

export const TaskFilter = () => {
  const currentFilter = useTaskStore((state) => state.filter);
  const setFilter = useTaskStore((state) => state.setFilter);

  const handleFilterChange = (filter: TaskFilterType) => {
    setFilter(filter);
  };

  return (
    <div className="flex space-x-2 mb-4">
      <Button
        variant={currentFilter === "all" ? "secondary" : "outline"}
        onClick={() => handleFilterChange("all")}
      >
        All
      </Button>
      <Button
        variant={currentFilter === "active" ? "secondary" : "outline"}
        onClick={() => handleFilterChange("active")}
      >
        Active
      </Button>
      <Button
        variant={currentFilter === "completed" ? "secondary" : "outline"}
        onClick={() => handleFilterChange("completed")}
      >
        Completed
      </Button>
    </div>
  );
};
