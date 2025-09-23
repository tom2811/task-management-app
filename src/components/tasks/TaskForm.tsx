import { zodResolver } from "@hookform/resolvers/zod";
import { format, startOfDay } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller, useForm, type SubmitHandler } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCreateTask } from "@/hooks/useCreateTask";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  text: z.string().min(1, "Task description cannot be empty."),
  dueDate: z
    .date()
    .min(startOfDay(new Date()), "Due date cannot be in the past.")
    .optional(),
  priority: z.enum(["low", "medium", "high"]),
});

type FormInputs = z.infer<typeof formSchema>;

export const TaskForm = () => {
  const { mutate: createTaskMutation, isPending } = useCreateTask();

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      priority: "medium",
      dueDate: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const taskData = {
      ...data,
      // Only format dueDate if it exists
      dueDate: data.dueDate ? format(data.dueDate, "yyyy-MM-dd") : undefined,
    };
    createTaskMutation(taskData);
    form.reset({
      text: "",
      priority: "medium",
      dueDate: undefined,
    });
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Task</h2>

      {/* Text Input */}
      <Controller
        name="text"
        control={form.control}
        render={({ field }) => (
          <Input
            placeholder="Task description..."
            {...field}
            disabled={isPending}
            className={form.formState.errors.text ? "border-red-500" : ""}
          />
        )}
      />
      {form.formState.errors.text && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.text.message}
        </p>
      )}

      {/* Priority Select */}
      <Controller
        name="priority"
        control={form.control}
        render={({ field }) => (
          <select
            {...field}
            className="w-full p-2 border rounded-md"
            disabled={isPending}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        )}
      />

      {/* Date Picker */}
      <Controller
        name="dueDate"
        control={form.control}
        render={({ field }) => (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !field.value && "text-muted-foreground",
                  form.formState.errors.dueDate ? "border-red-500" : ""
                )}
                disabled={isPending}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Due Date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
                fromDate={startOfDay(new Date())}
              />
            </PopoverContent>
          </Popover>
        )}
      />
      {form.formState.errors.dueDate && (
        <p className="text-red-500 text-sm">
          {form.formState.errors.dueDate.message}
        </p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Adding..." : "Add Task"}
      </Button>
    </form>
  );
};
