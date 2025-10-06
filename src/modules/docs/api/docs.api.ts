import httpClient from '@/api/httpClient'

import {
    DocumentUploadRequest,
    DocumentSignRequest,
    DocumentCancelRequest,
    DocumentExecuteRequest
} from "@/modules/docs/types/request";

import {
    AllTutorsWithPositionResponse,
    AllDocumentTypesAndCategoryResponse,
    IncomingResponse,
    OutgoingResponse
} from '../types/response'


export const allTutorsWithPosition = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllTutorsWithPositionResponse>('/user/all_tutors_with_position', {
        params: { lang },
    })

export const allDocumentTypesAndCategories = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllDocumentTypesAndCategoryResponse[]>('/doc/types_and_categories', {
        params: { lang },
    })

export const documentUpload = (data: DocumentUploadRequest) => {
    const formData = new FormData()
    formData.append('document_name', data.document_name)
    formData.append('document_type_id', data.document_type_id.toString())
    formData.append('recipient_id', data.recipient_id.toString())
    formData.append('cms', data.cms)
    formData.append('file', data.file)
    formData.append('approver_user_ids', JSON.stringify(data.approver_user_ids))

    return httpClient.post('/doc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const documentSign = (data: DocumentSignRequest) => {
    return httpClient.post(`/doc/sign`, data)
}

export const documentCancel = (data: DocumentCancelRequest) => {
    return httpClient.post(`/doc/cancel`, data)
}

export const documentExecute = (data: DocumentExecuteRequest) => {
    return httpClient.post(`/doc/execute`, data)
}

export const documentIncoming = () => {
    return httpClient.get<IncomingResponse[]>('/doc/incoming')
}

export const documentOutgoings = () => {
    return httpClient.get<OutgoingResponse[]>('/doc/outgoing')
}

export const documentPendingExecution = () => {
    return httpClient.get<OutgoingResponse[]>('/doc/pending_execution')
}

export const documentExecuted = () => {
    return httpClient.get<OutgoingResponse[]>('/doc/executed')
}

export const documentPdf = (document_id: number) => {
    return httpClient.get(`/doc/pdf`, {
        params: { document_id },
        responseType: 'blob',
    })
}
