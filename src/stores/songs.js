import { defineStore } from 'pinia'
import { ref } from 'vue'
import pb from '../lib/pocketbase'

export const useSongsStore = defineStore('songs', () => {
  const songs = ref([])
  const loading = ref(false)
  const error = ref(null)
  const totalItems = ref(0)
  const currentPage = ref(1)
  const perPage = 50

  async function fetchSongs(query = '', page = 1) {
    loading.value = true
    error.value = null
    try {
      const filter = query ? `name ~ "${query}" || bpm ~ "${query}"` : ''
      const result = await pb.collection('songs').getList(page, perPage, {
        sort: '-created',
        filter,
        expand: 'user',
      })
      songs.value = result.items
      totalItems.value = result.totalItems
      currentPage.value = page
    } catch (e) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function submitSong(data) {
    const record = await pb.collection('songs').create({
      name: data.name,
      bpm: Number(data.bpm),
      lag: data.lag !== '' ? Number(data.lag) : null,
      youtube_url: data.youtube_url,
      user: pb.authStore.model?.id,
    })
    songs.value.unshift(record)
    totalItems.value++
    return record
  }

  return { songs, loading, error, totalItems, currentPage, perPage, fetchSongs, submitSong }
})
