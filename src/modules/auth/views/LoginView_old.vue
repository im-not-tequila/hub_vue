<script setup>
import LoginForm from '../components/LoginForm.vue'
import logoUrl from '@/assets/logo/logo_blue_nobg_sm.png'

</script>

<template>
  <div class="login-page">
    <img class="login-logo" :src="logoUrl" alt="Логотип" />

    <div class="login-card">
      <h1 class="login-title">Вход через Platonus</h1>
      <LoginForm />
    </div>
  </div>
</template>

<style scoped>
.login-page {
  width: 100%;
  min-height: 100dvh;
  display: flex;
  flex-direction: column; /* логотип над карточкой */
  align-items: center;    /* центрируем по горизонтали */
  justify-content: center;/* центрируем по вертикали */
  gap: 2rem;
  padding: 1rem; /* небольшой отступ по краям на малых экранах */
  color: #32393f;
  background: linear-gradient(135deg, #e0f2fe, #bfdbfe);
}

.login-card {
  width: 100%;
  max-width: 420px;         /* фиксируем максимальную ширину карточки */
  background: #ffffff;
  border: 1px solid #e2e8f0; /* тонкая рамка */
  border-radius: 0.75rem;
  padding: 1.25rem;
  box-shadow: 0 6px 24px rgba(15, 23, 42, 0.06);
}

.login-title {
  margin: 0 0 0.75rem;
  font-family: 'Roboto', sans-serif;
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}

.login-logo {
  width: 100%;
  max-width: 420px;          /* подберите нужный размер */
  height: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.08));
  user-select: none;
  pointer-events: none;
}

</style>