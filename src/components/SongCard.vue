<template>
  <article class="card group flex flex-col gap-3">
    <!-- Song name -->
    <div class="flex items-start justify-between gap-2">
      <h3 class="font-semibold text-white text-base leading-snug group-hover:text-brand-violet transition-colors line-clamp-2">
        {{ song.name }}
      </h3>
      <a
        :href="song.youtube_url"
        target="_blank"
        rel="noopener noreferrer"
        class="shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-600/30 text-red-400 hover:bg-red-600/30 hover:text-red-300 transition-all text-xs font-medium"
        title="Open on YouTube"
        @click.stop
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
        YouTube
      </a>
    </div>

    <!-- Stats row -->
    <div class="flex items-center gap-2 flex-wrap">
      <span class="badge-purple">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
        </svg>
        {{ song.bpm }} BPM
      </span>
      <span v-if="song.lag != null" class="badge-blue">
        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {{ song.lag }} ms lag
      </span>
    </div>

    <!-- Submitter -->
    <div class="flex items-center gap-1.5 text-xs text-gray-500 mt-auto pt-2 border-t border-surface-border">
      <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
      <span>{{ submitterName }}</span>
      <span class="ml-auto">{{ relativeDate }}</span>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  song: { type: Object, required: true },
})

const submitterName = computed(() => {
  return props.song.expand?.user?.name || props.song.expand?.user?.email || 'Community'
})

const relativeDate = computed(() => {
  if (!props.song.created) return ''
  const diff = Date.now() - new Date(props.song.created).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days}d ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
})
</script>
