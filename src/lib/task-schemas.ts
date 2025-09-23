import { startOfDay } from "date-fns";
import { z } from "zod";

export const formSchema = z.object({
  text: z
    .string()
    .min(1, "Task description cannot be empty.")
    .max(120, "Task cannot exceed 120 characters."),
  dueDate: z
    .date()
    .min(startOfDay(new Date()), "Due date cannot be in the past.")
    .optional(),
  priority: z.enum(["low", "medium", "high"]),
});
