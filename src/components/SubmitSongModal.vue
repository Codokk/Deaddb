<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
        @mousedown.self="$emit('close')"
      >
        <Transition name="modal-content" appear>
          <div class="w-full max-w-md bg-surface-card border border-surface-border rounded-2xl shadow-2xl shadow-black/60 overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-surface-border">
              <h2 class="font-semibold text-white text-base">Submit a Song</h2>
              <button class="btn-ghost p-1" @click="$emit('close')">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <!-- Form -->
            <form class="px-6 py-5 flex flex-col gap-4" @submit.prevent="handleSubmit">
              <!-- Song name -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">
                  Song Name <span class="text-brand-pink">*</span>
                </label>
                <input
                  v-model="form.name"
                  type="text"
                  class="input-field"
                  placeholder="e.g. Ghost Train"
                  required
                  :disabled="submitting"
                />
              </div>

              <!-- BPM -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">
                  BPM <span class="text-brand-pink">*</span>
                </label>
                <input
                  v-model="form.bpm"
                  type="number"
                  class="input-field font-mono"
                  placeholder="e.g. 128"
                  min="1"
                  max="999"
                  step="0.1"
                  required
                  :disabled="submitting"
                />
              </div>

              <!-- Lag -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">
                  Lag <span class="text-gray-500 font-normal text-xs">(ms, optional)</span>
                </label>
                <input
                  v-model="form.lag"
                  type="number"
                  class="input-field font-mono"
                  placeholder="e.g. -50"
                  step="1"
                  :disabled="submitting"
                />
                <p class="mt-1 text-xs text-gray-500">Audio sync offset in milliseconds</p>
              </div>

              <!-- YouTube URL -->
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-1.5">
                  YouTube Link <span class="text-brand-pink">*</span>
                </label>
                <input
                  v-model="form.youtube_url"
                  type="url"
                  class="input-field"
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  :disabled="submitting"
                />
              </div>

              <!-- Error -->
              <p v-if="error" class="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                {{ error }}
              </p>

              <!-- Actions -->
              <div class="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  class="btn-secondary flex-1"
                  @click="$emit('close')"
                  :disabled="submitting"
                >
                  Cancel
                </button>
                <button type="submit" class="btn-primary flex-1" :disabled="submitting">
                  <svg v-if="submitting" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {{ submitting ? 'Submitting…' : 'Submit Song' }}
                </button>
              </div>
            </form>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useSongsStore } from '../stores/songs'

const props = defineProps({
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submitted'])

const songs = useSongsStore()

const form = ref({ name: '', bpm: '', lag: '', youtube_url: '' })
const submitting = ref(false)
const error = ref('')

watch(() => props.show, (val) => {
  if (val) {
    form.value = { name: '', bpm: '', lag: '', youtube_url: '' }
    error.value = ''
  }
})

async function handleSubmit() {
  error.value = ''
  submitting.value = true
  try {
    await songs.submitSong(form.value)
    emit('submitted')
    emit('close')
  } catch (e) {
    error.value = e?.data?.message || e.message || 'Submission failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>
