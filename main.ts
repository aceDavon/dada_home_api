import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth"
import agentRoutes from "./routes/agents"
import propertyRoutes from "./routes/properties"
import appointmentRoutes from "./routes/appointments"
import { ensureAllTables } from "./app/bootstrap"
import passport from "passport"
import "./app/config/auth/passport"

const app = express()
const port = 3000

const corsOptions = {
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())
app.use(passport.initialize())

ensureAllTables()
  .then(() => {
    console.log("Database initialization complete.")

    // Authentication routes
    app.use("/api/auth", authRoutes)
    app.use("/auth", authRoutes)

    app.use("/api/agent", agentRoutes)
    app.use("/api/property", propertyRoutes)
    app.use("/api/appointment", appointmentRoutes)

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("Database initialization error:", err)
    process.exit(1)
  })
