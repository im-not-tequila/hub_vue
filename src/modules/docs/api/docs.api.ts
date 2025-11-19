import httpClient from '@/api/httpClient'

import {
    DocumentSignRequest
} from "@/modules/docs/types/request";

import {
    AllTutorsWithPositionResponse,
    AllDocumentTypesAndCategoryResponse,
    DocumentResponse
} from '../types/response'


export const allTutorsWithPosition = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllTutorsWithPositionResponse>('/user/all_tutors_with_position', {
        params: { lang },
    })

export const allDocumentTypesAndCategories = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllDocumentTypesAndCategoryResponse[]>('/doc/types-and-categories', {
        params: { lang },
    })

export const documentUpload = (formData: FormData) => {
    return httpClient.post('/doc/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    })
}

export const documentSign = (document_id: number, data: DocumentSignRequest) => {
    return httpClient.post(`/doc/${document_id}/sign`, data)
}

export const documentCancel = (document_id: number) => {
    return httpClient.post(`/doc/${document_id}/cancel`)
}

export const documentExecute = (document_id: number) => {
    return httpClient.post(`/doc/${document_id}/execute`)
}

export const documentRevoke = (document_id: number) => {
    return httpClient.post(`/doc/${document_id}/revoke`)
}

export const documentHide = (document_id: number) => {
    return httpClient.post(`/doc/${document_id}/hide`)
}

export const documentUnhide = (document_id: number) => {
    return httpClient.post(`/doc/${document_id}/unhide`)
}

export const documentIncoming = () => {
    return httpClient.get<DocumentResponse[]>('/doc/incoming')
}

export const documentOutgoings = () => {
    return httpClient.get<DocumentResponse[]>('/doc/outgoing')
}

export const documentPendingExecution = () => {
    return httpClient.get<DocumentResponse[]>('/doc/pending-execution')
}

export const documentExecuted = () => {
    return httpClient.get<DocumentResponse[]>('/doc/executed')
}

export const documentPdf = (document_id: number) => {
    return httpClient.get(`/doc/${document_id}/pdf`, {
        responseType: 'blob',
    })
}




