/* ============================================
   CareerPilot AI — API Service Layer
   HTTP client connecting frontend to backend server.
   ============================================ */

const API_BASE_URL = (import.meta.env.VITE_API_URL || '/api').replace(/\/+$/, '');

/**
 * Standard fetch helper with timeout and JSON parsing.
 */
async function request(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;
  const timeoutMs = options.timeoutMs || 45000;

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config = {
    method: options.method || 'GET',
    headers,
    signal: AbortSignal.timeout(timeoutMs),
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.error || data?.message || `HTTP ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return { data, status: response.status, ok: true };
  } catch (err) {
    if (err.name === 'TimeoutError') {
      throw new Error(`Request timed out after ${timeoutMs / 1000}s`);
    }
    throw err;
  }
}

export const api = {
  baseURL: API_BASE_URL,

  async get(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'GET' });
  },

  async post(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'POST', body });
  },

  async put(endpoint, body, options = {}) {
    return request(endpoint, { ...options, method: 'PUT', body });
  },

  async delete(endpoint, options = {}) {
    return request(endpoint, { ...options, method: 'DELETE' });
  },
};

export default api;
