'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function OAuthSuccessPage() {
    const router = useRouter()
    const params = useSearchParams()

    useEffect(() => {
        const token = params.get('token')
        if (token) {
            localStorage.setItem('token', token)
            router.replace('/dashboard')
        } else {
            router.replace('/login')
        }
    }, [params, router])

    return <p>Completing sign-in...</p>
}
