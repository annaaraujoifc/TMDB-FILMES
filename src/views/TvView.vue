<script setup>
import { ref, onMounted } from 'vue';
import api from '@/plugins/axios';

const genres = ref([]);
const tvShows = ref([]);
const selectedGenre = ref(null);
const loading = ref(true);
const error = ref(null);


const fetchGenres = async () => {
  try {
    const response = await api.get('genre/tv/list?language=pt-BR');
    genres.value = response.data.genres;
  } catch (err) {
    console.error(err);
    error.value = 'Erro ao carregar os gêneros de TV 😕';
  } finally {
    loading.value = false;
  }
};

// Buscar séries de um gênero específico
const fetchTvShowsByGenre = async (genreId) => {
  selectedGenre.value = genreId;
  tvShows.value = [];
  loading.value = true;
  try {
    const response = await api.get('discover/tv', {
      params: {
        with_genres: genreId,
        language: 'pt-BR',
      },
    });
    tvShows.value = response.data.results;
  } catch (err) {
    console.error(err);
    error.value = 'Erro ao carregar os programas de TV 😕';
  } finally {
    loading.value = false;
  }
};

onMounted(fetchGenres);
</script>

<template>
  <div class="tv-view">
    <h1>📺 Programas de TV</h1>

    <div v-if="loading && !genres.length" class="status">Carregando gêneros...</div>
    <div v-else-if="error" class="status error">{{ error }}</div>

    <!-- Lista de gêneros -->
    <ul v-else class="genre-list">
      <li
        v-for="genre in genres"
        :key="genre.id"
        class="genre-item"
        :class="{ active: selectedGenre === genre.id }"
        @click="fetchTvShowsByGenre(genre.id)"
      >
        {{ genre.name }}
      </li>
    </ul>

    <!-- Lista de séries -->
    <div v-if="loading && selectedGenre" class="status">Carregando séries...</div>
    <div v-else-if="tvShows.length" class="tv-list">
      <div v-for="show in tvShows" :key="show.id" class="tv-card">
        <img
          :src="show.poster_path ? 'https://image.tmdb.org/t/p/w300' + show.poster_path : 'https://via.placeholder.com/300x450?text=Sem+Imagem'"
          :alt="show.name"
        />
        <h3>{{ show.name }}</h3>
      </div>
    </div>

    <div v-else-if="selectedGenre && !tvShows.length && !loading" class="status">
      Nenhum programa encontrado para este gênero 😔
    </div>
  </div>
</template>

<style scoped>
.tv-view {
  padding: 2rem;
  text-align: center;
  color: #222;
}

.status {
  font-size: 1.2rem;
  margin-top: 2rem;
}

.error {
  color: red;
}

.genre-list {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  list-style: none;
  padding: 0;
  margin-top: 2rem;
}

.genre-item {
  background-color: #5d6424;
  border-radius: 1rem;
  padding: 0.5rem 1.5rem;
  color: #fff;
  transition: all 0.2s;
}

.genre-item:hover {
  cursor: pointer;
  background-color: #7d8a2e;
  box-shadow: 0 0 0.5rem #5d6424;
}

.genre-item.active {
  background-color: #a0b03d;
}

.tv-list {
  margin-top: 3rem;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.tv-card {
  width: 180px;
  text-align: center;
}

.tv-card img {
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.tv-card h3 {
  font-size: 1rem;
  margin-top: 0.5rem;
  color: #333;
}
</style>
