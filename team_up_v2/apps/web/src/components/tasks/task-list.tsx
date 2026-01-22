"use client";

import { trpc } from "@/lib/trpc/client";
import { TaskCard } from "./task-card";
import { TaskStatus } from "@team-up/db";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TaskListProps {
    projectId: string;
}

export function TaskList({ projectId }: TaskListProps) {
    const { data: tasks, isLoading, error } = trpc.task.listByProject.useQuery({ projectId });

    if (isLoading) return <div className="space-y-4">Loading tasks...</div>;
    if (error) return <div className="text-destructive">Error loading tasks: {error.message}</div>;

    const tasksByStatus = {
        [TaskStatus.NOT_STARTED]: tasks?.filter(t => t.status === TaskStatus.NOT_STARTED) || [],
        [TaskStatus.IN_PROGRESS]: tasks?.filter(t => t.status === TaskStatus.IN_PROGRESS) || [],
        [TaskStatus.SUBMITTED]: tasks?.filter(t => t.status === TaskStatus.SUBMITTED) || [],
        [TaskStatus.COMPLETED]: tasks?.filter(t => t.status === TaskStatus.COMPLETED) || [],
    };

    return (
        <Tabs defaultValue={TaskStatus.NOT_STARTED} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value={TaskStatus.NOT_STARTED}>Todo ({tasksByStatus[TaskStatus.NOT_STARTED].length})</TabsTrigger>
                <TabsTrigger value={TaskStatus.IN_PROGRESS}>In Progress ({tasksByStatus[TaskStatus.IN_PROGRESS].length})</TabsTrigger>
                <TabsTrigger value={TaskStatus.SUBMITTED}>Submitted ({tasksByStatus[TaskStatus.SUBMITTED].length})</TabsTrigger>
                <TabsTrigger value={TaskStatus.COMPLETED}>Completed ({tasksByStatus[TaskStatus.COMPLETED].length})</TabsTrigger>
            </TabsList>
            
            {(Object.keys(tasksByStatus) as TaskStatus[]).map((status) => (
                <TabsContent key={status} value={status} className="mt-6">
                    {tasksByStatus[status].length === 0 ? (
                        <div className="p-12 border-2 border-dashed rounded-xl text-center text-muted-foreground">
                            No tasks in this status.
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {tasksByStatus[status].map((task) => (
                                <TaskCard key={task.id} task={task} />
                            ))}
                        </div>
                    )}
                </TabsContent>
            ))}
        </Tabs>
    );
}
