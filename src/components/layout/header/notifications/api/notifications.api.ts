import httpClient from "@/api/httpClient";
import {NotificationResponse} from "@/components/layout/header/notifications/types/notifications";


export const notifications = (is_read: boolean | null = null) =>
    httpClient.get<NotificationResponse[]>('/notifications', {
        params: {
            is_read,
        },
    })


export const notificationsMarkAsRead = (notification_ids: number[]) =>
    httpClient.post('/notifications/mark-as-read', notification_ids)
