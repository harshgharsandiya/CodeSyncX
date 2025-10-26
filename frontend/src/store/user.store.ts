import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { IUser } from '@/types'

// Define the state shape
export interface UserState {
    user: IUser | null
    token: string | null
    setUser: (user: IUser, token: string) => void
    clearUser: () => void
}

// Create the store
export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            setUser: (user, token) => set({ user, token }),
            clearUser: () => set({ user: null, token: null }),
        }),
        {
            name: 'user-auth-storage', // name of the item in localStorage
            storage: createJSONStorage(() => localStorage), // use localStorage
            // Only persist the token. The user object will be refetched via /me
            partialize: (state) => ({ token: state.token }),
        }
    )
)

/*
Note: We only persist the token to localStorage.
When the app loads, the AuthProvider (src/context/AuthContext.tsx)
will check for this token. If it exists, it will make a request
to your backend's /me endpoint to get the fresh user data.
This ensures the user data is always up-to-date.
*/
