import axios from 'axios';

// Use relative URL — Next.js proxy (next.config.ts rewrites) forwards to FastAPI on port 8000
const API_BASE_URL = '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export default api;
export { API_BASE_URL };

