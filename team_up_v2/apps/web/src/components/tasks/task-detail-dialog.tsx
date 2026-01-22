"use client";

import { useState } from "react";
import { trpc } from "@/lib/trpc/client";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Paperclip, FileIcon, Loader2, Download } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { TaskAssigneeSelect } from "./task-assignee-select";

interface TaskDetailDialogProps {
    taskId: string;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
    const utils = trpc.useUtils();
    const [isUploading, setIsUploading] = useState(false);

    const { data: task, isLoading: isLoadingTask } = trpc.task.byId.useQuery(
        { id: taskId },
        { enabled: open }
    );

    const { mutateAsync: getUploadUrl } = trpc.task.getUploadUrl.useMutation();
    const { mutate: addAttachment } = trpc.task.addAttachment.useMutation({
        onSuccess: () => {
            utils.task.byId.invalidate({ id: taskId });
            utils.task.listByProject.invalidate();
            setIsUploading(false);
        }
    });

    const { mutate: updateTask } = trpc.task.update.useMutation({
        onSuccess: () => {
            utils.task.byId.invalidate({ id: taskId });
            utils.task.listByProject.invalidate();
        }
    });

    const handleAssigneesChange = (userIds: string[]) => {
        updateTask({
            id: taskId,
            assigneeIds: userIds
        });
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const { url, objectName } = await getUploadUrl({
                filename: file.name,
                contentType: file.type
            });

            await fetch(url, {
                method: "PUT",
                body: file,
                headers: {
                    "Content-Type": file.type
                }
            });

            addAttachment({
                taskId,
                filename: file.name,
                objectName,
                fileSize: file.size,
                mimeType: file.type
            });
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
            setIsUploading(false);
        }
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto p-0 gap-0 border-none shadow-2xl rounded-2xl overflow-hidden bg-background">
                <div className="bg-gradient-to-br from-primary/5 via-transparent to-transparent p-6 pb-4">
                    <DialogHeader>
                        <div className="flex items-center gap-2 mb-2">
                             <Badge variant="outline" className="text-[10px] uppercase font-bold py-0.5 px-2 bg-background/50 backdrop-blur-sm shadow-xs border-primary/20 text-primary">
                                Task Details
                            </Badge>
                        </div>
                        <DialogTitle className="text-2xl font-bold tracking-tight">Task Information</DialogTitle>
                        <DialogDescription className="text-muted-foreground/80 font-medium">
                            Manage your task workflow and assets.
                        </DialogDescription>
                    </DialogHeader>
                </div>

                <Separator className="opacity-10" />

                <div className="p-6 pt-2 space-y-8">
                    {isLoadingTask ? (
                        <div className="py-24 flex flex-col items-center justify-center gap-4">
                            <div className="relative">
                                <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
                                <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
                            </div>
                            <p className="text-sm font-semibold text-muted-foreground animate-pulse tracking-wide">Retrieving task details...</p>
                        </div>
                    ) : task ? (
                        <>
                            <section className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Description</h4>
                                    <Badge variant="secondary" className="text-[10px] font-bold py-0.5 px-2 bg-primary/5 text-primary border-none">
                                        {task.status.replace("_", " ")}
                                    </Badge>
                                </div>
                                <div className="text-sm leading-relaxed p-5 rounded-2xl bg-muted/20 border border-muted shadow-inner text-foreground/90 font-medium">
                                    {task.description}
                                </div>
                                <div className="flex items-center gap-3 pl-1">
                                    <div className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider bg-muted px-2 py-0.5 rounded-full">
                                        ID: {task.id.slice(-8).toUpperCase()}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground/60 font-bold uppercase tracking-wider">
                                        Created {format(new Date(task.createdAt), "MMM d, yyyy")}
                                    </span>
                                </div>
                            </section>

                            <section className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">Assignees</h4>
                                </div>
                                <div className="p-1 rounded-2xl bg-muted/10 border border-dashed border-muted">
                                    <TaskAssigneeSelect 
                                        projectId={task.projectId}
                                        selectedUserIds={task.assignees.map(a => a.userId)}
                                        onChange={handleAssigneesChange}
                                    />
                                </div>
                            </section>

                            <section className="space-y-5">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground/70">
                                        Cloud Assets ({task.attachments.length})
                                    </h4>
                                    <Button 
                                        size="sm" 
                                        variant="outline" 
                                        className="h-9 gap-2 px-4 rounded-full bg-background/50 backdrop-blur-sm shadow-sm hover:shadow-md hover:bg-background transition-all"
                                        disabled={isUploading}
                                        onClick={() => document.getElementById("file-upload-detail")?.click()}
                                    >
                                        {isUploading ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                        ) : (
                                            <Paperclip className="w-3.5 h-3.5" />
                                        )}
                                        <span className="text-xs font-bold uppercase">Add File</span>
                                    </Button>
                                    <input 
                                        id="file-upload-detail" 
                                        type="file" 
                                        className="hidden" 
                                        onChange={handleFileUpload}
                                        disabled={isUploading}
                                    />
                                </div>

                                <div className="grid gap-3">
                                    {task.attachments.length === 0 ? (
                                        <div className="py-12 border-2 border-dashed rounded-2xl text-center text-sm text-muted-foreground font-medium bg-muted/5 flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center">
                                                <Paperclip className="w-6 h-6 opacity-20" />
                                            </div>
                                            <span>No attachments found. Start by uploading a file.</span>
                                        </div>
                                    ) : (
                                        task.attachments.map((attachment) => (
                                            <div 
                                                key={attachment.id} 
                                                className="flex items-center justify-between p-4 border rounded-2xl bg-background group hover:border-primary/40 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex items-center gap-4 relative z-10">
                                                    <div className="p-3 bg-muted/50 rounded-xl border group-hover:border-primary/20 transition-all shadow-sm group-hover:scale-105">
                                                        <FileIcon className="w-5 h-5 text-primary" />
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-bold truncate max-w-[280px]">{attachment.filename}</p>
                                                        <div className="flex items-center gap-2">
                                                             <Badge variant="outline" className="text-[9px] font-bold py-0 h-4 uppercase tracking-tighter bg-primary/5 text-primary/70 border-none px-1.5">
                                                                {formatFileSize(attachment.fileSize)}
                                                            </Badge>
                                                            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-60">
                                                                {format(new Date(attachment.uploadedAt), "MMM d, HH:mm")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 relative z-10 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-xl shadow-sm hover:bg-primary hover:text-primary-foreground transition-all" asChild title="Download">
                                                        <a href={attachment.fileUrl} target="_blank" rel="noopener noreferrer">
                                                            <Download className="w-4 h-4" />
                                                        </a>
                                                    </Button>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </section>
                        </>
                    ) : (
                        <div className="py-24 text-center">
                            <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 mb-4">
                                <Loader2 className="w-8 h-8" />
                            </div>
                            <p className="text-lg font-bold text-foreground">Resource not available</p>
                            <p className="text-sm text-muted-foreground">The task details could not be loaded at this time.</p>
                        </div>
                    )}
                </div>
                
                <div className="p-6 bg-muted/5 border-t border-muted flex justify-end">
                    <Button variant="outline" onClick={() => onOpenChange(false)} className="rounded-full px-8 text-xs font-bold uppercase tracking-[0.1em] shadow-sm hover:shadow-md">
                        Close Details
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
