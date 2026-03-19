import httpClient from '@/api/httpClient'
import type {
  CalendarApiEvent,
  EventPlaceItem,
  EventTypeItem,
  Lang,
  StructuralSubdivisionItem,
} from '../types/eventsCalendar'

export function getStructuralSubdivisions(lang: Lang) {
  return httpClient.get<StructuralSubdivisionItem[]>('/structural-subdivisions', { params: { lang } })
}

export function getEventPlaces(lang: Lang) {
  return httpClient.get<EventPlaceItem[]>('/calendar/places', { params: { lang } })
}

export function getEventTypes(lang: Lang) {
  return httpClient.get<EventTypeItem[]>('/calendar/event-types', { params: { lang } })
}

export function getCalendarEvents(lang: Lang) {
  return httpClient.get<CalendarApiEvent[]>('/calendar', { params: { lang } })
}

export type CalendarEventDetail = {
  id: number
  creator_user_id: number
  structural_subdivision_id: number | null
  start_datetime: string | null
  end_datetime: string | null
  place_id: number | null
  title_ru: string | null
  title_kz: string | null
  title_en: string | null
  description_ru: string | null
  description_kz: string | null
  description_en: string | null
  needs_media_capture: boolean | null
  event_type_id: number | null
  contacts: string | null
  needs_tech_support: boolean | null
}

export function getCalendarEvent(eventId: string) {
  return httpClient.get<CalendarEventDetail>(`/calendar/${eventId}`)
}

export type CreateCalendarEventPayload = {
  structural_subdivision_id: number
  start_datetime: string
  end_datetime: string
  place_id: number
  title_ru: string
  title_kz: string
  title_en: string
  description_ru: string
  description_kz: string
  description_en: string
  needs_media_capture: boolean
  event_type_id: number
  contacts: string
  needs_tech_support: boolean
}

export function createCalendarEvent(payload: CreateCalendarEventPayload) {
  return httpClient.post('/calendar', payload)
}

export type UpdateCalendarEventPayload = Partial<CreateCalendarEventPayload>

export function updateCalendarEvent(eventId: string, payload: UpdateCalendarEventPayload) {
  return httpClient.put(`/calendar/${eventId}`, payload)
}

export function deleteCalendarEvent(eventId: string) {
  return httpClient.delete(`/calendar/${eventId}`)
}

