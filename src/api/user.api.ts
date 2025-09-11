import httpClient from '@/api/httpClient'
import type { User } from "@/types/user";

export const getProfile = () =>
    httpClient.get<User>('/user/me')
