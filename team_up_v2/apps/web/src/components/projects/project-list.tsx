"use client";

import { ProjectCard } from "./project-card";
import { trpc } from "@/lib/trpc/client";

export function ProjectList() {
    const { data: projects, isLoading, error } = trpc.project.list.useQuery();

    if (isLoading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-[200px] rounded-xl bg-muted animate-pulse" />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8 border rounded-xl border-destructive/20 bg-destructive/5 text-destructive text-center">
                <p>Failed to load projects: {error.message}</p>
            </div>
        );
    }

    if (!projects || projects.length === 0) {
        return (
            <div className="p-12 border-2 border-dashed rounded-xl text-center space-y-4">
                <p className="text-muted-foreground">You don't have any projects yet.</p>
            </div>
        );
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
        </div>
    );
}
