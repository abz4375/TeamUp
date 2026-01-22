export async function emitRealtimeEvent(event: string, roomId: string | null, data: any) {
    const realtimeUrl = process.env.INTERNAL_REALTIME_URL || "http://localhost:3002/internal/emit";

    try {
        const response = await fetch(realtimeUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                event,
                roomId,
                data,
            }),
        });

        if (!response.ok) {
            console.warn(`[Realtime] Failed to emit event: ${response.statusText}`);
        }
    } catch (error) {
        console.warn(`[Realtime] Error emitting event:`, error);
    }
}

export const RealtimeEvents = {
    TASK_UPDATED: 'task-updated',
    PROJECT_UPDATED: 'project-updated',
} as const;
