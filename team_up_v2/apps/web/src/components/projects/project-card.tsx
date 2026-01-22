"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, FileText, Calendar } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
    project: {
        id: string;
        title: string;
        description: string | null;
        status?: string;
        updatedAt: Date;
        owner: {
            name: string | null;
            image: string | null;
        };
        _count: {
            tasks: number;
            members: number;
        };
    };
}

export function ProjectCard({ project }: ProjectCardProps) {
    return (
        <Link href={`/projects/${project.id}`}>
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div className="space-y-1">
                            <CardTitle className="line-clamp-1">{project.title}</CardTitle>
                            {project.status && (
                                <Badge variant={project.status === "ACTIVE" ? "default" : "secondary"} className="text-[10px] h-5">
                                    {project.status}
                                </Badge>
                            )}
                        </div>
                        <Badge variant="outline" className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {project._count.members}
                        </Badge>
                    </div>
                    <CardDescription className="line-clamp-2 min-h-[40px]">
                        {project.description || "No description provided."}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mt-4">
                        <div className="flex items-center gap-1">
                            <FileText className="w-4 h-4" />
                            <span>{project._count.tasks} Tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center gap-2 border-t pt-4">
                         <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-bold">
                            {(project.owner.name || "U").charAt(0)}
                        </div>
                        <span className="text-xs">{project.owner.name || "Unknown"}</span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
