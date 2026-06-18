import httpClient from '@/api/httpClient'
import type {
    ChatUser,
    Chat,
    ChatMessage,
    CreateChatRequest,
    CreateGroupChatRequest,
    UpdateGroupChatRequest,
    AddChatParticipantsRequest,
    UpdateChatParticipantRequest,
    SendMessageRequest,
    ForwardMessageRequest,
    DeleteMessageRequest,
    DeleteMessageResponse,
    ChatAttachment,
    ChatParticipant,
} from '../types/chat'

export const getChatUsers = () =>
    httpClient.get<ChatUser[]>('/chat/users')

export const getChats = () =>
    httpClient.get<Chat[]>('/chat/chats')

export const createChat = (data: CreateChatRequest) =>
    httpClient.post<Chat>('/chat/chats', data)

export const createGroupChat = (data: CreateGroupChatRequest) =>
    httpClient.post<Chat>('/chat/chats/groups', data)

export const updateGroupChat = (chatId: number, data: UpdateGroupChatRequest) =>
    httpClient.patch<Chat>(`/chat/chats/${chatId}`, data)

export const getChatParticipants = (chatId: number) =>
    httpClient.get<ChatParticipant[]>(`/chat/chats/${chatId}/participants`)

export const addChatParticipants = (chatId: number, data: AddChatParticipantsRequest) =>
    httpClient.post<ChatParticipant[]>(`/chat/chats/${chatId}/participants`, data)

export const updateChatParticipantRole = (chatId: number, userId: number, data: UpdateChatParticipantRequest) =>
    httpClient.patch<ChatParticipant>(`/chat/chats/${chatId}/participants/${userId}`, data)

export const removeChatParticipant = (chatId: number, userId: number) =>
    httpClient.delete(`/chat/chats/${chatId}/participants/${userId}`)

export const getMessages = (chatId: number, limit = 50, offset = 0) =>
    httpClient.get<ChatMessage[]>(`/chat/chats/${chatId}/messages`, {
        params: { limit, offset }
    })

export const sendMessage = (chatId: number, data: SendMessageRequest) =>
    httpClient.post<ChatMessage>(`/chat/chats/${chatId}/messages`, data)

export const forwardMessage = (messageId: number, data: ForwardMessageRequest) =>
    httpClient.post<ChatMessage>(`/chat/messages/${messageId}/forward`, data)

export const uploadAttachment = (chatId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post<ChatAttachment>(`/chat/chats/${chatId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const downloadAttachment = (url: string) =>
    httpClient.get<Blob>(url, {
        responseType: 'blob',
    })

export const markMessagesAsRead = (chatId: number) =>
    httpClient.put(`/chat/chats/${chatId}/messages/read`)

export const deleteMessage = (messageId: number, data: DeleteMessageRequest) =>
    httpClient.delete<DeleteMessageResponse>(`/chat/messages/${messageId}`, { data })

export const leaveChat = (chatId: number) =>
    httpClient.delete(`/chat/chats/${chatId}/participants/me`)
