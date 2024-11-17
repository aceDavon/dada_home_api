import { hash } from "bcrypt"
import { QueryResult } from "pg"
import { Database } from "./database"

export class Agents extends Database {
  async createUser(email: string, password: string): Promise<Agent> {
    const hashedPassword = await hash(password, 10)
    const result = await this.query<Agent>(
      "INSERT INTO agents (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    )
    return result[0]
  }

  async getUserByEmail(email: string): Promise<Agent | null> {
    const result = await this.query<Agent>(
      "SELECT * FROM agents WHERE email = $1",
      [email]
    )
    return result[0] || null
  }

  async ensureUsersTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        "CREATE TABLE IF NOT EXISTS agents (" +
          "id SERIAL PRIMARY KEY," +
          "last_name VARCHAR(255) NULL," +
          "photo_url VARCHAR(250) NULL," +
          "first_name VARCHAR(255) NULL," +
          "password VARCHAR(255) NOT NULL," +
          "email VARCHAR(255) UNIQUE NOT NULL, " +
          "updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()" +
          "created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()," +
          "email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL," +
          ")"
      )
      console.log(`Agents table created: ${result.length} rows affected.`)
    } catch (err) {
      console.error("Error creating agents table:", err)
      process.exit(1)
    }
  }

  async ensurePhonesTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS phones (
        id SERIAL PRIMARY KEY,
        phone_type VARCHAR(255) NOT NULL,
        agent_id INTEGER REFERENCES agents(id)
        phone_number VARCHAR(255) UNIQUE NOT NULL,
        phone_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL,
      )`
      )
      console.log(`Phones table created: ${result.length} rows affected.`)
    } catch (err) {
      console.error("Error creating phones table:", err)
      process.exit(1)
    }
  }

  async ensureAddressesTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255) NOT NULL,
        agent_id INTEGER REFERENCES agents(id)
      )`
      )
      console.log(`Addresses table created: ${result.length} rows affected.`)
    } catch (err) {
      console.error("Error creating addresses table:", err)
      process.exit(1)
    }
  }
}

interface Agent {
  id: number
  email: string
  password: string
}
