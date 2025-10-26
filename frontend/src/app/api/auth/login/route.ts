import { NextRequest, NextResponse } from 'next/server'

const AUTH_URL = process.env.NEXT_PUBLIC_API_BASE_URL + '/auth/login'

export async function POST(req: NextRequest) {
    const body = await req.json()
    const res = await fetch(AUTH_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
    })

    const data = await res.json()
    // Forward backend cookies (access/refresh)
    const response = NextResponse.json(data, { status: res.status })
    const setCookie = res.headers.get('set-cookie')
    if (setCookie) response.headers.set('set-cookie', setCookie)
    return response
}
