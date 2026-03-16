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

export interface DocumentResponse {
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

export interface AutoCreatePDFResponse {
    recipient_id: number
    approver_ids: [number]
    document_temp_id: string
}


