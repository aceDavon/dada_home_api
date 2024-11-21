import dotenv from "dotenv"
dotenv.config()

import express from "express"
import cookieParser from "cookie-parser"
import agentRoutes from "./routes/agents"
import propertyRoutes from "./routes/properties"
import appointmentRoutes from "./routes/appointments"
import { ensureAllTables } from "./app/bootstrap"

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

ensureAllTables()
  .then(() => {
    console.log("Database initialization complete.")

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
