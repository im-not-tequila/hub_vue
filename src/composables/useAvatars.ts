import httpClient from '@/api/httpClient'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";

const cache = new Map<number, string>()

export const useAvatars = () => {
    const getAvatarSrc = async (user_id: number | undefined) => {
        if (!user_id) return new URL(noUserpicUrl, import.meta.url).href

        // ❌ не использовать blobUrl из старого кэша
        if (cache.has(user_id)) {
            const cachedUrl = cache.get(user_id)!
            // Проверяем, жив ли blob (если URL из blob)
            if (!cachedUrl.startsWith('blob:')) return cachedUrl
            try {
                const res = await fetch(cachedUrl)
                if (res.ok) return cachedUrl
            } catch {
                // blob мёртв — перезапрос
            }
        }

        try {
            const response = await httpClient.get(`/user/${user_id}/avatar`, {
                responseType: 'blob',
            })
            const blobUrl = URL.createObjectURL(response.data)
            cache.set(user_id, blobUrl)
            return blobUrl
        } catch (err) {
            console.error('Ошибка при загрузке аватарки', err)
            const fallback = new URL(noUserpicUrl, import.meta.url).href
            cache.set(user_id, fallback)
            return fallback
        }
    }

    return { getAvatarSrc }
}