export const API_BASE = process.env.NEXT_PUBLIC_AUTH_SERVICE_URL as string

export async function apiFetch(
    path: string,
    options: RequestInit = {}
): Promise<any> {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {}),
        },
        credentials: 'include', // in case you later use cookies
        ...options,
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(data.message || 'Request failed')
    return data
}
