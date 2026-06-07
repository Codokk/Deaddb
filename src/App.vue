<template>
  <div class="min-h-screen flex flex-col">
    <NavBar @open-submit="submitModalOpen = true" />
    <main class="flex-1">
      <RouterView :submit-modal-open="submitModalOpen" @update:submit-modal-open="submitModalOpen = $event" />
    </main>
    <footer class="border-t border-surface-border py-6 mt-12">
      <div class="max-w-6xl mx-auto px-4 text-center text-gray-500 text-sm">
        DeadDB — Community database for Dead by Disco songs
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import NavBar from './components/NavBar.vue'

const submitModalOpen = ref(false)
</script>
