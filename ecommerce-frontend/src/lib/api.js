const CRUD_BASE = 'https://crudcrud.com/api/ca4b62a34e1015aab88fa718f2095d206ef636b6c01dc23fe1e949f7f39d4ec7'

export async function request(path, options = {}) {
  // Strip leading slash and 'api/' prefix since crudcrud paths are flat
  let resource = path.startsWith('/') ? path.slice(1) : path
  // Remove 'api/' prefix if present
  if (resource.startsWith('api/')) resource = resource.slice(4)

  const res = await fetch('/api/proxy/' + resource, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...options.headers },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Request failed')
  return data
}

export async function login(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Login failed')
  await new Promise(r => setTimeout(r, 200))
  return data
}

export async function register(name, email, password, role) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Registration failed')
  return data
}

export async function logout() {
  await fetch('/api/auth/logout', { method: 'POST' })
}

// Crudcrud-backed helpers
export async function getProducts()   { return request('/products') }
export async function getOrders()     { return request('/orders') }
export async function getUsers()      { return request('/users') }
export async function getPayments()   { return request('/payments') }
export async function getInventory()  { return request('/inventory') }
export async function getShipments()  { return request('/shipments') }
export async function getWarehouses() { return request('/warehouse') }

export async function addToCart(productId, quantity) {
  const getCookie = (name) => {
    if (typeof document === 'undefined') return null
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
    return match ? match[2] : null
  }
  const userId = getCookie('userId') || 'guest'
  return request('/cart', {
    method: 'POST',
    body: JSON.stringify({ userId, productId, quantity }),
  })
}

export async function placeOrder(userId, productId, quantity) {
  return request('/orders', {
    method: 'POST',
    body: JSON.stringify({ userId, productId, quantity, status: 'pending', createdAt: new Date().toISOString() }),
  })
}
