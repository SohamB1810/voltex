export async function request(path, options = {}) {
    const proxyPath = path.startsWith('/') ? path.slice(1) : path
    const res = await fetch('/api/proxy/' + proxyPath, {
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
    await new Promise(resolve => setTimeout(resolve, 200))
    return data
}

export async function register(name, email, password) {
    const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Registration failed')
    return data
}

export async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' })
}

export async function getProducts() { return request('/products') }
export async function getOrders() { return request('/orders') }
export async function getCart() { return request('/api/cart') }
export async function getUsers() { return request('/api/users') }
export async function getPayments() { return request('/api/payments') }
export async function getInventory() { return request('/api/inventory') }
export async function getShipments() { return request('/api/shipments') }
export async function getWarehouses() { return request('/api/warehouse') }

export async function addToCart(productId, quantity) {
    return request('/api/cart/add?productId=' + productId + '&quantity=' + quantity, { method: 'POST' })
}
export async function removeFromCart(cartItemId) {
    return request('/api/cart/remove/' + cartItemId, { method: 'DELETE' })
}
export async function placeOrder(userId, productId, quantity) {
    return request('/orders/place?userId=' + userId + '&productId=' + productId + '&quantity=' + quantity, { method: 'POST' })
}