# ShopForge — Ecommerce Frontend

A modern Next.js + React + Tailwind CSS frontend for the Spring Boot ecommerce backend.

## Tech Stack
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS 3**
- **Lucide React** (icons)
- **Google Fonts** — Syne (display) + DM Sans (body)

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Hero landing page with Login / Sign Up |
| `/dashboard` | Overview — stats, recent orders, API service status |
| `/dashboard/products` | Product catalogue management |
| `/dashboard/orders` | Order tracking and management |
| `/dashboard/cart` | Active & abandoned carts |
| `/dashboard/users` | User management (ADMIN / CUSTOMER roles) |
| `/dashboard/payments` | Payment transactions |
| `/dashboard/shipments` | Shipment tracking |
| `/dashboard/inventory` | Stock levels across warehouses |
| `/dashboard/warehouse` | Warehouse locations and capacity |

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Connecting to the Spring Boot Backend

All API calls are stubbed with mock data. To connect to your backend (running on `http://localhost:8080`):

1. Create a `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

2. Replace mock data in each page with `fetch` calls. Example for products:
```js
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`)
const data = await res.json()
```

3. Auth: On login, store the JWT token from `POST /api/auth/login` in `localStorage` or a cookie, then pass it as `Authorization: Bearer <token>` header on all subsequent requests.

## Backend API Endpoints (Spring Boot)

```
POST /api/auth/login
POST /api/auth/register
GET  /api/products
GET  /api/orders
GET  /api/cart/{userId}
GET  /api/users
GET  /api/payments
GET  /api/shipments
GET  /api/inventory
GET  /api/warehouse
```

Swagger UI available at: `http://localhost:8080/swagger-ui.html`

## Project Structure

```
src/
├── app/
│   ├── globals.css          # Global styles, design tokens
│   ├── layout.js            # Root layout
│   ├── page.js              # Landing / auth page
│   └── dashboard/
│       ├── layout.js        # Dashboard layout (Navbar)
│       ├── page.js          # Overview page
│       ├── products/page.js
│       ├── orders/page.js
│       ├── cart/page.js
│       ├── users/page.js
│       ├── payments/page.js
│       ├── shipments/page.js
│       ├── inventory/page.js
│       └── warehouse/page.js
└── components/
    └── Navbar.js            # Top navigation bar
```
