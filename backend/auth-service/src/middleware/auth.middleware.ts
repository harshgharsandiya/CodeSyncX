import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { config } from '../config/env'
import { User } from '../models/user.model'

export const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization
    if (!authHeader?.startsWith('Bearer '))
        return res.status(401).json({ message: 'Missing token' })

    const token = authHeader.split(' ')[1]
    try {
        const decoded = jwt.verify(token, config.jwtSecret) as any
        const user = await User.findById(decoded.id)
        if (!user) return res.status(401).json({ message: 'User not found' })
        ;(req as any).user = user
        next()
    } catch (err) {
        res.status(401).json({ message: 'Invalid token' })
    }
}
