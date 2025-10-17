import httpClient from '@/api/httpClient'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";

const avatarCache = new Map<number, string>()  // кеш по user_id
const defaultAvatarUrl = new URL(noUserpicUrl, import.meta.url).href

export const useAvatars = () => {
    const getAvatarSrc = async (user_id?: number): Promise<string> => {
        if (!user_id) return defaultAvatarUrl

        // 1. Проверяем кеш
        const cached = avatarCache.get(user_id)
        if (cached) return cached

        try {
            const response = await httpClient.get(`/user/${user_id}/avatar`, {
                responseType: 'blob',
                validateStatus: status => status === 200 || status === 204 || status === 404
            })

            // 2. Если нет аватарки (204 или 404) — вернуть заглушку
            if (response.status === 204 || response.status === 404) {
                avatarCache.set(user_id, defaultAvatarUrl)
                return defaultAvatarUrl
            }

            // 3. Преобразуем blob → объектный URL
            const blobUrl = URL.createObjectURL(response.data)
            avatarCache.set(user_id, blobUrl)
            return blobUrl
        } catch {
            avatarCache.set(user_id, defaultAvatarUrl)
            return defaultAvatarUrl
        }
    }

    const clearAvatarCache = (user_id?: number) => {
        if (user_id) {
            const oldUrl = avatarCache.get(user_id)
            if (oldUrl && oldUrl !== defaultAvatarUrl) {
                URL.revokeObjectURL(oldUrl)
            }
            avatarCache.delete(user_id)
        } else {
            for (const [id, url] of avatarCache.entries()) {
                if (url !== defaultAvatarUrl) URL.revokeObjectURL(url)
            }
            avatarCache.clear()
        }
    }

    return { getAvatarSrc, clearAvatarCache }
}
