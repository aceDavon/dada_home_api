import { Request, Response } from "express"
import bcrypt from "bcrypt"
import { generateToken, verifyToken } from "../../utils/jwt.setup"
import { db } from "../../app/repositories/dbSingleton"
import { Agent } from "../../app/repositories/agent"

class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const { email, password } = req.body

    const agent = await db.query<Agent>("SELECT * FROM agents WHERE email = $1", [email])

    if (!agent.rows.length) {
      res.status(401).json({ msg: "Invalid credentials" })
      return
    }

    const validPassword = await bcrypt.compare(password, agent.rows[0].password)

    if (!validPassword) {
      res.status(401).json({ msg: "Invalid credentials" })
      return
    }

    const token = generateToken({ id: agent.rows[0].id })

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })

    res.json({ msg: "Login successful", data: { id: agent.rows[0].id } })
  }

  static logout(req: Request, res: Response) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    })
    res.json({ msg: "Logged out successfully" })
    return
  }

  static async me(req: Request, res: Response): Promise<void> {
    const token = req.cookies.token

    if (!token) {
      res.status(401).json({ msg: "Unauthorized" })
      return
    }

    try {
      const decoded = verifyToken(token)
      const agent = await db.query<Agent>("SELECT id, email FROM agents WHERE id = $1", [
        decoded.id,
      ])

      if (!agent.rows.length) {
        res.status(404).json({ msg: "Agent not found" })
        return 
      }

      res.json(agent.rows[0])
    } catch (err) {
      res.status(401).json({ msg: "Invalid token" })
    }
  }
}

export default AuthController
