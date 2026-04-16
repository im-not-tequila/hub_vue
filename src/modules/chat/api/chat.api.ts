import httpClient from '@/api/httpClient'
import type {
    ChatUser,
    Chat,
    ChatMessage,
    CreateChatRequest,
    SendMessageRequest,
    ChatAttachment,
} from '../types/chat'

export const getChatUsers = () =>
    httpClient.get<ChatUser[]>('/chat/users')

export const getChats = () =>
    httpClient.get<Chat[]>('/chat/chats')

export const createChat = (data: CreateChatRequest) =>
    httpClient.post<Chat>('/chat/chats', data)

export const getMessages = (chatId: number, limit = 50, offset = 0) =>
    httpClient.get<ChatMessage[]>(`/chat/chats/${chatId}/messages`, {
        params: { limit, offset }
    })

export const sendMessage = (chatId: number, data: SendMessageRequest) =>
    httpClient.post<ChatMessage>(`/chat/chats/${chatId}/messages`, data)

export const uploadAttachment = (chatId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post<ChatAttachment>(`/chat/chats/${chatId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const markMessagesAsRead = (chatId: number) =>
    httpClient.put(`/chat/chats/${chatId}/messages/read`)
