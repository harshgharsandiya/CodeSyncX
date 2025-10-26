'use client'

import React, {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from 'react'
import { apiFetch } from '@/lib/api'

export type User = {
    _id: string
    email: string
    name: string
    avatarUrl?: string
    roles: string[]
}

interface AuthContextType {
    user: User | null
    loading: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, name: string, password: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchMe = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                setUser(null)
                setLoading(false)
                return
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/me`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            )
            const data = await res.json()
            if (res.ok) setUser(data.user)
            else setUser(null)
        } catch (error) {
            setUser(null)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchMe()
    }, [fetchMe])

    const login = async (email: string, password: string) => {
        const { token, user } = await apiFetch('/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })
        localStorage.setItem('token', token)
        setUser(user)
    }

    const register = async (email: string, name: string, password: string) => {
        const { token, user } = await apiFetch('/register', {
            method: 'POST',
            body: JSON.stringify({ email, name, password }),
        })
        localStorage.setItem('token', token)
        setUser(user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const value: AuthContextType = {
        user,
        loading,
        login,
        register,
        logout,
        refreshUser: fetchMe,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within an AuthProvider')
    return context
}
