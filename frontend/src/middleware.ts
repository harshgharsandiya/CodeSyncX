import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const AUTH_TOKEN_COOKIE = 'auth_token'

// Define which routes are protected
const protectedRoutes = ['/dashboard']
// Define routes that are only for unauthenticated users
const authRoutes = ['/login', '/register']

export function middleware(request: NextRequest) {
    const token = request.cookies.get(AUTH_TOKEN_COOKIE)?.value
    const { pathname } = request.nextUrl

    const isProtectedRoute = protectedRoutes.some((route) =>
        pathname.startsWith(route)
    )
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

    if (isProtectedRoute && !token) {
        // User is not authenticated and trying to access a protected route
        // Redirect them to the login page
        const loginUrl = new URL('/login', request.url)
        loginUrl.searchParams.set('redirect', pathname) // Optional: add redirect param
        return NextResponse.redirect(loginUrl)
    }

    if (isAuthRoute && token) {
        // User is authenticated but trying to access login/register
        // Redirect them to the dashboard
        return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // Continue with the request
    return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
