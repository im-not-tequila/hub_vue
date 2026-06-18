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
    is_deleted: boolean
    deleted_by_user_id: number | null
    is_forwarded: boolean
    forwarded_from_message_id: number | null
    original_message_id: number | null
    original_sender_id: number | null
    created_at: string | null
    attachments: ChatAttachment[]
}

export interface ChatParticipant {
    user: ChatUser
    role: 'admin' | 'member'
    is_active: boolean
    added_by_user_id: number | null
    removed_by_user_id: number | null
    removed_at: string | null
    created_at: string | null
}

export interface Chat {
    id: number
    type: 'direct' | 'group'
    title: string | null
    avatar_url: string | null
    creator_user_id: number | null
    participant: ChatUser | null
    participants: ChatParticipant[]
    my_role: 'admin' | 'member' | null
    last_message: ChatMessage | null
    unread_count: number
}

export interface CreateGroupPayload {
    title: string
    participantIds: number[]
}

export interface CreateChatRequest {
    participant_id: number
}

export interface CreateGroupChatRequest {
    title: string
    participant_ids: number[]
    avatar_url?: string | null
}

export interface UpdateGroupChatRequest {
    title?: string
    avatar_url?: string | null
}

export interface AddChatParticipantsRequest {
    user_ids: number[]
    role?: 'admin' | 'member'
}

export interface UpdateChatParticipantRequest {
    role: 'admin' | 'member'
}

export interface SendMessageRequest {
    text?: string
    attachment_ids?: number[]
}

export interface ForwardMessageRequest {
    target_chat_id?: number
    recipient_id?: number
}

export interface DeleteMessageRequest {
    scope: 'me' | 'everyone'
}

export interface DeleteMessageResponse {
    deleted: boolean
    scope: 'me' | 'everyone'
}

export interface MarkAsReadResponse {
    marked_count: number
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
