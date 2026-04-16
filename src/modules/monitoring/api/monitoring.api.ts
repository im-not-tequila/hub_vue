import httpClient from '@/api/httpClient'
import type {
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

export const listEmployeeAccessLogs = (platonusId: number, startDate: string, endDate: string) =>
  httpClient.get<StaffAccessLogItem[]>(`/monitoring/employees/staff/${platonusId}/access-logs`, {
    params: { start_date: startDate, end_date: endDate },
  })

export const listStaffFirstIn = (date?: string) =>
  httpClient.get<StaffFirstInItem[]>('/monitoring/employees/staff/list/punctuality', {
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
  httpClient.get<StructuralSubdivisionItem[]>('/structural-subdivisions')

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

