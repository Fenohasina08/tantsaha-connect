import axios from 'axios';

// On crée une instance personnalisée d'Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // L'adresse de votre serveur Express
  headers: {
    'Content-Type': 'application/json',
  },
});

// C'est ici que la magie du JWT opère !
// Cet interceptor ajoute le token à chaque requête si l'utilisateur est connecté
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;