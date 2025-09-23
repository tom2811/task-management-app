import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
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
import { cn } from "@/lib/utils";
import { useTaskStore } from "../../store/taskStore";

const formSchema = z.object({
  text: z.string().min(1, "Task description cannot be empty."),
  dueDate: z.date(),
  priority: z.enum(["low", "medium", "high"]),
});

type FormInputs = z.infer<typeof formSchema>;

export const TaskForm = () => {
  const addTask = useTaskStore((state) => state.addTask);

  const form = useForm<FormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: "",
      priority: "medium",
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const taskData = {
      ...data,
      dueDate: format(data.dueDate, "yyyy-MM-dd"),
    };
    addTask(taskData);
    form.reset();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-xl font-semibold">Add New Task</h2>

      {/* Text Input */}
      <Controller
        name="text"
        control={form.control}
        render={({ field }) => (
          <Input placeholder="Task description..." {...field} />
        )}
      />

      {/* Priority Select */}
      <Controller
        name="priority"
        control={form.control}
        render={({ field }) => (
          <select {...field} className="w-full p-2 border rounded-md">
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
                  !field.value && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? (
                  format(field.value, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        )}
      />

      <Button type="submit" className="w-full">
        Add Task
      </Button>
    </form>
  );
};
