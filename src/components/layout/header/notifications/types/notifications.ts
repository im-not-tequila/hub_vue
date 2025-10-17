export interface NotificationResponse {
    id: number
    message: string
    link: string | null
    is_read: boolean
    created_at: string
}
