<template>
  <div class="max-w-6xl mx-auto px-4 py-10">
    <!-- Hero -->
    <div class="text-center mb-10">
      <h1 class="text-4xl sm:text-5xl font-bold tracking-tight mb-3">
        <span class="gradient-text">DeadDB</span>
      </h1>
      <p class="text-gray-400 text-lg max-w-lg mx-auto">
        Community database of Dead by Disco songs — BPM, lag, and YouTube links in one place.
      </p>
    </div>

    <!-- Search + controls -->
    <div class="flex flex-col sm:flex-row gap-3 mb-8">
      <div class="relative flex-1">
        <svg class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          v-model="searchQuery"
          type="search"
          class="input-field pl-10"
          placeholder="Search songs by name or BPM…"
          @input="onSearch"
        />
      </div>
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 whitespace-nowrap">
          {{ songs.totalItems }} song{{ songs.totalItems !== 1 ? 's' : '' }}
        </span>
        <button
          v-if="auth.isLoggedIn"
          class="btn-primary sm:hidden"
          @click="localModalOpen = true"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Submit
        </button>
      </div>
    </div>

    <!-- Loading skeleton -->
    <div v-if="songs.loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div
        v-for="n in 9"
        :key="n"
        class="card animate-pulse"
      >
        <div class="h-5 bg-surface-border rounded w-3/4 mb-3" />
        <div class="flex gap-2 mb-3">
          <div class="h-5 bg-surface-border rounded w-20" />
          <div class="h-5 bg-surface-border rounded w-24" />
        </div>
        <div class="h-3 bg-surface-border rounded w-1/2 mt-4" />
      </div>
    </div>

    <!-- Error -->
    <div v-else-if="songs.error" class="text-center py-16">
      <p class="text-red-400 mb-4">{{ songs.error }}</p>
      <button class="btn-secondary" @click="load">Retry</button>
    </div>

    <!-- Empty state -->
    <div v-else-if="songs.songs.length === 0" class="text-center py-20">
      <div class="w-16 h-16 rounded-full bg-surface-card border border-surface-border flex items-center justify-center mx-auto mb-4">
        <svg class="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
      </div>
      <p class="text-gray-400 text-lg font-medium mb-1">
        {{ searchQuery ? 'No songs match your search' : 'No songs yet' }}
      </p>
      <p class="text-gray-600 text-sm mb-6">
        {{ searchQuery ? 'Try a different name or BPM.' : 'Be the first to submit a song.' }}
      </p>
      <button v-if="auth.isLoggedIn && !searchQuery" class="btn-primary" @click="localModalOpen = true">
        Submit the first song
      </button>
      <button v-else-if="!auth.isLoggedIn && !searchQuery" class="btn-secondary" @click="auth.loginWithGoogle()">
        Sign in to submit
      </button>
    </div>

    <!-- Song grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <SongCard v-for="song in songs.songs" :key="song.id" :song="song" />
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center gap-2 mt-10">
      <button
        class="btn-secondary px-3 py-2"
        :disabled="songs.currentPage === 1"
        @click="changePage(songs.currentPage - 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <span class="flex items-center px-4 text-sm text-gray-400">
        Page {{ songs.currentPage }} of {{ totalPages }}
      </span>
      <button
        class="btn-secondary px-3 py-2"
        :disabled="songs.currentPage === totalPages"
        @click="changePage(songs.currentPage + 1)"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <!-- Submit modal -->
    <SubmitSongModal
      :show="localModalOpen"
      @close="localModalOpen = false"
      @submitted="onSubmitted"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useSongsStore } from '../stores/songs'
import { useAuthStore } from '../stores/auth'
import SongCard from '../components/SongCard.vue'
import SubmitSongModal from '../components/SubmitSongModal.vue'

const props = defineProps({
  submitModalOpen: { type: Boolean, default: false },
})

const emit = defineEmits(['update:submitModalOpen'])

const songs = useSongsStore()
const auth = useAuthStore()

const searchQuery = ref('')
const localModalOpen = ref(false)
let searchTimer = null

watch(() => props.submitModalOpen, (val) => {
  localModalOpen.value = val
})

watch(localModalOpen, (val) => {
  emit('update:submitModalOpen', val)
})

const totalPages = computed(() =>
  Math.ceil(songs.totalItems / songs.perPage)
)

function onSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => {
    songs.fetchSongs(searchQuery.value, 1)
  }, 300)
}

function changePage(page) {
  songs.fetchSongs(searchQuery.value, page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function onSubmitted() {
  songs.fetchSongs(searchQuery.value, 1)
}

function load() {
  songs.fetchSongs('', 1)
}

onMounted(() => {
  load()
})
</script>
