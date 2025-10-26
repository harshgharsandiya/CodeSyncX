import dotenv from 'dotenv'

dotenv.config()

export const config = {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 5000,
    mongoUri:
        process.env.MONGO_URI || 'mongodb://localhost:27017/codesyncx-auth',
    jwtSecret: process.env.JWT_SECRET || 'devsecret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
    frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',

    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    googleCallbackUrl:
        process.env.GOOGLE_CALLBACK_URL ||
        'http://localhost:5000/api/auth/oauth/google/callback',

    githubClientId: process.env.GITHUB_CLIENT_ID || '',
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    githubCallbackUrl:
        process.env.GITHUB_CALLBACK_URL ||
        'http://localhost:5000/api/auth/oauth/github/callback',
}
