"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { trpc } from "@/lib/trpc/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import { useUIStore } from "@/hooks/use-ui-store";
import { ProjectList } from "@/components/projects/project-list";

export default function DashboardPage() {
    const { data: session, isPending } = authClient.useSession();
    const router = useRouter();
    const { isSidebarOpen, toggleSidebar } = useUIStore();

    const hello = trpc.hello.useQuery();

    if (isPending || hello.isLoading) {
        return <div className="p-8">Loading...</div>;
    }

    if (!session) {
        return (
            <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] gap-4">
                <p className="text-muted-foreground">Not authenticated.</p>
                <Button onClick={() => router.push('/auth/signin')}>
                    Go to Sign In
                </Button>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>API Status</CardTitle>
                        <CardDescription>Real-time connection to tRPC backend</CardDescription>
                    </CardHeader>
                    <CardContent className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${hello.data ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></span>
                        <span className="font-mono text-sm">{hello.data || "Connecting..."}</span>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>User Profile</CardTitle>
                        <CardDescription>Logged in via Better Auth</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-lg font-medium">{session.user.name}</p>
                        <p className="text-sm text-muted-foreground">{session.user.email}</p>
                    </CardContent>
                </Card>
            </div>

             <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold tracking-tight">Your Projects</h2>
                    <Button variant="ghost" className="text-primary" onClick={() => router.push('/projects')}>
                        View All
                    </Button>
                </div>
                <ProjectList />
            </div>
            
        </div>
    );
}
