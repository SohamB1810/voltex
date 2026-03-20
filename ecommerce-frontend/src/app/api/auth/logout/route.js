import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set('token', '', { maxAge: 0, path: '/' })
  response.cookies.set('userRole', '', { maxAge: 0, path: '/' })
  response.cookies.set('userId', '', { maxAge: 0, path: '/' })
  response.cookies.set('userName', '', { maxAge: 0, path: '/' })
  return response
}
