// Cliente fetch da API. Base: VITE_API_URL (sem a barra final) ou '' (proxy do Vite em /api, só em dev).
const BASE = (import.meta.env.VITE_API_URL || '').trim().replace(/\/+$/, '')
const TOKEN_KEY = 'cupcake_token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

let onUnauthorized = null
export function setUnauthorizedHandler(fn) {
  onUnauthorized = fn
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  const token = tokenStore.get()
  if (auth && token) headers.Authorization = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ApiError('Não foi possível conectar ao servidor.', 0)
  }

  let data = null
  try {
    data = await res.json()
  } catch {
    /* corpo vazio ou não JSON */
  }

  if (!res.ok) {
    if (res.status === 401 && auth && onUnauthorized) onUnauthorized()
    throw new ApiError(data?.erro || 'Erro inesperado. Tente novamente.', res.status)
  }
  return data
}

export const api = {
  cadastrar: (dados) => request('/api/usuarios', { method: 'POST', body: dados }),
  login: (email, senha) => request('/api/login', { method: 'POST', body: { email, senha } }),
  listarProdutos: (busca = '') =>
    request(`/api/produtos${busca ? `?busca=${encodeURIComponent(busca)}` : ''}`),
  obterProduto: (id) => request(`/api/produtos/${encodeURIComponent(id)}`),
  criarPedido: (itens) =>
    request('/api/pedidos', {
      method: 'POST',
      auth: true,
      body: { itens: itens.map((i) => ({ produto_id: i.id, quantidade: i.quantidade })) },
    }),
  obterPedido: (id) => request(`/api/pedidos/${encodeURIComponent(id)}`, { auth: true }),
}
