// src/controllers/oauth.controller.ts
import { Request, Response } from 'express'
import { signToken } from '../utils/jwt'
import { config } from '../config/env'
import { IUser } from '../models/user.model'

// This will be used as the final callback route handler after passport authenticates.
// passport attaches the `user` object to req.user.
export const oauthSuccess = (req: Request, res: Response) => {
    const user = (req as any).user as IUser | null
    if (!user) return res.status(400).json({ message: 'OAuth failed: no user' })

    // create JWT
    const token = signToken({ id: user._id, roles: user.roles })

    // Decide how to return token:
    // 1) If FRONTEND_URL is configured, redirect with token as query (frontend should handle storing it securely)

    res.cookie('token', token, {
        httpOnly: true,
        secure: config.nodeEnv === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })

    if (config.frontendUrl) {
        // NOTE: In production, consider using a one-time code stored server-side rather than token in URL.
        res.redirect(config.frontendUrl + '/dashboard')
    } else {
        res.json({ token, user })
    }
}

export const oauthFailure = (req: Request, res: Response) => {
    res.status(401).json({ message: 'OAuth authentication failed' })
}
