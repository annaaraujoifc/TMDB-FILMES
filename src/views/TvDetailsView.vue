<script setup>
import { defineProps, onMounted } from 'vue';
import { useTvStore } from '@/stores/tv'; // crie um store similar ao movieStore, mas para TV
const tvStore = useTvStore();

const props = defineProps({
  tvId: {
    type: Number,
    required: true,
  },
});

onMounted(async () => {
  await tvStore.getTvDetail(props.tvId);
});
</script>

<template>
  <div class="main">
    <div class="content">
      <img
        :src="tvStore.currentTv.poster_path ? `https://image.tmdb.org/t/p/w500${tvStore.currentTv.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'"
        :alt="tvStore.currentTv.name"
      />

      <div class="details">
        <h1>{{ tvStore.currentTv.name }}</h1>
        <p><strong>⭐ Nota:</strong> {{ tvStore.currentTv.vote_average.toFixed(1) }}</p>
        <p><strong>🗓️ Estreia:</strong> {{ tvStore.currentTv.first_air_date }}</p>
        <p><strong>🎭 Gêneros:</strong> {{ tvStore.currentTv.genres.map(g => g.name).join(', ') }}</p>
        <p><strong>📖 Sinopse:</strong> {{ tvStore.currentTv.overview || 'Sem descrição disponível.' }}</p>
      </div>
    </div>

    <p>Produtoras</p>
    <div class="companies">
      <template v-for="company in tvStore.currentTv.production_companies" :key="company.id">
        <img
          v-if="company.logo_path"
          :src="`https://image.tmdb.org/t/p/w92${company.logo_path}`"
          :alt="company.name"
        />
        <p v-else>{{ company.name }}</p>
      </template>
    </div>
  </div>
</template>

<style scoped>
.content {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
}

.details {
  max-width: 600px;
  line-height: 1.6;
}

.details h1 {
  margin-bottom: 1rem;
}

.details p {
  margin-bottom: 0.5rem;
}

.companies {
  display: flex;
  flex-direction: row;
  column-gap: 3rem;
  align-items: center;
  margin-top: 2rem;
  margin-bottom: 2rem;
}
</style>
