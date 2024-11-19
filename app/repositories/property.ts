import { QueryResult } from "pg"
import { Database } from "./database"
import { TableInit } from "../../types/data-interface"

export class Property extends Database implements TableInit {
  /*
   * Ensures the existence of the 'properties' table in the database.
   * If the table does not exist, it will be created with the specified columns.
   *
   * @remarks
   * This function is responsible for maintaining the integrity of the
   * 'properties' table in the database.
   * It uses the provided database connection to execute a SQL query to create
   * the table if it does not exist.
   *
   * @throws {Error} If an error occurs while creating the table, the function
   * will log the error and exit the process with a status code of 1.
   *
   * @returns {Promise<void>} A promise that resolves when the table creation
   * process is complete.
   *
   */

  async ensureTablesExist(): Promise<void> {
    await this.ensurePropertyTableExists()
  }

  async ensurePropertyTableExists() {
    try {
      const result = await this.query<QueryResult>(`
        CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255) NOT NULL,
        country VARCHAR(255) NOT NULL,
        inspection_count INTEGER DEFAULT 0,
        agent_id UUID REFERENCES agents(id)
      )`)
      console.log(`Property table created: ${result.rowCount} rows affected.`)
    } catch (err) {
      console.error("Error creating property table:", err)
      process.exit(1)
    }
  }
}
