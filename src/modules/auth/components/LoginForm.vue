<template>
  <Modal
      :model-value="messageModal"
      title="Упс"
  >

    <template #body>
      <div class="flex flex-col justify-center items-center min-w-[20vw] min-h-[12vh]">
        <Alert
            variant="error"
            title="Произошла ошибка"
            :message="errors.serverMessage || ''"
        />
      </div>
    </template>

    <template #footer>
      <div class="flex flex-col justify-center items-center">
        <BaseButton
            :variant="'outline'"
            size="sm"
            @click="messageModal = false; errors.serverMessage = null"
        >
          Закрыть
        </BaseButton>
      </div>
    </template>
  </Modal>
  <form @submit.prevent="handleSubmit" class="grid gap-4">
    <BaseInput
        v-model="form.login"
        :label="loginLabel"
        name="login"
        type="text"
        inputmode="numeric"
        placeholder="Логин"
        autocomplete="login"
        :is_error="errors.login"
        clearable
        block
        @blur="touched.login = true"
        @change="errors.login = false; errors.serverMessage = null"
    />

    <BaseInput
        v-model="form.password"
        :label="passwordLabel"
        name="password"
        type="password"
        placeholder="Пароль"
        autocomplete="current-password"
        :is_error="errors.password"
        passwordToggle
        block
        @blur="touched.password = true"
        @change="errors.password = false; errors.serverMessage = null"
    />
    <label
        for="keepLoggedIn"
        class="flex items-center text-sm font-normal text-gray-700 cursor-pointer select-none dark:text-gray-400"
    >
      <span class="relative">
        <input
            v-model="remember"
            type="checkbox"
            id="keepLoggedIn"
            class="sr-only"
        />
        <span
            :class="
              remember
                ? 'border-brand-500 bg-brand-500'
                : 'bg-transparent border-gray-300 dark:border-gray-700'
            "
            class="mr-3 flex h-5 w-5 items-center justify-center rounded-md border-[1.25px]"
        >
          <span :class="remember ? '' : 'opacity-0'">
            <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
              <path
                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                  stroke="white"
                  stroke-width="1.94437"
                  stroke-linecap="round"
                  stroke-linejoin="round"
              />
            </svg>
          </span>
        </span>
      </span>
      {{ rememberLabel }}
    </label>



    <BaseButton
        :type="'submit'"
        :disabled="authStore.loading"
    >
      {{ submitLabel }}
    </BaseButton>

    <Divider label="или" />

    <BaseButton
        :variant="'primaryGreen'"
        :disabled="authStore.loading"
        @click="onEcpLoginClick"
    >
      {{ ecpSubmitLabel }}
    </BaseButton>

  </form>
</template>

<script setup lang="ts">

import { computed, reactive, ref} from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../store/auth.store'
import { PlatonusLoginRequest } from '../types/auth'

import BaseButton from "@/components/ui/BaseButton.vue";
import BaseInput from '@/components/ui/BaseInput.vue'
import Divider from '@/components/ui/Divider.vue'
import Modal from "@/components/ui/Modal.vue";
import Alert from "@/components/ui/Alert.vue";
import {ErrorIcon} from "@/components/icons";


const authStore = useAuthStore()
const router = useRouter()
const ecpLoginLoading = ref(false)
const remember = ref(false)
const messageModal = ref(false)

defineProps({
  loginLoading: { type: Boolean, default: false },
  ecpLoginLoading: { type: Boolean, default: false },
  errorMessage: { type: String, default: null },
  loginLabel: { type: String, default: 'Логин' },
  passwordLabel: { type: String, default: 'Пароль' },
  submitLabel: { type: String, default: 'Войти' },
  ecpSubmitLabel: { type: String, default: 'Войти через ЭЦП' },
  rememberLabel: { type: String, default: 'Запомнить меня' },
  showRemember: { type: Boolean, default: true },
})


type Errors = {
  login: boolean
  password: boolean
  serverMessage: string | null
}

const errors = reactive<Errors>({
  login: false,
  password: false,
  serverMessage: null,
})


const hasError = computed(() => Object.values(errors).some(Boolean))

const form = reactive<PlatonusLoginRequest>({
  login: '',
  password: '',
  remember: false,
})

const touched = reactive({
  login: false,
  password: false,
})

// ---- ECP login ----

async function onEcpLoginClick(ev: MouseEvent) {
  ev.preventDefault()
  if (ecpLoginLoading.value) return

  await authStore.loginWithEcp()

  if (authStore.error) {
    errors.serverMessage = authStore.error
    messageModal.value = true
  } else {
    await router.push({ name: 'docs' })
  }
}

async function handleSubmit() {
  if (form.login === ''){errors.login = true}
  if (!form.password){errors.password = true}

  if (hasError.value) return

  await authStore.loginWithPlatonus(form)

  if (authStore.error) {
    errors.serverMessage = authStore.error
    messageModal.value = true

  }
  else {
    await router.push({name: 'docs'})
  }
}

</script>
