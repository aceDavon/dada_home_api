import { hash } from "bcrypt"
import { QueryResult } from "pg"
import { Database } from "./database"
import { TableInit } from "../../types/data-interface"

export class Agents extends Database implements TableInit {
  async ensureTablesExist(): Promise<void> {
    await this.ensureUsersTableExists()
    await this.ensureAddressesTableExists()
    await this.ensurePhonesTableExists()
  }

  async createAgent(email: string, password: string): Promise<Agent> {
    const hashedPassword = await hash(password, 10)
    const result = await this.query<Agent>(
      "INSERT INTO agents (email, password) VALUES ($1, $2) RETURNING *",
      [email, hashedPassword]
    )
    return result.rows[0]
  }

  async getUserByEmail(email: string): Promise<Agent | null> {
    const result = await this.query<Agent>(
      "SELECT * FROM agents WHERE email = $1",
      [email]
    )
    return result.rows[0] || null
  }

  async updateAgent(
    agentId: string,
    data: Partial<Agent>
  ): Promise<Agent | null> {
    const fields = Object.keys(data)
    const values = Object.values(data)

    if (fields.length === 0)
      throw new Error("No data provided for updating agent")

    const setClause = fields
      .map((field, i) => `${field} = $${i + 2}`)
      .join(", ")

    const query = `UPDATE agents SET ${setClause} WHERE id = $1 RETURNING *`
    const result = await this.query<Agent>(query, [agentId, ...values])

    return result.rows[0] || null
  }

  async removeAgent(agentId: string): Promise<number | null> {
    const result = await this.query("DELETE FROM agents WHERE id = $1", [
      agentId,
    ])

    return result.rowCount
  }

  async ensureUsersTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        "CREATE TABLE IF NOT EXISTS agents (" +
          "id UUID PRIMARY KEY DEFAULT uuid_generate_v4()," +
          "last_name VARCHAR(255) NULL," +
          "photo_url VARCHAR(250) NULL," +
          "first_name VARCHAR(255) NULL," +
          "password VARCHAR(255) NOT NULL," +
          "email VARCHAR(255) UNIQUE NOT NULL, " +
          "updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()," +
          "created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()," +
          "email_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL" +
          ")"
      )
      console.log(`Agents table created: ${result.rowCount} rows affected.`)
    } catch (err) {
      console.error("Error creating agents table:", err)
      process.exit(1)
    }
  }

  async ensurePhonesTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS phones (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        phone_type VARCHAR(255) NOT NULL,
        agent_id UUID REFERENCES agents(id),
        phone_number VARCHAR(255) UNIQUE NOT NULL,
        phone_verified_at TIMESTAMP WITH TIME ZONE DEFAULT NULL
      )`
      )
      console.log(`Phones table created: ${result.rowCount} rows affected.`)
    } catch (err) {
      console.error("Error creating phones table:", err)
      process.exit(1)
    }
  }

  async ensureAddressesTableExists(): Promise<void> {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        street VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255) NOT NULL,
        agent_id UUID REFERENCES agents(id)
      )`
      )
      console.log(`Addresses table created: ${result.rowCount} rows affected.`)
    } catch (err) {
      console.error("Error creating addresses table:", err)
      process.exit(1)
    }
  }
}

export interface Agent {
  id: number
  email: string
  password: string
  first_name: string
  last_name: string
  photo_url: string
}
