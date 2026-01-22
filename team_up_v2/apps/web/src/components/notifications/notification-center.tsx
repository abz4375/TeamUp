"use client";

import { trpc } from "@/lib/trpc/client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bell, Check, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { useRealtime } from "@/hooks/use-realtime";

export function NotificationCenter() {
    const { data: session } = authClient.useSession();
    
    // Subscribe to notification events
    useRealtime(undefined, session?.user.id);

    const { data: notifications, isLoading, refetch } = trpc.notification.list.useQuery();
    const { data: unreadCount } = trpc.notification.unreadCount.useQuery();

    const markAsRead = trpc.notification.markAsRead.useMutation({
        onSuccess: () => refetch(),
    });

    const markAllAsRead = trpc.notification.markAllAsRead.useMutation({
        onSuccess: () => refetch(),
    });

    const deleteNotification = trpc.notification.delete.useMutation({
        onSuccess: () => refetch(),
    });

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount && unreadCount > 0 ? (
                        <Badge 
                            variant="destructive" 
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                        >
                            {unreadCount}
                        </Badge>
                    ) : null}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
                <div className="flex items-center justify-between p-4 border-b">
                    <h4 className="font-semibold">Notifications</h4>
                    {notifications && notifications.length > 0 && (
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-xs h-8"
                            onClick={() => markAllAsRead.mutate()}
                        >
                            Mark all as read
                        </Button>
                    )}
                </div>
                <ScrollArea className="h-[400px]">
                    {!notifications || notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground p-4 text-center">
                            <Bell className="h-8 w-8 mb-2 opacity-20" />
                            <p className="text-sm">No notifications yet</p>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification: any) => (
                                <div 
                                    key={notification.id} 
                                    className={cn(
                                        "flex gap-3 p-4 border-b last:border-0 hover:bg-accent/50 transition-colors group",
                                        !notification.read && "bg-primary/5"
                                    )}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className={cn(
                                                "text-sm font-medium leading-none truncate",
                                                !notification.read && "text-primary"
                                            )}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>
                                        <p className="text-xs text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {!notification.read && (
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6" 
                                                    onClick={() => markAsRead.mutate({ id: notification.id })}
                                                >
                                                    <Check className="h-3 w-3" />
                                                </Button>
                                            )}
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-6 w-6 text-destructive hover:text-destructive" 
                                                onClick={() => deleteNotification.mutate({ id: notification.id })}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <div className="p-2 border-t text-center">
                     <Button variant="ghost" className="w-full text-xs h-8" size="sm">
                        View all notifications
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
