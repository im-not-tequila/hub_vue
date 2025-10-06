import httpClient from '@/api/httpClient'
import noUserpicUrl from "@/assets/images/user/no_userpic.jpg";


export const useAvatars = () => {
    const getAvatarSrc = async (user_id?: number) => {
        if (!user_id) return new URL(noUserpicUrl, import.meta.url).href

        try {
            const response = await httpClient.get(`/user/${user_id}/avatar`, { responseType: 'blob' })
            console.log(response.data)
            console.log('1111111111111111111111111111111111111')
            const newUrl = URL.createObjectURL(response.data)
            console.log(newUrl)
            return newUrl
        } catch {
            return new URL(noUserpicUrl, import.meta.url).href
        }
    }


    return { getAvatarSrc }
}
