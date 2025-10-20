<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/plugins/axios'
import { useGenreStore } from '@/stores/genre'

const genreStore = useGenreStore()
const tvShows = ref([])
const selectedGenre = ref(null)
const loading = ref(true)
const error = ref(null)
const router = useRouter()

// Buscar programas de TV por gênero
const fetchTvShows = async (genreId = null) => {
  try {
    loading.value = true
    const response = await api.get('discover/tv', {
      params: {
        with_genres: genreId,
        language: 'pt-BR',
      },
    })
    tvShows.value = response.data.results
  } catch (err) {
    error.value = 'Erro ao carregar programas de TV.'
  } finally {
    loading.value = false
  }
}

// Selecionar gênero
const selectGenre = (genreId) => {
  selectedGenre.value = genreId
  genreStore.setCurrentGenreId(genreId)
  fetchTvShows(genreId)
}

// Ir para detalhes do programa
const goToDetails = (id) => {
  router.push(`/tv/${id}`)
}

// Ao montar o componente
onMounted(async () => {
  await genreStore.getAllGenres('tv') // ✅ lista os gêneros de TV usando a store
  await fetchTvShows()
})
</script>

<template>
  <div class="container">
    <h2>Programas de TV</h2>

    <div class="genres">
      <button
        v-for="genre in genreStore.genres"
        :key="genre.id"
        :class="{ active: selectedGenre === genre.id }"
        @click="selectGenre(genre.id)"
      >
        {{ genre.name }}
      </button>
    </div>

    <div v-if="loading" class="loading">Carregando...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="!loading && !error" class="tv-grid">
      <div
        v-for="show in tvShows"
        :key="show.id"
        class="tv-card"
        @click="goToDetails(show.id)"
      >
        <img
          :src="show.poster_path
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}`
            : '/src/assets/no-image.jpg'"
          :alt="show.name"
        />
        <div class="info">
          <h3>{{ show.name }}</h3>
          <p><strong>Nome original:</strong> {{ show.original_name }}</p>
          <p><strong>Data de estreia:</strong> {{ new Date(show.first_air_date).toLocaleDateString('pt-BR') }}</p>

          <div class="tags">
            <span
              v-for="genreId in show.genre_ids"
              :key="genreId"
              class="tag"
            >
              {{ genreStore.getGenreName(genreId) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.container { padding: 20px; }
h2 { font-size: 1.8rem; margin-bottom: 20px; }
.genres { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 25px; }
.genres button { background: #e6e6e6; border: none; border-radius: 15px; padding: 8px 14px; cursor: pointer; transition: all 0.2s; }
.genres button.active { background-color: #4d692c; color: white; }
.loading { font-weight: bold; margin-top: 20px; }
.error { color: red; margin-top: 20px; }
.tv-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(230px, 1fr)); gap: 25px; }
.tv-card { background: #fff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); overflow: hidden; transition: transform 0.2s ease; cursor: pointer; }
.tv-card:hover { transform: scale(1.05); }
.tv-card img { width: 100%; height: 340px; object-fit: cover; border-bottom: 1px solid #ddd; }
.info { padding: 10px; }
.info h3 { font-size: 1.1rem; margin-bottom: 5px; }
.info p { font-size: 0.9rem; color: #333; margin-bottom: 4px; }
.tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.tag { background: #6d7b43; color: #fff; border-radius: 8px; padding: 2px 8px; font-size: 0.75rem; }
</style>
