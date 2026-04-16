import httpClient from '@/api/httpClient'
import {TravelFundingSource} from "@/modules/docs/types/doc";
import {CreateDocForm107} from "@/modules/docs/types/form";

import {
    DocumentSignRequest
} from "@/modules/docs/types/request";

import {
    AllTutorsWithPositionResponse,
    AllDocumentTypesAndCategoryResponse,
    DocumentResponse, AutoCreatePDFResponse
} from '../types/response'


export const allTutorsWithPosition = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllTutorsWithPositionResponse>('/user/all_employees_with_position', {
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

export const tempDocumentPdf = (document_temp_id: string) => {
    return httpClient.get(`/doc/temp/${document_temp_id}/pdf`, {
        responseType: 'blob',
    })
}

export const travelFundingSources = (language: string) => {
    return httpClient.get<TravelFundingSource[]>('/doc/travel-funding-sources', {
        params: { language },
    })
}

export const documentAutoCreatePDF = (document_type_id: number, language: string, data: CreateDocForm107) => {
    return httpClient.post<AutoCreatePDFResponse>(
        `/doc/auto/create-pdf/${document_type_id}`,
        { data: data },
        {
            params: { language },
        }
    )
}



