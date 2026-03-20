import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const text = await res.text()
    if (!res.ok) return NextResponse.json({ message: text || 'Registration failed' }, { status: res.status })
    return NextResponse.json({ success: true, message: text })
  } catch {
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
