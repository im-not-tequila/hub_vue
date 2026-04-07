import httpClient from '@/api/httpClient'
import type {
  NormativeDocumentCategory,
  NormativeDocumentItem,
} from '@/modules/normative-documents/types/response'

export const normativeCategories = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
  httpClient.get<NormativeDocumentCategory[]>('/doc/normative/categories', {
    params: { lang },
  })

export const normativeDocuments = (params?: {
  lang?: 'ru' | 'kz' | 'en'
  category_id?: number | null
  subcategory_id?: number | null
}) =>
  httpClient.get<NormativeDocumentItem[]>('/doc/normative/documents', {
    params: {
      lang: params?.lang ?? 'ru',
      category_id: params?.category_id ?? null,
      subcategory_id: params?.subcategory_id ?? null,
    },
  })

export const normativeDocumentView = (documentId: number) =>
  httpClient.get(`/doc/normative/${documentId}/view`, {
    responseType: 'blob',
  })

export const normativeDocumentDownload = (documentId: number) =>
  httpClient.get(`/doc/normative/${documentId}/download`, {
    responseType: 'blob',
  })
