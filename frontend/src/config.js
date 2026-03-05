// API Configuration
// Use this to switch between local development and production backends

const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://virtual-art-gallery-backend.onrender.com/api'  // Render backend (production)
  : 'http://localhost:5000/api';  // Local backend (development)

export default API_BASE_URL;
