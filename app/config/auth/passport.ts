import passport from "passport"
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { db } from "../../repositories/dbSingleton"
import { error } from "console"

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLOUD_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLOUD_CLIENT_SECRET!,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const { id, emails, displayName } = profile
      try {
        if (emails) {
          const user = await db.findOrCreateUser({
            googleId: id,
            email: emails[0].value,
            name: displayName,
          })
          done(null, user)
        }
        done(error)
      } catch (error) {
        done(error)
      }
    }
  )
)
