import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
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

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const users = readUsers()
        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        )
        if (!user) return null
        return { id: user.id, name: user.name, email: user.email, role: user.role }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === 'google') {
        const users = readUsers()
        const existing = users.find(u => u.email === user.email)
        if (!existing) {
          const newUser = {
            id: randomUUID(),
            name: user.name,
            email: user.email,
            password: null,
            role: 'CUSTOMER',
            provider: 'google',
            createdAt: new Date().toISOString(),
          }
          users.push(newUser)
          writeUsers(users)
          user.role = 'CUSTOMER'
        } else {
          user.role = existing.role
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.id = user.id
      }
      if (account?.provider === 'google' && !token.role) {
        const users = readUsers()
        const dbUser = users.find(u => u.email === token.email)
        token.role = dbUser?.role || 'CUSTOMER'
        token.id = dbUser?.id
      }
      return token
    },
    async session({ session, token }) {
      session.user.role = token.role
      session.user.id = token.id
      return session
    },
  },
  pages: {
    signIn: '/',
  },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
