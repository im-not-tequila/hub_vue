export interface TutorWithPosition {
    tutor_id: number
    lastname: string | null
    firstname: string | null
    patronymic: string | null
    position_name: string | null
}

export type DocumentType = {
    id: number
    name: string
}

export type DocumentCategory = {
    id: number
    name: string
}

export type DocumentStatus =
    'signed' |
    'cancelled' |
    'pending'

export interface Person {
    id: number
    firstname: string
    lastname: string
    patronymic: string
    shortname: string
    role: string
    avatar: string
    status: DocumentStatus
}

export interface OutgoingPerson {
    name: string
    role: string
    avatar: string
    status: DocumentStatus
}




