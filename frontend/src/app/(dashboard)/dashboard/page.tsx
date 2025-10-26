'use client'

import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
    const { user, loading, logout } = useAuth() // Get the logout function

    if (loading) {
        return (
            <div className="text-center">
                <p>Loading user data...</p>
            </div>
        )
    }

    if (!user) {
        // This should ideally be handled by middleware, but good to have a fallback
        return (
            <div className="text-center">
                <p>Redirecting to login...</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button onClick={logout} variant="outline">
                    Logout
                </Button>
            </div>
            <p className="text-xl">
                <span className="font-semibold">{user.name}</span>!
            </p>
            <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold">Your Details</h3>
                <p>
                    <strong>Email:</strong> {user.email}
                </p>
                <p>
                    <strong>ID:</strong> {user._id}
                </p>
                <p>
                    <strong>Roles:</strong> {user.roles.join(', ')}
                </p>
                {user.avatarUrl && (
                    <img
                        src={user.avatarUrl}
                        alt={user.name}
                        className="w-20 h-20 rounded-full mt-4"
                    />
                )}
            </div>
        </div>
    )
}
