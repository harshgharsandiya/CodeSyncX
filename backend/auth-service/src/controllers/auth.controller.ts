import { Request, Response } from 'express'
import { User } from '../models/user.model'
import { hashPassword, comparePassword } from '../utils/password'
import { signToken } from '../utils/jwt'

export const register = async (req: Request, res: Response) => {
    try {
        const { email, name, password } = req.body
        if (!email || !password)
            return res
                .status(400)
                .json({ message: 'Email & password required' })

        const existing = await User.findOne({ email })
        if (existing)
            return res.status(400).json({ message: 'Email already registered' })

        const hashed = await hashPassword(password)
        const user = await User.create({ email, name, password: hashed })
        const token = signToken({ id: user._id, roles: user.roles })
        res.status(201).json({ token, user })
    } catch (err) {
        res.status(500).json({ message: 'Registration error', error: err })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user || !user.password)
            return res.status(400).json({ message: 'Invalid credentials' })

        const match = await comparePassword(password, user.password)
        if (!match)
            return res.status(400).json({ message: 'Invalid credentials' })

        const token = signToken({ id: user._id, roles: user.roles })
        res.json({ token, user })
    } catch (err) {
        res.status(500).json({ message: 'Login error', error: err })
    }
}

export const me = async (req: Request, res: Response) => {
    res.json({ user: (req as any).user })
}
