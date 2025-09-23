import { isPast, parseISO } from "date-fns";

export function isTaskOverdue(dueDate: string | undefined): boolean {
  if (!dueDate) return false;
  const date = parseISO(dueDate);
  return isPast(date);
}
