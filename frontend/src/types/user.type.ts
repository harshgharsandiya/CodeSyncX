export interface User {
    _id: string
    email: string
    name: string
    avatarUrl?: string
    password?: string
    providers: {
        provider: 'google' | 'github'
        providerId: string
    }[]
    roles: ('user' | 'admin')[]
    createdAt: string // ISO date string
}
