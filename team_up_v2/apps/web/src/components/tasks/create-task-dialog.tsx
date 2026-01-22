"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTaskSchema, type CreateTaskInput } from "@team-up/validation";
import { trpc } from "@/lib/trpc/client";
import { Plus } from "lucide-react";
import { TaskAssigneeSelect } from "./task-assignee-select";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateTaskDialogProps {
    projectId: string;
}

export function CreateTaskDialog({ projectId }: CreateTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const utils = trpc.useUtils();

    const { mutate: createTask, isPending } = trpc.task.create.useMutation({
        onSuccess: () => {
            utils.task.listByProject.invalidate({ projectId });
            setOpen(false);
            reset();
        },
        onError: (error) => {
            alert(`Error creating task: ${error.message}`);
        }
    });

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateTaskInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            projectId,
            description: "",
            assigneeIds: [],
        }
    });

    const onSubmit = (data: CreateTaskInput) => {
        createTask(data);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="gap-2">
                    <Plus className="w-4 h-4" />
                    Add Task
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Describe the task that needs to be done.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="description">Task Description</Label>
                        <Textarea
                            id="description"
                            placeholder="e.g. Implement the user authentication flow..."
                            className="min-h-[100px]"
                            {...register("description")}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description.message}</p>
                        )}
                    </div>
                    
                    <div className="grid gap-2">
                        <Label>Assignees</Label>
                        <Controller
                            control={control}
                            name="assigneeIds"
                            render={({ field }) => (
                                <TaskAssigneeSelect
                                    projectId={projectId}
                                    selectedUserIds={field.value || []}
                                    onChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    
                    <DialogFooter>
                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Creating..." : "Create Task"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
