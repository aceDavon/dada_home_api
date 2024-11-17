import { QueryResult } from "pg"
import { Database } from "./database"

export class Property extends Database {
  async ensurePropertyTableExists() {
    try {
      const result = await this.query<QueryResult>(`
        CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        inspection_count INTEGER DEFAULT 0,
        agent_id INTEGER REFERENCES agents(id)
      )`)
      console.log(`Property table created: ${result.length} rows affected.`)
    } catch (err) {
      console.error("Error creating property table:", err)
      process.exit(1)
    }
  }
}
