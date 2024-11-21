import { Request, Response, NextFunction } from "express"
import { verifyToken } from "../../../utils/jwt.setup";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token

  if (!token) {
    res.status(401).json({ msg: "Unauthorized" })
    return 
  }

  try {
    const decoded = verifyToken(token)
    ;(req as any).user = decoded
    next()
  } catch (err) {
    res.status(401).json({ msg: "Invalid token" })
  }
}
