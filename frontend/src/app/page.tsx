'use client' // <-- Must be a client component to use hooks

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

export default function Home() {
    // Use the same hydration-safe pattern as the Navbar
    const { user: authUser, loading: authLoading } = useAuth()
    const [isClient, setIsClient] = useState(false)
    // We only need to know *if* a user exists, so a simple check is fine.
    const [user, setUser] = useState<object | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (isClient) {
            setUser(authUser)
            setLoading(authLoading)
        }
    }, [isClient, authUser, authLoading])

    // Helper function to render buttons
    const renderAuthButtons = () => {
        if (!isClient || loading) {
            // Show a placeholder or nothing while loading/hydrating
            return (
                <div className="h-10 mt-6">
                    <p className="text-sm text-gray-500">Loading...</p>
                </div>
            )
        }

        if (user) {
            // User is logged in
            return (
                <div className="flex gap-4 mt-6">
                    <Link href="/dashboard" passHref>
                        <Button size="lg">Go to Dashboard</Button>
                    </Link>
                </div>
            )
        }

        // User is not logged in
        return (
            <div className="flex gap-4 mt-6">
                <Link href="/login" passHref>
                    <Button variant="outline" size="lg">
                        Login
                    </Button>
                </Link>
                <Link href="/register" passHref>
                    <Button size="lg">Register</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center justify-center text-center">
            <h1 className="text-4xl font-bold tracking-tight mb-4">
                Welcome to the Auth Frontend
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                This is a Next.js application designed to work with your custom
                auth backend.
            </p>
            <p className="mt-4">
                {!isClient || loading
                    ? '...'
                    : user
                    ? 'Welcome back! You can head to your dashboard.'
                    : 'Try logging in or registering to access the protected dashboard.'}
            </p>

            {/* Render the auth buttons here */}
            {renderAuthButtons()}
        </div>
    )
}
