'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (loading) return
        if (!user) {
            router.replace('/login')
        }
    }, [loading, user, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p className="text-gray-500 text-sm">
                    Loading your dashboard...
                </p>
            </div>
        )
    }

    return <>{children}</>
}
