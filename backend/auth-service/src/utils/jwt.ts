import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken'
import { config } from '../config/env'

export const signToken = (payload: object): string => {
    return jwt.sign(
        payload,
        config.jwtSecret as string,
        {
            expiresIn: config.jwtExpiresIn as string | number,
        } as SignOptions
    )
}

export const verifyToken = (token: string): JwtPayload | string => {
    return jwt.verify(token, config.jwtSecret as string)
}
