import httpClient from '@/api/httpClient'
import { AllTutorsWithPositionResponse } from '../types/docs'


export interface UploadOriginalResponse {
    document_id: string
    filename: string
    path: string
}

export const allTutorsWithPosition = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<AllTutorsWithPositionResponse>('/user/all_tutors_with_position', {
        params: { lang },
    })

export const uploadOriginal = (body: FormData) =>
    httpClient.post<UploadOriginalResponse>('/doc/upload/original', body, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
