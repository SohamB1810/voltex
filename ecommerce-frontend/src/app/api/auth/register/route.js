import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const DATA_DIR = join(process.cwd(), '.data')
const USERS_FILE = join(DATA_DIR, 'users.json')

function readUsers() {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    if (!existsSync(USERS_FILE)) writeFileSync(USERS_FILE, '[]')
    return JSON.parse(readFileSync(USERS_FILE, 'utf-8'))
  } catch { return [] }
}

function writeUsers(users) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(USERS_FILE, JSON.stringify(users, null, 2))
}

export async function POST(req) {
  try {
    const { name, email, password, role } = await req.json()

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'All fields required' }, { status: 400 })
    }

    const users = readUsers()

    if (users.find(u => u.email === email)) {
      return NextResponse.json({ message: 'Email already registered' }, { status: 409 })
    }

    const validRoles = ['ADMIN', 'WORKER', 'CUSTOMER']
    const assignedRole = validRoles.includes(role) ? role : 'CUSTOMER'

    const newUser = { id: randomUUID(), name, email, password, role: assignedRole, createdAt: new Date().toISOString() }
    users.push(newUser)
    writeUsers(users)

    return NextResponse.json({ success: true, message: 'Account created successfully' })

  } catch (err) {
    console.error('Register error:', err)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}
