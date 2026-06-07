import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import pb from '../lib/pocketbase'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(pb.authStore.model)
  const isLoggedIn = computed(() => pb.authStore.isValid)

  pb.authStore.onChange((token, model) => {
    user.value = model
  })

  async function loginWithGoogle() {
    const authData = await pb.collection('users').authWithOAuth2({ provider: 'google' })
    user.value = authData.record
    return authData
  }

  function logout() {
    pb.authStore.clear()
    user.value = null
  }

  return { user, isLoggedIn, loginWithGoogle, logout }
})
