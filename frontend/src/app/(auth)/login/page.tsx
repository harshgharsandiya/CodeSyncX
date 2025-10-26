'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function LoginPage() {
    const { login, user, refreshUser } = useAuth()
    const router = useRouter()
    const searchParams = useSearchParams()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const [checkingSession, setCheckingSession] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await refreshUser()
            } catch (err) {
                console.log('No active session found.')
            } finally {
                setCheckingSession(false)
            }
        }

        if (!user) {
            checkAuth()
        } else {
            setCheckingSession(false)
        }
    }, [refreshUser, user])

    useEffect(() => {
        if (user) {
            const from = searchParams.get('from')
            console.log(from)
            // router.push(from || '/dashboard')
            router.push('/dashboard')
        }
    }, [user, router, searchParams])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        try {
            setLoading(true)
            await login(email, password)
            // router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    if (loading || checkingSession) {
        return <div>Loading...</div> // Or a spinner
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Login</h1>
            <form onSubmit={handleLogin} className="space-y-4 w-80">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white rounded p-2 w-full"
                >
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <div className="flex flex-col items-center space-y-2 mt-4">
                    <a
                        href={`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/oauth/google`}
                        className="bg-red-500 text-white p-2 rounded w-full text-center"
                    >
                        Continue with Google
                    </a>
                    <a
                        href={`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/oauth/github`}
                        className="bg-gray-800 text-white p-2 rounded w-full text-center"
                    >
                        Continue with GitHub
                    </a>
                </div>
            </form>
        </div>
    )
}
