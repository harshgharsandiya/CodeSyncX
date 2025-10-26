'use client'

import {
    createContext,
    ReactNode,
    useCallback,
    useEffect,
    useState,
} from 'react'
import { useUserStore, UserState } from '@/store/user.store'
import { IUser } from '@/types'
import api from '@/lib/api'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

// Define the shape of the context
interface AuthContextType extends Omit<UserState, 'setUser' | 'clearUser'> {
    login: (email: string, password: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
    loading: boolean
}

// Create the context
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Define the AuthProvider props
interface AuthProviderProps {
    children: ReactNode
}

const AUTH_TOKEN_COOKIE = 'auth_token'

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const { user, token, setUser, clearUser } = useUserStore()
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    // Function to fetch 'me' endpoint
    const fetchUser = useCallback(
        async (authToken: string) => {
            try {
                api.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${authToken}`
                const res = await api.get('/auth/me')
                setUser(res.data.user, authToken)
            } catch (error) {
                // If token is invalid, clear everything
                clearUser()
                Cookies.remove(AUTH_TOKEN_COOKIE)
                api.defaults.headers.common['Authorization'] = undefined
            } finally {
                setLoading(false)
            }
        },
        [setUser, clearUser]
    )

    // Effect to load user on initial mount
    useEffect(() => {
        const storedToken = Cookies.get(AUTH_TOKEN_COOKIE)
        if (storedToken) {
            fetchUser(storedToken)
        } else {
            setLoading(false)
        }
    }, [fetchUser])

    // Login function
    const login = async (email: string, password: string) => {
        try {
            const res = await api.post('/auth/login', { email, password })
            const {
                token: authToken,
                user: loggedInUser,
            }: { token: string; user: IUser } = res.data

            Cookies.set(AUTH_TOKEN_COOKIE, authToken, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
            })
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            setUser(loggedInUser, authToken)
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Login failed'
            throw new Error(errorMsg)
        }
    }

    // Register function
    const register = async (name: string, email: string, password: string) => {
        try {
            const res = await api.post('/auth/register', {
                name,
                email,
                password,
            })
            const {
                token: authToken,
                user: registeredUser,
            }: { token: string; user: IUser } = res.data

            Cookies.set(AUTH_TOKEN_COOKIE, authToken, {
                expires: 7,
                secure: process.env.NODE_ENV === 'production',
            })
            api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
            setUser(registeredUser, authToken)
        } catch (err: any) {
            const errorMsg =
                err.response?.data?.message || 'Registration failed'
            throw new Error(errorMsg)
        }
    }

    // Logout function
    const logout = () => {
        clearUser()
        Cookies.remove(AUTH_TOKEN_COOKIE)
        delete api.defaults.headers.common['Authorization']
        // Redirect to home and refresh to ensure middleware catches up
        router.push('/')
    }

    return (
        <AuthContext.Provider
            value={{ user, token, login, register, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    )
}
