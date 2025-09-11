<script setup lang="ts">

import { computed, reactive, ref} from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '../store/auth.store'
import { PlatonusLoginRequest } from '../types/auth'

import Button from "@/components/ui/Button.vue";
import BaseInput from '@/components/ui/BaseInput.vue'
import Divider from '@/components/ui/Divider.vue'


const authStore = useAuthStore()
const router = useRouter()
const loginLoading = ref(false)
const ecpLoginLoading = ref(false)
const loginErrorMessage = ref<string | null>(null)
const remember = ref(false)


const props = withDefaults(defineProps<{
  loginLoading?: boolean
  ecpLoginLoading?: boolean
  errorMessage?: string | null
  loginLabel?: string
  passwordLabel?: string
  submitLabel?: string
  ecpSubmitLabel?: string
  rememberLabel?: string
  showRemember?: boolean
}>(), {
  loginLoading: false,
  ecpLoginLoading: false,
  errorMessage: null,
  loginLabel: 'Логин',
  passwordLabel: 'Пароль',
  submitLabel: 'Войти',
  ecpSubmitLabel: 'Войти через ЭЦП',
  rememberLabel: 'Запомнить меня',
  showRemember: true,
})

const form = reactive<PlatonusLoginRequest>({
  login: '',
  password: '',
  remember: false,
})

const touched = reactive({
  login: false,
  password: false,
})

const loginError = computed(() => {
  if (!touched.login && !props.errorMessage) return ''
  if (!form.login) return 'Введите логин'
  return ''
})

const passwordError = computed(() => {
  if (!touched.password && !props.errorMessage) return ''
  if (!form.password) return 'Введите пароль'
  return ''
})

// ---- ECP login ----

async function onEcpLoginClick(ev: MouseEvent) {
  ev.preventDefault()
  if (ecpLoginLoading.value) return

  try {
    await authStore.loginWithEcp()
    await router.push({ name: 'docs' })
  } catch (error) {
    console.error('Ошибка при ECP логине:', error)
  }
}

async function handleSubmit() {
  await authStore.loginWithPlatonus(form)

  if (authStore.error) {
    loginErrorMessage.value = authStore.error
  }
  else {
    await router.push({name: 'docs'})
  }
}

</script>

<template>
  <form @submit.prevent="handleSubmit" class="login">
    <div class="login__fields">
      <BaseInput
          v-model="form.login"
          :label="loginLabel"
          name="login"
          type="text"
          inputmode="numeric"
          placeholder="Логин"
          autocomplete="login"
          :error="loginError || undefined"
          clearable
          block
          @blur="touched.login = true"
      />

      <BaseInput
          v-model="form.password"
          :label="passwordLabel"
          name="password"
          type="password"
          placeholder="Пароль"
          autocomplete="current-password"
          :error="passwordError || undefined"
          passwordToggle
          block
          @blur="touched.password = true"
      />

    </div>

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

    <p v-if="errorMessage" class="login__error" role="alert">
      {{ errorMessage }}
    </p>

    <p v-if="loginErrorMessage" class="text-center text-error-500" role="alert">
      {{ loginErrorMessage }}
    </p>

    <Button
        :type="'submit'"
        :disabled="authStore.loading"
    >
      {{ submitLabel }}
    </Button>

    <Divider label="или" />

    <Button
        :variant="'primaryGreen'"
        :disabled="authStore.loading"
        @click="onEcpLoginClick"
    >
      {{ ecpSubmitLabel }}
    </Button>

  </form>
</template>

<style scoped>
.login {
  display: grid;
  gap: 1rem;
}

.login__fields {
  display: grid;
  gap: 0.75rem;
}

.login__error {
  color: #b91c1c; /* red-700 */
  font-size: 0.9375rem;
}
</style>