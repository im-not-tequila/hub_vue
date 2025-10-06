import httpClient from '@/api/httpClient'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";

const cache = new Map<number, string>()

export const useAvatars = () => {
    const getAvatarSrc = async (user_id?: number) => {
        if (!user_id) return new URL(noUserpicUrl, import.meta.url).href

        try {
            const response = await httpClient.get(`/user/${user_id}/avatar`, { responseType: 'blob' })
            return URL.createObjectURL(response.data)
        } catch {
            return new URL(noUserpicUrl, import.meta.url).href
        }
    }


    return { getAvatarSrc }
}