// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/editor']

export function middleware(req: NextRequest) {
    const token = req.cookies.get('access_token')?.value
    const path = req.nextUrl.pathname

    if (PROTECTED_PATHS.some((p) => path.startsWith(p))) {
        if (!token) {
            const loginUrl = new URL('/login', req.url)
            loginUrl.searchParams.set('from', path)
            return NextResponse.redirect(loginUrl)
        }
    }
    return NextResponse.next()
}
