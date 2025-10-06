// stores/uiStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
    const isLoading = ref(false)

    function showLoader() {
        isLoading.value = true
    }

    function hideLoader() {
        isLoading.value = false
    }

    return { isLoading, showLoader, hideLoader }
})
