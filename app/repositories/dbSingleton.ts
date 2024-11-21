import { Database } from "./database"

class DatabaseInstance extends Database {
  constructor() {
    super({
      user: process.env.DB_USER || "postgres",
      host: process.env.DB_HOST || "localhost",
      database: process.env.DB_NAME || "mydb",
      password: process.env.DB_PASSWORD || "password",
      port: parseInt(process.env.DB_PORT || "5432", 10),
    })
  }
}

export const db = new DatabaseInstance()
