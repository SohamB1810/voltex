import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), '.data')
const USERS_FILE = join(DATA_DIR, 'users.json')

function readUsers() {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    if (!existsSync(USERS_FILE)) writeFileSync(USERS_FILE, '[]')
    return JSON.parse(readFileSync(USERS_FILE, 'utf-8'))
  } catch { return [] }
}

export async function POST(req) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password required' }, { status: 400 })
    }

    const users = readUsers()
    const user = users.find(u => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: 'Invalid email or password' }, { status: 401 })
    }

    const token = Buffer.from(JSON.stringify({ id: user.id, name: user.name, email: user.email, role: user.role })).toString('base64')

    const response = NextResponse.json({ success: true, role: user.role, name: user.name })
    response.cookies.set('token', token, { httpOnly: true, secure: false, sameSite: 'lax', maxAge: 86400, path: '/' })
    response.cookies.set('userRole', user.role, { httpOnly: false, secure: false, sameSite: 'lax', maxAge: 86400, path: '/' })
    response.cookies.set('userId', user.id, { httpOnly: false, secure: false, sameSite: 'lax', maxAge: 86400, path: '/' })
    response.cookies.set('userName', user.name, { httpOnly: false, secure: false, sameSite: 'lax', maxAge: 86400, path: '/' })
    return response

  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
