import type { EventInput } from '@fullcalendar/core'

export type Lang = 'ru' | 'kz' | 'en'

export type StructuralSubdivisionItem = {
  id: number
  dean: number
  pre: number
  name?: string | null
  subdivision_type?: number | null
  faculty_cafedra_id?: number | null
}

export type EventPlaceItem = { id: number; name: string }
export type EventTypeItem = { id: number; name: string }

export type CalendarApiEvent = {
  id: string
  title: string
  start_datetime: string
  end_datetime: string
  extendedProps?: {
    event_type?: string
    place?: string
    description?: string
    needs_media?: number
    needs_tech?: number
    structural_subdivision?: string
    is_owner?: boolean
    structural_subdivision_id?: number
    place_id?: number
    event_type_id?: number
    contacts?: string
    needs_media_capture?: boolean
    needs_tech_support?: boolean
    title_ru?: string | null
    title_kz?: string | null
    title_en?: string | null
    description_ru?: string | null
    description_kz?: string | null
    description_en?: string | null
  }
}

export type SelectOpt = { value: string | number; label: string }

export type SelectedEventDetail = {
  id: string
  type: string
  start: Date
  end: Date
  organization: string
  place: string
  description: string
  needs_media: boolean
  needs_tech: boolean
  is_owner: boolean
  structural_subdivision_id: number | null
  place_id: number | null
  event_type_id: number | null
  contacts: string
  needs_media_capture: boolean
  needs_tech_support: boolean
  title_ru: string
  title_kz: string
  title_en: string
  description_ru: string
  description_kz: string
  description_en: string
}

export type CreateEventFormState = {
  structural_subdivision_id: number | null
  place_id: number | null
  start_datetime_local: string
  end_datetime_local: string
  title_ru: string
  title_kz: string
  title_en: string
  description_ru: string
  description_kz: string
  description_en: string
  contacts: string
  needs_media_capture: boolean
  needs_tech_support: boolean
  event_type_id: number
}

export type CalendarEventInput = EventInput

