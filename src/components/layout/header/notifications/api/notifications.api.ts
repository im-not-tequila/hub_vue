import httpClient from "@/api/httpClient";
import {NotificationResponse} from "@/components/layout/header/notifications/types/notifications";

export const notifications = () =>
    httpClient.get<NotificationResponse[]>('/user/notifications')
