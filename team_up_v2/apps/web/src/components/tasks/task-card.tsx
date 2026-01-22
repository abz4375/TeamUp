"use client";

import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paperclip, Clock, MoreVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { TaskStatus } from "@team-up/db";
import { cn } from "@/lib/utils";
import { trpc } from "@/lib/trpc/client";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskDetailDialog } from "./task-detail-dialog";

interface TaskCardProps {
    task: {
        id: string;
        projectId: string;
        description: string;
        status: TaskStatus;
        createdAt: Date;
        assignees: {
            user: {
                name: string;
                image: string | null;
            }
        }[];
        _count: {
            attachments: number;
            approvals: number;
        }
    };
}

export function TaskCard({ task }: TaskCardProps) {
    const utils = trpc.useUtils();
    const [detailOpen, setDetailOpen] = useState(false);
    
    const { mutate: updateStatus } = trpc.task.update.useMutation({
        onSuccess: () => {
            utils.task.listByProject.invalidate({ projectId: task.projectId });
        }
    });

    const statusColors = {
        [TaskStatus.NOT_STARTED]: "bg-slate-500/10 text-slate-500 border-slate-500/20",
        [TaskStatus.IN_PROGRESS]: "bg-blue-500/10 text-blue-500 border-blue-500/20",
        [TaskStatus.SUBMITTED]: "bg-amber-500/10 text-amber-500 border-amber-500/20",
        [TaskStatus.COMPLETED]: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    };

    const handleStatusChange = (e: React.MouseEvent, status: TaskStatus) => {
        e.stopPropagation();
        updateStatus({ id: task.id, status });
    };

    return (
        <>
            <Card 
                className="hover:shadow-md transition-shadow cursor-pointer relative"
                onClick={() => setDetailOpen(true)}
            >
                <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start gap-2">
                        <Badge variant="outline" className={cn("text-[10px] uppercase font-bold", statusColors[task.status])}>
                            {task.status.replace("_", " ")}
                        </Badge>
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, TaskStatus.NOT_STARTED)}>
                                    Set Todo
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, TaskStatus.IN_PROGRESS)}>
                                    Set In Progress
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, TaskStatus.SUBMITTED)}>
                                    Submit for Approval
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleStatusChange(e, TaskStatus.COMPLETED)}>
                                    Mark Completed
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                    <p className="text-sm line-clamp-3 leading-relaxed mb-4">
                        {task.description}
                    </p>
                    
                    <div className="flex -space-x-2 overflow-hidden">
                        {task.assignees.slice(0, 3).map((assignee, i) => (
                            <div 
                                key={i} 
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold"
                                title={assignee.user.name}
                            >
                                {(assignee.user.name || "U").charAt(0)}
                            </div>
                        ))}
                        {task.assignees.length > 3 && (
                            <div className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-muted flex items-center justify-center text-[10px] font-bold">
                                +{task.assignees.length - 3}
                            </div>
                        )}
                    </div>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex justify-between items-center text-muted-foreground text-[10px]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <Paperclip className="w-3 h-3" />
                            {task._count.attachments}
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(task.createdAt), { addSuffix: true })}
                    </div>
                </CardFooter>
            </Card>

            <TaskDetailDialog 
                taskId={task.id} 
                open={detailOpen} 
                onOpenChange={setDetailOpen} 
            />
        </>
    );
}
