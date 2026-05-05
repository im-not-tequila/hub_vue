import httpClient from '@/api/httpClient'
import type {
  CafedraItem,
  StaffAcademicListItem,
  StaffAcademicDetailItem,
  StaffAcademicFirstInItem,
  ArrivalStatus,
  StructuralSubdivisionItem,
  StaffAccessLogItem,
  StaffDetailItem,
  StaffFirstInItem,
  StaffListItem,
  StaffPunctualityStatsItem,
  StaffWorkScheduleItem,
  WorkScheduleType,
} from '@/modules/monitoring/types/staff'

export const listActiveStaff = () => httpClient.get<StaffListItem[]>('/monitoring/employees/staff/list/active')
export const listActiveAcademic = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
  httpClient.get<StaffAcademicListItem[]>('/monitoring/employees/academic/list/active', {
    params: { lang },
  })

export interface ExportActiveStaffParams {
  structural_subdivision_id?: number
  search?: string
}

export const exportActiveStaffExcel = (params: ExportActiveStaffParams) =>
  httpClient.get('/monitoring/employees/staff/list/active/excel', {
    params,
    responseType: 'blob',
  })

export const getEmployeeStaff = (platonusId: number) =>
  httpClient.get<StaffDetailItem>(`/monitoring/employees/staff/${platonusId}`)

export const getEmployeeAcademic = (platonusId: number, lang: 'ru' | 'kz' | 'en' = 'ru') =>
  httpClient.get<StaffAcademicDetailItem>(`/monitoring/employees/academic/${platonusId}`, {
    params: { lang },
  })

export const listEmployeeAccessLogs = (platonusId: number, startDate: string, endDate: string) =>
  httpClient.get<StaffAccessLogItem[]>(`/monitoring/employees/${platonusId}/access-logs`, {
    params: { start_date: startDate, end_date: endDate },
  })

export const listStaffFirstIn = (date?: string) =>
  httpClient.get<StaffFirstInItem[]>('/monitoring/employees/staff/list/punctuality', {
    params: { date },
  })

export const listAcademicFirstIn = (date?: string) =>
  httpClient.get<StaffAcademicFirstInItem[]>('/monitoring/employees/academic/list/punctuality', {
    params: { date },
  })

export const listActiveEmployeesPunctualityStats = (startDate: string, endDate: string) =>
  httpClient.get<StaffPunctualityStatsItem[]>('/monitoring/employees/staff/list/active/punctuality/stats', {
    params: { start_date: startDate, end_date: endDate },
  })

export interface ExportPunctualityParams {
  startdate?: string
  enddate?: string
  arrival_status?: ArrivalStatus | 'ABSENT'
  schedule_type?: WorkScheduleType
  perco_status_name?: string
  search?: string
}

export const exportStaffPunctualityExcel = (params: ExportPunctualityParams) =>
  httpClient.get('/monitoring/employees/staff/list/punctuality/excel', {
    params,
    responseType: 'blob',
  })

export interface PercoStatusItem {
  id: number
  name: string | null
}

export const listPercoStatuses = () => httpClient.get<PercoStatusItem[]>('/perco/status')

export const listStructuralSubdivisions = () =>
  httpClient.get<StructuralSubdivisionItem[]>('/structure/list/subdivision')

export const listUsedCafedras = (lang: 'ru' | 'kz' | 'en' = 'ru') =>
  httpClient.get<CafedraItem[]>('/structure/cafedras', {
    params: { lang },
  })

export interface StaffWorkSchedulePayload {
  start_date: string
  end_date: string | null
  work_start_time: string
  work_end_time: string
}

export const listEmployeeWorkSchedules = (platonusId: number) =>
  httpClient.get<StaffWorkScheduleItem[]>(`/monitoring/employees/staff/${platonusId}/work-schedules`)

export const createEmployeeWorkSchedule = (platonusId: number, payload: StaffWorkSchedulePayload) =>
  httpClient.post<StaffWorkScheduleItem>(`/monitoring/employees/staff/${platonusId}/work-schedules`, payload)

export const updateEmployeeWorkSchedule = (platonusId: number, scheduleId: number, payload: StaffWorkSchedulePayload) =>
  httpClient.put<StaffWorkScheduleItem>(`/monitoring/employees/staff/${platonusId}/work-schedules/${scheduleId}`, payload)

export const deleteEmployeeWorkSchedule = (platonusId: number, scheduleId: number) =>
  httpClient.delete(`/monitoring/employees/staff/${platonusId}/work-schedules/${scheduleId}`)

