import { NextResponse } from 'next/server'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { randomUUID } from 'crypto'

const DATA_DIR = join(process.cwd(), '.data')

function getFile(resource) {
  return join(DATA_DIR, `${resource}.json`)
}

function readCollection(resource) {
  try {
    if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
    const f = getFile(resource)
    if (!existsSync(f)) writeFileSync(f, '[]')
    return JSON.parse(readFileSync(f, 'utf-8'))
  } catch { return [] }
}

function writeCollection(resource, data) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true })
  writeFileSync(getFile(resource), JSON.stringify(data, null, 2))
}

async function handler(req, { params }) {
  // resource = first path segment (e.g. "products", "orders", "inventory")
  const segments = params.path
  const resource = segments[0]
  const id = segments[1] // optional id

  const method = req.method

  try {
    // GET collection or single item
    if (method === 'GET') {
      const data = readCollection(resource)
      if (id) {
        const item = data.find(i => i._id === id || i.id === id)
        if (!item) return NextResponse.json({ message: 'Not found' }, { status: 404 })
        return NextResponse.json(item)
      }
      return NextResponse.json(data)
    }

    // POST — create new item
    if (method === 'POST') {
      const body = await req.json().catch(() => ({}))
      const data = readCollection(resource)
      const newItem = { _id: randomUUID(), ...body, createdAt: new Date().toISOString() }
      data.push(newItem)
      writeCollection(resource, data)
      return NextResponse.json(newItem, { status: 201 })
    }

    // PUT — update item by id
    if (method === 'PUT') {
      if (!id) return NextResponse.json({ message: 'ID required for update' }, { status: 400 })
      const body = await req.json().catch(() => ({}))
      const data = readCollection(resource)
      const idx = data.findIndex(i => i._id === id || i.id === id)
      if (idx === -1) return NextResponse.json({ message: 'Not found' }, { status: 404 })
      data[idx] = { ...data[idx], ...body, updatedAt: new Date().toISOString() }
      writeCollection(resource, data)
      return NextResponse.json(data[idx])
    }

    // DELETE — remove item by id
    if (method === 'DELETE') {
      if (!id) return NextResponse.json({ message: 'ID required for delete' }, { status: 400 })
      const data = readCollection(resource)
      const filtered = data.filter(i => i._id !== id && i.id !== id)
      writeCollection(resource, filtered)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ message: 'Method not allowed' }, { status: 405 })

  } catch (err) {
    console.error('Proxy error:', err)
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
  }
}

export const GET    = handler
export const POST   = handler
export const PUT    = handler
export const DELETE = handler
