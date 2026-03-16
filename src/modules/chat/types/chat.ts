export interface ChatUser {
    id: number
    firstname: string
    lastname: string
    shortname: string
    avatar: string | null
    is_online: boolean
    last_seen: string | null
    post: string | null
}

export interface ChatMessage {
    id: number
    chat_id: number
    sender_id: number
    text: string
    is_read: boolean
    created_at: string | null
}

export interface Chat {
    id: number
    participant: ChatUser | null
    last_message: ChatMessage | null
    unread_count: number
}

export interface CreateChatRequest {
    participant_id: number
}

export interface SendMessageRequest {
    text: string
}

export interface MarkAsReadResponse {
    updated: number
}
