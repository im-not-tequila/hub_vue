import httpClient from '@/api/httpClient'
import { visitHistoryWorkingHoursResponse } from "@/modules/visit-history/types/visitHistory";
import {visitHistoryBarrierResponse} from "@/modules/visit-history/types/visitHistory";


export const visitHistoryWorkingHours = (date_start: string, date_finish: string) =>
    httpClient.get<visitHistoryWorkingHoursResponse[]>('/user/visit-history/working-hours', {
        params: {
            start_date: date_start,
            finish_date: date_finish,
        },
    })

export const visitHistoryBarrier = (target_date: string) =>
    httpClient.get<visitHistoryBarrierResponse[]>('/user/visit-history/barrier', {
        params: {
            target_date: target_date
        },
    })

