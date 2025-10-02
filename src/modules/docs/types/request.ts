export interface DocumentUploadRequest {
    document_name: string
    document_type_id: number
    recipient_id: number
    approver_user_ids: number[]
    cms: string
    file: File
}

export interface DocumentSignRequest {
    document_id: number
    resolution: string | null
    executors: number[]
    cms: string
}

export interface DocumentExecuteRequest {
    document_id: number
}
