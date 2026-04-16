export interface ChatUser {
    id: number
    firstname: string
    lastname: string
    shortname: string
    is_online: boolean
    last_seen: string | null
    post: string | null
}

export interface ChatMessage {
    id: number
    chat_id: number
    sender_id: number
    text: string | null
    is_read: boolean
    created_at: string | null
    attachments: ChatAttachment[]
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
    text?: string
    attachment_ids?: number[]
}

export interface MarkAsReadResponse {
    updated: number
}

export interface ChatAttachment {
    id: number
    chat_id: number
    message_id: number | null
    uploader_id: number
    type: 'image' | 'file'
    mime_type: string
    original_name: string
    size_bytes: number
    width: number | null
    height: number | null
    url: string
    created_at: string | null
}
