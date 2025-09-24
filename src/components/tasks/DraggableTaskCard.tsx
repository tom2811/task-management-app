import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { type Task } from "../../store/taskStore";
import { TaskCard } from "./TaskCard";

interface DraggableTaskCardProps {
  task: Task;
  onDelete: () => void;
}

export const DraggableTaskCard = ({
  task,
  onDelete,
}: DraggableTaskCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="relative group">
      <div ref={setNodeRef} style={style} className="touch-none">
        <TaskCard task={task} onDelete={onDelete} />
      </div>
      <div
        {...attributes}
        {...listeners}
        className="absolute top-5 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing bg-white/80 rounded p-1 shadow-sm"
        title="Drag to reorder"
      >
        <GripVertical className="h-4 w-4 text-gray-500" />
      </div>
    </div>
  );
};
