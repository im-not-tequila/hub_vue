export interface BroadcastRole {
    id: number
    name_ru: string
    name_kz: string
}

export interface BroadcastAllowedRole {
    role_id: number
    name_ru: string | null
    name_kz: string | null
}

export interface BroadcastGroup {
    id: number
    name: string
    description: string | null
    created_by_user_id: number | null
    members_count: number
    allowed_roles: BroadcastAllowedRole[]
    created_at: string | null
    updated_at: string | null
}

export interface BroadcastGroupMember {
    id: number
    user_id: number
    user: {
        id: number
        firstname?: string
        lastname?: string
        shortname?: string
        post?: string | null
    } | null
    added_by_user_id: number | null
    created_at: string | null
}

export interface BroadcastMeResponse {
    is_admin: boolean
    groups: BroadcastGroup[]
}

export interface CreateBroadcastGroupRequest {
    name: string
    description?: string | null
    member_ids?: number[]
}

export interface UpdateBroadcastGroupRequest {
    name?: string
    description?: string | null
}

export interface SendBroadcastRequest {
    text?: string
    attachment_ids?: number[]
}

export interface SendBroadcastResponse {
    sent: boolean
    group_id: number
    group_name: string
    recipients_count: number
}
