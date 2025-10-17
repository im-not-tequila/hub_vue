export interface visitHistoryWorkingHoursResponse {
    id: number
    date: string
    working_hours: number
}

export interface visitHistoryBarrierResponse {
    id: number
    inout_data: string
    access_type: string
    building_name: string
    address: string
    time: string
}
