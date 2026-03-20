import { NextResponse } from 'next/server'

export async function POST(req) {
  try {
    const body = await req.json()

    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const text = await res.text()

    if (!res.ok) {
      return NextResponse.json({ message: text || 'Login failed' }, { status: res.status })
    }

    let data
    try {
      data = JSON.parse(text)
    } catch {
      return NextResponse.json({ message: 'Invalid response from server' }, { status: 500 })
    }

    if (!data.token) {
      return NextResponse.json({ message: 'No token received' }, { status: 500 })
    }

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', data.token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24,
      path: '/',
    })
    return response

  } catch (err) {
    console.error('Login route error:', err)
    return NextResponse.json({ message: err.message || 'Server error' }, { status: 500 })
  }
}
