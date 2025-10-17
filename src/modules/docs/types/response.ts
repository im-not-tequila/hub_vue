import {
    DocumentType,
    DocumentCategory,
    TutorWithPosition,
    DocumentStatus,
    Person
} from "@/modules/docs/types/doc";


export interface AllDocumentTypesAndCategoryResponse {
    category: DocumentCategory
    document_types: DocumentType[]
}

export type AllTutorsWithPositionResponse = TutorWithPosition[]

export interface IncomingResponse {
    id: number
    name: string
    sender: Person
    recipient: Person
    approvers: [Person]
    type: string
    type_id: number
    create_datetime: string
    status: DocumentStatus
    is_hidden: boolean
}

export interface OutgoingResponse {
    id: number
    name: string
    sender: Person
    recipient: Person
    approvers: [Person]
    type: string
    type_id: number
    create_datetime: string
    status: DocumentStatus
    is_hidden: boolean
}

