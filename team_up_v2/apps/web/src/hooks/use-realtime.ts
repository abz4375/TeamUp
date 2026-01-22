"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { trpc } from "@/lib/trpc/client";

export function useRealtime(projectId?: string, userId?: string) {
    const socketRef = useRef<Socket | null>(null);
    const utils = trpc.useUtils();

    useEffect(() => {
        const host = process.env.NEXT_PUBLIC_REALTIME_URL || "http://localhost:3002";

        console.log(`[Realtime] Connecting to ${host}...`);
        const socket = io(host);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("[Realtime] Connected to server");
            if (projectId) {
                console.log(`[Realtime] Joining project: ${projectId}`);
                socket.emit("join-project", projectId);
            }
            if (userId) {
                console.log(`[Realtime] Joining user room: user:${userId}`);
                socket.emit("join-user", userId);
            }
        });

        socket.on("task-updated", (data: { projectId: string; taskId: string; type: string }) => {
            console.log("[Realtime] Task event received:", data);
            utils.task.listByProject.invalidate({ projectId: data.projectId });
            if (data.taskId) {
                utils.task.byId.invalidate({ id: data.taskId });
            }
        });

        socket.on("project-updated", (data: { projectId: string }) => {
            console.log("[Realtime] Project event received:", data);
            utils.project.byId.invalidate({ id: data.projectId });
            utils.project.list.invalidate();
        });

        socket.on("notification", (data: { type: string }) => {
            console.log("[Realtime] Notification event received:", data);
            if (data.type === "unread_update") {
                utils.notification.list.invalidate();
                utils.notification.unreadCount.invalidate();
            }
        });

        socket.on("disconnect", () => {
            console.log("[Realtime] Disconnected from server");
        });

        return () => {
            if (projectId) {
                socket.emit("leave-project", projectId);
            }
            if (userId) {
                socket.emit("leave-user", userId);
            }
            socket.disconnect();
        };
    }, [projectId, userId, utils]);

    return socketRef.current;
}
