import httpClient from '@/api/httpClient'
import type {
    BroadcastGroup,
    BroadcastGroupMember,
    BroadcastRole,
    BroadcastMeResponse,
    CreateBroadcastGroupRequest,
    UpdateBroadcastGroupRequest,
    SendBroadcastRequest,
    SendBroadcastResponse,
} from '../types/broadcast'
import type { ChatAttachment } from '../types/chat'

export const getBroadcastMe = () =>
    httpClient.get<BroadcastMeResponse>('/broadcast/me')

export const getAllRoles = () =>
    httpClient.get<BroadcastRole[]>('/broadcast/roles')

export const getBroadcastGroups = () =>
    httpClient.get<BroadcastGroup[]>('/broadcast/groups')

export const createBroadcastGroup = (data: CreateBroadcastGroupRequest) =>
    httpClient.post<BroadcastGroup>('/broadcast/groups', data)

export const updateBroadcastGroup = (groupId: number, data: UpdateBroadcastGroupRequest) =>
    httpClient.patch<BroadcastGroup>(`/broadcast/groups/${groupId}`, data)

export const deleteBroadcastGroup = (groupId: number) =>
    httpClient.delete(`/broadcast/groups/${groupId}`)

// Members
export const getBroadcastGroupMembers = (groupId: number) =>
    httpClient.get<BroadcastGroupMember[]>(`/broadcast/groups/${groupId}/members`)

export const addBroadcastGroupMembers = (groupId: number, userIds: number[]) =>
    httpClient.post<BroadcastGroupMember[]>(`/broadcast/groups/${groupId}/members`, { user_ids: userIds })

export const removeBroadcastGroupMember = (groupId: number, userId: number) =>
    httpClient.delete(`/broadcast/groups/${groupId}/members/${userId}`)

// Roles
export const addBroadcastGroupRole = (groupId: number, roleId: number) =>
    httpClient.post(`/broadcast/groups/${groupId}/roles`, { role_id: roleId })

export const removeBroadcastGroupRole = (groupId: number, roleId: number) =>
    httpClient.delete(`/broadcast/groups/${groupId}/roles/${roleId}`)

// Send
export const uploadBroadcastAttachment = (groupId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return httpClient.post<ChatAttachment>(`/broadcast/groups/${groupId}/attachments`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
}

export const sendBroadcast = (groupId: number, data: SendBroadcastRequest) =>
    httpClient.post<SendBroadcastResponse>(`/broadcast/groups/${groupId}/send`, data)
