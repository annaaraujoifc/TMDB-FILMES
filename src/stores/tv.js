import { defineStore } from 'pinia'
import api from '@/plugins/axios'

export const useTvStore = defineStore('tv', {
  state: () => ({
    currentTv: {}, // aqui vai guardar os detalhes da série
  }),
  actions: {
    async getTvDetail(tvId) {
      try {
        const response = await api.get(`tv/${tvId}`, {
          params: { language: 'pt-BR' }
        })
        this.currentTv = response.data
      } catch (error) {
        console.error('Erro ao buscar detalhes da série:', error)
        this.currentTv = {}
      }
    },
  },
})
