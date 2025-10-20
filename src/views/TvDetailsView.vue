<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/plugins/axios'

const route = useRoute()
const router = useRouter()
const tvShow = ref(null)
const loading = ref(true)
const error = ref(null)

const fetchTvDetails = async () => {
  try {
    const response = await api.get(`tv/${route.params.tvId}`, {
      params: { language: 'pt-BR' },
    })
    tvShow.value = response.data
  } catch (err) {
    error.value = 'Erro ao carregar detalhes da série.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchTvDetails)
</script>

<template>
  <div v-if="loading" class="loading">Carregando...</div>
  <div v-if="error" class="error">{{ error }}</div>

  <div v-if="!loading && tvShow" class="details-container">
    <button @click="router.back()" class="back-btn">← Voltar</button>
    <div class="content">
      <img
        :src="`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`"
        :alt="tvShow.name"
        class="poster"
      />
      <div class="info">
        <h2>{{ tvShow.name }}</h2>
        <p><strong>Nome original:</strong> {{ tvShow.original_name }}</p>
        <p><strong>Primeira exibição:</strong> {{ new Date(tvShow.first_air_date).toLocaleDateString('pt-BR') }}</p>
        <p><strong>Nota:</strong> {{ tvShow.vote_average.toFixed(1) }}</p>
        <p><strong>Temporadas:</strong> {{ tvShow.number_of_seasons }}</p>
        <p><strong>Episódios:</strong> {{ tvShow.number_of_episodes }}</p>
        <p><strong>Sinopse:</strong> {{ tvShow.overview || 'Sem descrição disponível.' }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.details-container {
  padding: 20px;
}
.content {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}
.poster {
  width: 300px;
  border-radius: 12px;
}
.info {
  max-width: 600px;
}
.back-btn {
  background: #4d692c;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  margin-bottom: 15px;
}
.loading {
  text-align: center;
  font-weight: bold;
}
.error {
  color: red;
  text-align: center;
}
</style>
