export interface DocumentUploadRequest {
    document_name: string
    document_type_id: number
    recipient_id: number
    approver_user_ids: number[]
    cms: string
    file: File
}

export interface DocumentSignRequest {
    resolution: string | null
    executors: number[]
    signature: string
}
