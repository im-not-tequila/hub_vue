import httpClient from "@/api/httpClient";
import {SampleDocumentResponse} from "@/modules/sample-documents/types/response";


export const sampleDocuments = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
    httpClient.get<SampleDocumentResponse>('/doc/samples', {
        params: { lang },
    })

export const sampleDocumentPdf = (sample_document_id: number) =>
    httpClient.get<SampleDocumentResponse>(`/doc/sample/${sample_document_id}/pdf`, {
        responseType: 'blob',
    })

export const sampleDocumentDownload = async (document_id: number) => {
    const response = await httpClient.get(`/doc/sample/${document_id}/download`, {
        responseType: 'blob',
    })

    const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${document_id}.docx`
    a.click()
    window.URL.revokeObjectURL(url)
}
