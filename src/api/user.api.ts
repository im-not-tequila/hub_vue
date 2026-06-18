import httpClient from '@/api/httpClient'
import type { User, Vice } from "@/types/user";


export const getProfile = () =>
    httpClient.get<User>('/user/me')

export const getSidebarSections = () =>
    httpClient.get<string[]>('/user/me/sidebar-sections')


export const logout = () =>
    httpClient.post('/auth/logout')


export const vices = (structural_subdivision_id: number) =>
    httpClient.get<Vice[]>('/user/vices', {
        params: { structural_subdivision_id }
    })
