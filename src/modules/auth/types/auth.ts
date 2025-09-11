import type { User } from '@/types/user'


export interface AuthState {
    loading: boolean
    error: string | null
}

export interface PlatonusLoginRequest {
    login: string
    password: string
    remember?: boolean
}

export interface PlatonusLoginResponse {
    access_token: string
    user: User
}

export interface NcalayerChallengeResponse {
    challenge: string
}

export interface NcalayerVerifyRequest {
    signed_data: string
    original_data: string
}

export interface NcalayerVerifyResponse {
    access_token: string
    user: User
}
