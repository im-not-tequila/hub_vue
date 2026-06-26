import httpClient from '@/api/httpClient'
import type { OsHolding } from '@/modules/user-profile/types/osInventory'

export const getMyHoldings = () =>
    httpClient.get<OsHolding[]>('/os-inventory/me/holdings')
