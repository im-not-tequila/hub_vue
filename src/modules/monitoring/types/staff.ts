export type StaffAbsenceStatus = string | null

export interface StaffListItem {
  platonus_id: number
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  absence_status: StaffAbsenceStatus
  structural_subdivision_id: number | null
  structural_subdivision_name: string | null
  rate: number | null
  position_name: string | null
}

export interface StaffAcademicPositionItem {
  cafedra_id: number | null
  cafedra_name: string | null
  position_name: string | null
  rate: number | null
}

export interface StaffAcademicListItem {
  platonus_id: number
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  positions: StaffAcademicPositionItem[]
}

export interface StaffAcademicDetailItem {
  iin: string | null
  platonus_id: number
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  mobile_phone: string | null
  is_married: number | null
  address: string | null
  birth_date: string | null
  nationality: string | null
  positions: StaffAcademicPositionItem[]
}

interface StaffAcademicWithPositions {
  positions: StaffAcademicPositionItem[]
}

export interface StructuralSubdivisionItem {
  id: number
  dean: number
  pre: number
  name: string | null
  subdivision_type: number | null
  faculty_cafedra_id: number | null
}

export interface CafedraItem {
  id: number
  name: string | null
  faculty_id: number | null
}

export interface StaffDetailItem {
  iin: string | null
  platonus_id: number
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  absence_status: StaffAbsenceStatus
  structural_subdivision_name: string | null
  mobile_phone: string | null
  is_married: number | null
  address: string | null
  birth_date: string | null
  rate: number | null
  nationality: string | null
  position_name: string | null
}

export interface StaffAccessLogItem {
  control_name: string
  createdate: string
  inoutdata: string
}

export interface StaffWorkScheduleItem {
  id: number
  user_id: number
  start_date: string
  end_date: string | null
  work_start_time: string
  work_end_time: string
}

export type ArrivalStatus = 'BEFORE_SHIFT_START' | 'WITHIN_GRACE_PERIOD' | 'LATE'
export type WorkScheduleType = 'DEFAULT' | 'CUSTOM'

export interface StaffFirstInItem {
  platonus_id: number | null
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  absence_status: StaffAbsenceStatus
  structural_subdivision_name: string | null
  position_name: string | null
  createdate: string | null
  arrival_status: ArrivalStatus | null
  perco_status_name: string | null
  work_schedule: string | null
  work_schedule_type: WorkScheduleType | null
}

export interface StaffPunctualityStatsItem {
  platonus_id: number
  user_id: number | null
  full_name: string
  structural_subdivision_id: number | null
  structural_subdivision_name: string | null
  position_name: string | null
  before_shift_start_count: number
  within_grace_period_count: number
  late_count: number
  no_show_count: number
  working_hours: number
}

export interface StaffAcademicFirstInItem {
  platonus_id: number
  user_id: number | null
  lastname: string | null
  firstname: string | null
  patronomic: string | null
  createdate: string | null
  arrival_status: ArrivalStatus | null
  perco_status_name: string | null
  positions: StaffAcademicPositionItem[]
}

export function staffFullName(staff: {
  lastname?: string | null
  firstname?: string | null
  patronomic?: string | null
  // встречается в разных источниках/версии API
  patronymic?: string | null
}) {
  const patronymic = staff.patronomic ?? staff.patronymic ?? null
  return [staff.lastname, staff.firstname, patronymic].filter(Boolean).join(' ').trim()
}

function uniqueNonEmpty(values: Array<string | null | undefined>): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const rawValue of values) {
    const value = (rawValue ?? '').trim()
    if (!value || seen.has(value)) {
      continue
    }
    seen.add(value)
    out.push(value)
  }
  return out
}

export function academicCafedraDisplay(staff: StaffAcademicWithPositions): string {
  const values = uniqueNonEmpty(staff.positions.map((position) => position.cafedra_name))
  return values.length ? values.join(', ') : '—'
}

export function academicPositionDisplay(staff: StaffAcademicWithPositions): string {
  const values = uniqueNonEmpty(staff.positions.map((position) => position.position_name))
  return values.length ? values.join(', ') : '—'
}

export function academicTotalRate(staff: StaffAcademicWithPositions): number | null {
  let hasAnyRate = false
  let total = 0
  for (const position of staff.positions) {
    if (position.rate == null) {
      continue
    }
    hasAnyRate = true
    total += Number(position.rate)
  }
  return hasAnyRate ? total : null
}

