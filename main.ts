import dotenv from "dotenv"
dotenv.config()

import express from "express"
import agentRoutes from "./routes/agents"
import { ensureAllTables } from "./app/bootstrap"

const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())

ensureAllTables()
  .then(() => {
    console.log("Database initialization complete.")

    app.use("/api/agent", agentRoutes)

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`)
    })
  })
  .catch((err) => {
    console.error("Database initialization error:", err)
    process.exit(1)
  })
