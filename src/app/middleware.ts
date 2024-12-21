import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function to handle CORS headers
export function middleware(req: NextRequest) {
  const response = NextResponse.next()

  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*')  // Allow all origins or replace '*' with specific domains
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')

  return response
}
