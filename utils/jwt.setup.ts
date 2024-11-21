import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRATION = process.env.JWT_EXPIRATION!

export const generateToken = (payload: object): string => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION })
}

export const verifyToken = (token: string): any => {
  return jwt.verify(token, JWT_SECRET)
}
