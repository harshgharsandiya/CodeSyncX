'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function RegisterPage() {
    const { register } = useAuth()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            setLoading(true)
            await register(email, name, password)
            router.push('/dashboard')
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-2xl font-semibold mb-6">Register</h1>
            <form onSubmit={handleRegister} className="space-y-4 w-80">
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border rounded p-2 w-full"
                    required
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white rounded p-2 w-full"
                >
                    {loading ? 'Creating account...' : 'Register'}
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
