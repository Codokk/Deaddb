<template>
  <header class="sticky top-0 z-40 border-b border-surface-border bg-surface/80 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
      <!-- Logo -->
      <RouterLink to="/" class="flex items-center gap-2 shrink-0">
        <svg class="w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12" stroke="#8b5cf6" stroke-width="2" />
          <circle cx="16" cy="16" r="4" fill="#ec4899" />
          <line x1="16" y1="4" x2="16" y2="28" stroke="#1e1e30" stroke-width="1.5" />
          <line x1="4" y1="16" x2="28" y2="16" stroke="#1e1e30" stroke-width="1.5" />
        </svg>
        <span class="font-bold text-lg tracking-tight gradient-text">DeadDB</span>
      </RouterLink>

      <!-- Right side -->
      <div class="flex items-center gap-3">
        <template v-if="auth.isLoggedIn">
          <button class="btn-primary" @click="$emit('open-submit')">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Submit Song
          </button>
          <div class="relative" v-click-outside="closeMenu">
            <button class="btn-ghost flex items-center gap-2" @click="menuOpen = !menuOpen">
              <img
                v-if="auth.user?.avatarUrl"
                :src="auth.user.avatarUrl"
                class="w-7 h-7 rounded-full"
                alt="avatar"
              />
              <div v-else class="w-7 h-7 rounded-full bg-brand-purple/40 flex items-center justify-center text-xs font-medium text-brand-violet">
                {{ initials }}
              </div>
              <svg class="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="menuOpen"
              class="absolute right-0 top-full mt-2 w-44 bg-surface-card border border-surface-border rounded-xl py-1 shadow-xl shadow-black/40"
            >
              <div class="px-3 py-2 text-xs text-gray-500 border-b border-surface-border truncate">
                {{ auth.user?.email }}
              </div>
              <button
                class="w-full text-left px-3 py-2 text-sm text-gray-300 hover:bg-surface-hover hover:text-white transition-colors"
                @click="handleLogout"
              >
                Sign out
              </button>
            </div>
          </div>
        </template>
        <template v-else>
          <button class="btn-secondary" @click="handleLogin" :disabled="loggingIn">
            <svg v-if="!loggingIn" class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <svg v-else class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            {{ loggingIn ? 'Signing in…' : 'Sign in with Google' }}
          </button>
        </template>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

defineEmits(['open-submit'])

const auth = useAuthStore()
const menuOpen = ref(false)
const loggingIn = ref(false)

const initials = computed(() => {
  const name = auth.user?.name || auth.user?.email || '?'
  return name.slice(0, 2).toUpperCase()
})

const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (e) => {
      if (!el.contains(e.target)) binding.value()
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  },
}

function closeMenu() {
  menuOpen.value = false
}

async function handleLogin() {
  loggingIn.value = true
  try {
    await auth.loginWithGoogle()
  } catch (e) {
    console.error('Login failed', e)
  } finally {
    loggingIn.value = false
  }
}

function handleLogout() {
  auth.logout()
  menuOpen.value = false
}
</script>
