import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.themoviedb.org/3/',
  headers: {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NTUwZTM2Nzg3ZjM5MWU0ZmZkNTE2YTIzYjFiYWE1OCIsIm5iZiI6MTc1OTIzMzc1NC4yMjIwMDAxLCJzdWIiOiI2OGRiYzZkYTkzNjEyODM2ZjZlMWQxMGEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.KE6aGePxjDFCi4LBESLgx_wxEeQ_k5v3-nAwT1_ebbA`,
  },
});

export default api;
