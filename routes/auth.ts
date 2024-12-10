import { Router } from "express"
import AuthController from "../controllers/auth/authentication.controller"
import passport from "passport"
import { generateToken } from "../utils/jwt.setup"
import { authMiddleware } from "../controllers/auth/middleware/authMiddleware.setup"

const router = Router()

router.post("/login", AuthController.login)
router.post("/logout", AuthController.logout)

router.get("/me", authMiddleware, AuthController.me)
router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
)
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const user = req.user as { id: string }
    const token = generateToken({ id: user.id })
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(200)
      .redirect(`http://localhost:5173/auth/google/${user.id}`)
  }
)

export default router
