"use client";

import Link from "next/link";
import { NotificationCenter } from "../notifications/notification-center";
import { ModeToggle } from "../mode-toggle";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuLabel, 
    DropdownMenuSeparator, 
    DropdownMenuTrigger 
} from "../ui/dropdown-menu";
import { LogOut, Settings, User, LayoutDashboard, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";

export function SiteHeader() {
    const { data: session } = authClient.useSession();
    const router = useRouter();

    if (!session) return null;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between max-w-7xl mx-auto px-8">
                <div className="flex items-center gap-6 md:gap-10">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <span className="font-bold inline-block text-xl tracking-tight text-primary">
                            TEAM-UP
                        </span>
                    </Link>
                    <nav className="hidden md:flex gap-6">
                        <Link 
                            href="/dashboard" 
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <LayoutDashboard className="w-4 h-4 mr-2" />
                            Dashboard
                        </Link>
                        <Link 
                            href="/projects" 
                            className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                        >
                            <Briefcase className="w-4 h-4 mr-2" />
                            Projects
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-2">
                        <NotificationCenter />
                        <ModeToggle />
                        
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                                    <Avatar className="h-9 w-9">
                                        <AvatarImage src={session.user.image || ""} alt={session.user.name} />
                                        <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{session.user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {session.user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => router.push('/settings/profile')}>
                                    <User className="mr-2 h-4 w-4" />
                                    <span>Profile</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => router.push('/settings')}>
                                    <Settings className="mr-2 h-4 w-4" />
                                    <span>Settings</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={async () => {
                                        await authClient.signOut();
                                        router.push('/auth/signin');
                                    }}
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </nav>
                </div>
            </div>
        </header>
    );
}
