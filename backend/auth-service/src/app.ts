import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import passport from 'passport'
import { config } from './config/env'
import authRoutes from './routes/auth.routes'
import oauthRoutes from './routes/oauth.routes'
import { setupPassport } from './config/passport'

const app = express()
app.use(cors())
app.use(express.json())

// initialize passport
setupPassport()
app.use(passport.initialize())

app.use('/api/auth', authRoutes)
app.use('/api/auth/oauth', oauthRoutes)

mongoose
    .connect(config.mongoUri)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Mongo connection error', err))

export default app
