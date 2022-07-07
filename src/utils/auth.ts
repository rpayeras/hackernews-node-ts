import { JwtPayload, verify } from 'jsonwebtoken'
import * as dotenv from 'dotenv'

dotenv.config()

export const APP_SECRET = process.env.APP_SECRET || ''

export interface AuthTokenPayload extends JwtPayload{
  userId?: number
}

export function decodeAuthHeader (authHeader: String): AuthTokenPayload {
  const token = authHeader.replace('Bearer ', '')

  if (!token) {
    throw new Error('No token found')
  }

  return verify(token, APP_SECRET) as AuthTokenPayload
}
