'use client'

import { useAuth } from '@/hooks/useAuth'
import Link from 'next/link'
import { Button } from './ui/button'

export function Navbar() {
    const { user, logout, loading } = useAuth()

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto max-w-7xl px-4">
                <div className="flex justify-between items-center h-16">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-blue-600 dark:text-blue-500"
                    >
                        AuthApp
                    </Link>

                    <div className="flex items-center space-x-4">
                        {loading ? (
                            <div className="text-sm">Loading...</div>
                        ) : user ? (
                            <>
                                <span className="hidden sm:inline text-gray-700 dark:text-gray-300">
                                    Hi, {user.name}
                                </span>
                                <Link href="/dashboard" passHref>
                                    <Button variant="ghost">Dashboard</Button>
                                </Link>
                                <Button onClick={logout} variant="outline">
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" passHref>
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/register" passHref>
                                    <Button>Register</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    )
}
