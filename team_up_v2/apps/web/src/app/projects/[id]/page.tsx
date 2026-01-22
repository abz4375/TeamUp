"use client";

import { trpc } from "@/lib/trpc/client";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Calendar } from "lucide-react";
import { format } from "date-fns";
import { TaskList } from "@/components/tasks/task-list";
import { CreateTaskDialog } from "@/components/tasks/create-task-dialog";
import { useRealtime } from "@/hooks/use-realtime";

export default function ProjectDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    // Enable realtime updates for this project
    useRealtime(id);

    const { data: project, isLoading, error } = trpc.project.byId.useQuery({ id });

    if (isLoading) {
        return <div className="p-8 flex justify-center items-center h-[50vh]">Loading project details...</div>;
    }

    if (error || !project) {
        return (
            <div className="p-8 text-center space-y-4">
                <p className="text-destructive">Error: {error?.message || "Project not found"}</p>
                <Button onClick={() => router.push('/projects')}>Back to Projects</Button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div className="space-y-4">
                    <Button 
                        variant="ghost" 
                        size="sm"
                        className="gap-2 -ml-2 text-muted-foreground hover:text-foreground" 
                        onClick={() => router.push('/projects')}
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Projects
                    </Button>
                    <div className="flex items-center gap-4">
                        <h1 className="text-4xl font-bold tracking-tight">{project.title}</h1>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <CreateTaskDialog projectId={project.id} />
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {project.description || "No description provided."}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm">
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Users className="w-4 h-4" /> Owner
                            </span>
                            <span className="font-medium">{project.owner?.name || project.owner?.email || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-muted-foreground flex items-center gap-2">
                                <Calendar className="w-4 h-4" /> Created
                            </span>
                            <span>{format(new Date(project.createdAt), "MMM d, yyyy")}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Separator />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Tasks</h2>
                </div>
                
                <TaskList projectId={project.id} />
            </div>
        </div>
    );
}
