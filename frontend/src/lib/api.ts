import axios from 'axios';

// Use specific backend URL or fallback to localhost for development
let API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

// Remove trailing slash to prevent double slashes in requests
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

if (typeof window !== 'undefined') {
  console.log('--- [LUMINA DEBUG] API_BASE_URL:', API_BASE_URL);
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export default api;
export { API_BASE_URL };

