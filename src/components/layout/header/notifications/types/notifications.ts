export interface NotificationResponse {
    id: number
    message: string
    sender_user_id: number
    sender_name: string
    title: string
    is_read: boolean
    other_data: Record<string, any> | null
    created_at: string
}
