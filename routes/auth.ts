import { Router } from "express"
import AuthController from "../controllers/auth/authentication.controller"
import passport from "passport"
import { generateToken } from "../utils/jwt.setup"

const router = Router()

router.post("/login", AuthController.login)
router.post("/logout", AuthController.logout)

router.get("/me", AuthController.me)
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
      .json({ msg: "Authenticated successfully." })
  }
)

export default router
