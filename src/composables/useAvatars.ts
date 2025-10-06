import httpClient from '@/api/httpClient'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";

const cache = new Map<number, string>() // user_id → blob url

export const useAvatars = () => {
    const getAvatarSrc = async (user_id: number | undefined) => {
        if (!user_id) return new URL(noUserpicUrl, import.meta.url).href

        if (cache.has(user_id)) return cache.get(user_id)!

        try {
            const response = await httpClient.get(`/user/${user_id}/avatar`, {
                responseType: 'blob',
            })
            const blobUrl = URL.createObjectURL(response.data)
            cache.set(user_id, blobUrl)
            return blobUrl
        } catch {
            const fallback = new URL(noUserpicUrl, import.meta.url).href
            cache.set(user_id, fallback)
            return fallback
        }
    }

    return { getAvatarSrc }
}
