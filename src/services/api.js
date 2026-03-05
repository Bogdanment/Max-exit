const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem('token')
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'API request failed')
    }

    return response.json()
  },

  // Auth endpoints
  auth: {
    register: (email, password, name) =>
      api.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password, name })
      }),

    login: (email, password) =>
      api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      }),

    getMe: () => api.request('/auth/me')
  },

  // Products endpoints
  products: {
    getAll: () => api.request('/products'),
    getById: (id) => api.request(`/products/${id}`),
    create: (data) =>
      api.request('/products', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    update: (id, data) =>
      api.request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      }),
    delete: (id) =>
      api.request(`/products/${id}`, {
        method: 'DELETE'
      })
  }
}
