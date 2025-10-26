import mongoose, { Document, Schema } from 'mongoose'

interface Provider {
    provider: 'google' | 'github'
    providerId: string
}

export interface IUser extends Document {
    email: string
    name: string
    avatarUrl?: string
    password?: string
    providers?: Provider[]
    roles: string[]
    createdAt: Date
}

const ProviderSchema = new Schema<Provider>({
    provider: { type: String, enum: ['google', 'github'], required: true },
    providerId: { type: String, required: true },
})

const UserSchema = new Schema<IUser>(
    {
        email: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        avatarUrl: String,
        password: String, // hashed if present
        providers: [ProviderSchema],
        roles: { type: [String], default: ['user'] },
        createdAt: { type: Date, default: Date.now },
    },
    { versionKey: false }
)

export const User = mongoose.model<IUser>('User', UserSchema)
