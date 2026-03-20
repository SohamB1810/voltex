import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

async function handler(req, { params }) {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value
  const path = params.path.join('/')
  const { search } = new URL(req.url)
  const backendUrl = `http://localhost:8080/${path}${search}`

  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const fetchOptions = { method: req.method, headers }
  if (!['GET', 'HEAD'].includes(req.method)) {
    fetchOptions.body = await req.text()
  }

  const res = await fetch(backendUrl, fetchOptions)
  const data = await res.text()

  return new NextResponse(data, {
    status: res.status,
    headers: { 'Content-Type': 'application/json' },
  })
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const DELETE = handler
