// src/config/passport.ts
import passport from 'passport'
import {
    Strategy as GoogleStrategy,
    Profile as GoogleProfile,
} from 'passport-google-oauth20'
import { Strategy as GitHubStrategy } from 'passport-github2'
import { config } from './env'
import { User } from '../models/user.model'
import { IUser } from '../models/user.model'

// Helper: upsert or link user
const findOrCreateOAuthUser = async (
    provider: 'google' | 'github',
    providerId: string,
    profile: any
) => {
    // Try find by provider id first
    const existing = await User.findOne({
        'providers.provider': provider,
        'providers.providerId': providerId,
    })
    if (existing) {
        // update name/avatar if changed
        let changed = false
        if (profile.displayName && existing.name !== profile.displayName) {
            existing.name = profile.displayName
            changed = true
        }
        if (
            profile.photos?.[0]?.value &&
            existing.avatarUrl !== profile.photos[0].value
        ) {
            existing.avatarUrl = profile.photos[0].value
            changed = true
        }
        if (changed) await existing.save()
        return existing
    }

    // fallback: try find by email to link accounts
    const email = profile.emails?.[0]?.value
    if (email) {
        const byEmail = await User.findOne({ email })
        if (byEmail) {
            // append provider to providers array if not present
            byEmail.providers = byEmail.providers || []
            const already = byEmail.providers.find(
                (p) => p.provider === provider && p.providerId === providerId
            )
            if (!already) {
                byEmail.providers.push({ provider, providerId })
                await byEmail.save()
            }
            return byEmail
        }
    }

    // create new user
    const newUser = await User.create({
        email: email || `${provider}:${providerId}@placeholder.local`, // placeholder if no email from provider
        name: profile.displayName || provider,
        avatarUrl: profile.photos?.[0]?.value,
        providers: [{ provider, providerId }],
        roles: ['user'],
    })
    return newUser
}

export const setupPassport = () => {
    // Google
    if (config.googleClientId && config.googleClientSecret) {
        passport.use(
            new GoogleStrategy(
                {
                    clientID: config.googleClientId,
                    clientSecret: config.googleClientSecret,
                    callbackURL: config.googleCallbackUrl,
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: GoogleProfile,
                    done: any
                ) => {
                    try {
                        const user = await findOrCreateOAuthUser(
                            'google',
                            profile.id,
                            profile
                        )
                        return done(null, user)
                    } catch (err) {
                        return done(err)
                    }
                }
            )
        )
    }

    // GitHub
    if (config.githubClientId && config.githubClientSecret) {
        passport.use(
            new GitHubStrategy(
                {
                    clientID: config.githubClientId,
                    clientSecret: config.githubClientSecret,
                    callbackURL: config.githubCallbackUrl,
                    scope: ['user:email'],
                },
                async (
                    accessToken: string,
                    refreshToken: string,
                    profile: any,
                    done: any
                ) => {
                    try {
                        // Github sometimes provides emails in profile.emails
                        const user = await findOrCreateOAuthUser(
                            'github',
                            profile.id,
                            profile
                        )
                        return done(null, user)
                    } catch (err) {
                        return done(err)
                    }
                }
            )
        )
    }

    // Minimal passport serialize/deserialize (we use JWT, so these are not critical)
    passport.serializeUser((user: any, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id: string, done) => {
        try {
            const user = await User.findById(id)
            done(null, user)
        } catch (err) {
            done(err)
        }
    })
}
