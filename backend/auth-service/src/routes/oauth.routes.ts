// src/routes/oauth.routes.ts
import { Router } from 'express'
import passport from 'passport'
import { oauthSuccess, oauthFailure } from '../controllers/oauth.controller'

const router = Router()

// Google - start
router.get('/google', (req, res, next) => {
    // optional: pass `state` or `redirect` in query and persist in session
    passport.authenticate('google', { scope: ['profile', 'email'] })(
        req,
        res,
        next
    )
})

// Google - callback
router.get(
    '/google/callback',
    passport.authenticate('google', {
        session: false,
        failureRedirect: '/api/auth/oauth/failure',
    }),
    oauthSuccess
)

// GitHub - start
router.get('/github', (req, res, next) => {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next)
})

// GitHub - callback
router.get(
    '/github/callback',
    passport.authenticate('github', {
        session: false,
        failureRedirect: '/api/auth/oauth/failure',
    }),
    oauthSuccess
)

router.get('/failure', oauthFailure)

export default router
