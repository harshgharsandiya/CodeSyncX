// Based on your data model
export interface IUser {
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
    createdAt: string
}
