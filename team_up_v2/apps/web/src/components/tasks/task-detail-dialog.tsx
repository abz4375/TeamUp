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
import { Paperclip, X, FileIcon, Loader2, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

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
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Task Details</DialogTitle>
                    <DialogDescription>
                        View task info and manage attachments.
                    </DialogDescription>
                </DialogHeader>

                {isLoadingTask ? (
                    <div className="py-12 flex flex-col items-center justify-center gap-4">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        <p className="text-sm text-muted-foreground">Loading task details...</p>
                    </div>
                ) : task ? (
                    <div className="space-y-6 pt-4">
                        <section className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                            <p className="text-sm leading-relaxed border p-3 rounded-lg bg-muted/30">
                                {task.description}
                            </p>
                            <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-[10px] uppercase font-bold">
                                    {task.status.replace("_", " ")}
                                </Badge>
                                <span className="text-[10px] text-muted-foreground">
                                    Created {format(new Date(task.createdAt), "PPP")}
                                </span>
                            </div>
                        </section>

                        <Separator />

                        <section className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Attachments ({task.attachments.length})</h4>
                                <Button 
                                    size="sm" 
                                    variant="outline" 
                                    className="h-8 gap-2"
                                    disabled={isUploading}
                                    onClick={() => document.getElementById("file-upload-detail")?.click()}
                                >
                                    {isUploading ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <Paperclip className="w-3 h-3" />
                                    )}
                                    Upload
                                </Button>
                                <input 
                                    id="file-upload-detail" 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileUpload}
                                    disabled={isUploading}
                                />
                            </div>

                            <div className="grid gap-2">
                                {task.attachments.length === 0 ? (
                                    <div className="p-8 border-2 border-dashed rounded-xl text-center text-sm text-muted-foreground">
                                        No attachments yet.
                                    </div>
                                ) : (
                                    task.attachments.map((attachment) => (
                                        <div 
                                            key={attachment.id} 
                                            className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 group hover:border-primary/30 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-background rounded border group-hover:border-primary/20 transition-colors">
                                                    <FileIcon className="w-4 h-4 text-primary" />
                                                </div>
                                                <div className="space-y-0.5">
                                                    <p className="text-sm font-medium line-clamp-1">{attachment.filename}</p>
                                                    <p className="text-[10px] text-muted-foreground">
                                                        {formatFileSize(attachment.fileSize)} • {format(new Date(attachment.uploadedAt), "MMM d, HH:mm")}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
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

                        <section className="space-y-3">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Assignees</h4>
                            <div className="flex flex-wrap gap-2">
                                {task.assignees.length === 0 ? (
                                    <p className="text-sm text-muted-foreground italic">No one assigned yet.</p>
                                ) : (
                                    task.assignees.map((a) => (
                                        <Badge key={a.id} variant="secondary" className="gap-1.5 py-1 px-2 pr-3">
                                            <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold">
                                                {(a.user.name || "U").charAt(0)}
                                            </div>
                                            {a.user.name}
                                        </Badge>
                                    ))
                                )}
                            </div>
                        </section>
                    </div>
                ) : (
                    <div className="py-12 text-center text-muted-foreground">
                        Failed to load task details.
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}
