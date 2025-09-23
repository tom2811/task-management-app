import {
  ArrowDownCircle,
  ArrowUpCircle,
  CircleCheck,
  CircleDot,
  CircleDotDashed,
  MinusCircle,
} from "lucide-react";
import type { JSX } from "react";
import { type TaskPriority, type TaskStatus } from "../store/taskStore";

export const statusOptions: TaskStatus[] = ["todo", "in-progress", "done"];

export const priorityConfig: Record<
  TaskPriority,
  { styles: string; icon: JSX.Element }
> = {
  low: {
    styles: "text-green-500 font-semibold",
    icon: <ArrowDownCircle className="h-4 w-4 ml-1" />,
  },
  medium: {
    styles: "text-yellow-500 font-semibold",
    icon: <MinusCircle className="h-4 w-4 ml-1" />,
  },
  high: {
    styles: "text-red-500 font-semibold",
    icon: <ArrowUpCircle className="h-4 w-4 ml-1" />,
  },
};

export const statusConfig: Record<
  TaskStatus,
  { styles: string; icon: JSX.Element }
> = {
  todo: {
    styles: "text-gray-500 font-semibold",
    icon: <CircleDotDashed className="h-4 w-4" />,
  },
  "in-progress": {
    styles: "text-blue-500 font-semibold",
    icon: <CircleDot className="h-4 w-4" />,
  },
  done: {
    styles: "text-green-500 font-semibold",
    icon: <CircleCheck className="h-4 w-4" />,
  },
};
