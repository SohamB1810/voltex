import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const token = cookieStore.get('token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 })
  }

  try {
    const payload = JSON.parse(Buffer.from(token, 'base64').toString('utf-8'))
    return NextResponse.json({ user: payload, role: payload.role })
  } catch {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }
}
