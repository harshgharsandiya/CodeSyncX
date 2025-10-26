// src/controllers/oauth.controller.ts
import { Request, Response } from 'express'
import { signToken } from '../utils/jwt'
import { config } from '../config/env'
import { IUser } from '../models/user.model'

export const oauthSuccess = (req: Request, res: Response) => {
    const user = (req as any).user as IUser | null
    if (!user) return res.status(400).json({ message: 'OAuth failed: no user' })

    // 1. Create the token (same as before)
    const token = signToken({ id: user._id, roles: user.roles })

    // 2. Set the token as an httpOnly cookie
    //    'jwt' is the cookie name, you can change it.
    //    Your AuthContext's 'refreshUser' will need to use this cookie.
    res.cookie('token', token, {
        httpOnly: true, // IMPORTANT: Prevents XSS attacks
        secure: config.nodeEnv === 'production', // Use secure in production
        sameSite: 'strict', // Or 'lax'. 'strict' is more secure.
        // path: '/', // Make it available on all paths
        // maxAge: 1000 * 60 * 60 * 24 * 7 // e.g., 7 days
    })

    // 3. Redirect to your frontend.
    //    You can redirect to /dashboard, or /login.
    //    Let's redirect to /login to be safe. Your LoginPage logic
    //    will then handle the redirect to /dashboard.

    // Remove the /$/, '' replacement, it's safer this way
    const loginUrl = `${config.frontendUrl || 'http://localhost:3000'}/login`

    res.redirect(loginUrl)

    // --- We no longer use this logic ---
    /*
    const redirectTo = config.frontendUrl
        ? `${config.frontendUrl.replace(
              /\/$/,
              ''
          )}/oauth/success?token=${token}`
        : null

    if (redirectTo) {
        res.redirect(redirectTo)
    } else {
        res.json({ token, user })
    }
    */
}

export const oauthFailure = (req: Request, res: Response) => {
    // Also redirect on failure so the user isn't stuck on a blank API page
    const loginUrl = `${
        config.frontendUrl || 'http://localhost:3000'
    }/login?error=oauth_failed`
    res.redirect(loginUrl)
}
