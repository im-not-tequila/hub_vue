import noUserpicUrl from '@/assets/images/user/no_userpic.jpg'
import httpClient from '@/api/httpClient'
import { ref, watch, type MaybeRefOrGetter, toValue } from 'vue'

const AIS_PPS_AVATAR_BASE = 'https://ais.semgu.kz/dist/img/pps'

/** Стабильный URL заглушки (для подстановки в img при ошибке загрузки). */
export const USER_AVATAR_PLACEHOLDER_URL = new URL(noUserpicUrl, import.meta.url).href

const platonusIdByUserId = new Map<number, number | null>()
const pendingPlatonusFetches = new Map<number, Promise<number | null>>()

function aisAvatarUrl(platonusId: number): string {
  return `${AIS_PPS_AVATAR_BASE}/${platonusId}.jpg`
}

/** URL фото на AIS по уже известному platonus_id (без запроса к API). */
export function userAvatarUrlFromPlatonusId(platonusId: number | null | undefined): string {
  if (platonusId == null || Number.isNaN(platonusId)) {
    return USER_AVATAR_PLACEHOLDER_URL
  }
  return aisAvatarUrl(platonusId)
}

async function fetchPlatonusIdByUserId(userId: number): Promise<number | null> {
  if (platonusIdByUserId.has(userId)) {
    return platonusIdByUserId.get(userId)!
  }

  let pending = pendingPlatonusFetches.get(userId)
  if (!pending) {
    pending = (async () => {
      try {
        const { data } = await httpClient.get<{ platonus_id: number | null }>(
          `/user/${userId}/platonus_id`
        )
        const pid = data.platonus_id ?? null
        platonusIdByUserId.set(userId, pid)
        return pid
      } catch {
        // Не кешируем null при сетевой/авторизационной ошибке:
        // иначе временный сбой "залипает" как отсутствие platonus_id навсегда.
        return null
      } finally {
        pendingPlatonusFetches.delete(userId)
      }
    })()
    pendingPlatonusFetches.set(userId, pending)
  }

  return pending
}

/**
 * URL аватара на AIS: по hub user_id запрашивается platonus_id, затем собирается ссылка.
 * Для «системных» отправителей (null id) используйте отдельный ассет, не эту функцию.
 */
export async function userAvatarUrl(userId: number | null | undefined): Promise<string> {
  if (userId == null || Number.isNaN(userId)) {
    return USER_AVATAR_PLACEHOLDER_URL
  }

  const platonusId = await fetchPlatonusIdByUserId(userId)
  return userAvatarUrlFromPlatonusId(platonusId)
}

/** Реактивный URL аватара по hub user_id (запрос platonus_id + кеш). */
export function useUserAvatarUrl(userId: MaybeRefOrGetter<number | null | undefined>) {
  const url = ref<string>('')

  watch(
    () => toValue(userId),
    (id) => {
      if (id == null || Number.isNaN(id)) {
        url.value = ''
        return
      }

      url.value = USER_AVATAR_PLACEHOLDER_URL

      void userAvatarUrl(id).then((resolved) => {
        if (toValue(userId) === id) {
          url.value = resolved
        }
      })
    },
    { immediate: true }
  )

  return url
}

export function onUserAvatarImgError(event: Event): void {
  const target = event.target as HTMLImageElement | null
  if (target) {
    target.src = USER_AVATAR_PLACEHOLDER_URL
  }
}
