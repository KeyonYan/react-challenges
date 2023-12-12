import { NextRequest, NextResponse } from 'next/server'
import { User } from '@/interfaces/user'

// Fake users data
const users: User[] = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }]

export async function GET(request: NextRequest) {
  return NextResponse.json({ data: users}, {status: 200})
}