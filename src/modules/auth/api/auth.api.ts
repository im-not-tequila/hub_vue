import httpClient from '@/api/httpClient'
import {
    PlatonusLoginRequest, PlatonusLoginResponse, NcalayerVerifyRequest, NcalayerVerifyResponse, NcalayerChallengeResponse,
} from '../types/auth'


export const platonusLogin = (data: PlatonusLoginRequest) => {
    return httpClient.post<PlatonusLoginResponse>('/auth/platonus/login', data)
}

export const ncalayerChallenge = () =>
    httpClient.get<NcalayerChallengeResponse>('/auth/ncalayer/challenge')

export const ncalayerVerify = (data: NcalayerVerifyRequest) =>
    httpClient.post<NcalayerVerifyResponse>('/auth/ncalayer/verify', data)

export const logout = () =>
    httpClient.post('/auth/logout')
