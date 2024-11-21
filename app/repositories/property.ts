import { QueryResult } from "pg"
import { Database } from "./database"
import { TableInit } from "../../types/data-interface"

export class Property extends Database implements TableInit {
  /**
   * Ensures the existence of the 'properties' table in the database.
   * If the table does not exist, it will be created with the specified columns.
   * @remarks - This function is responsible for maintaining the integrity of 
   * the 'properties' table in the database.
   * It uses the provided database connection to execute a SQL query to create
   * the table if it does not exist.
   * @throws {Error} If an error occurs while creating the table, the function
   * will log the error and exit the process with a status code of 1.
   * @returns {Promise<void>} A promise that resolves when the table creation
   * process is complete.
   */

  async ensureTablesExist(): Promise<void> {
    await this.ensurePropertyTableExists()
  }

  async createProperty(data: PropertyData): Promise<PropertyData> {
    const query =
      "INSERT INTO properties (address, city, state, zip_code, country, inspection_count, agent_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"

    const values = [
      data.address,
      data.city,
      data.state,
      data.zip_code,
      data.country,
      data.inspection_count,
      data.agent_id,
    ]

    const result = await this.query<PropertyData>(query, values)

    return result.rows[0]
  }

  async getProperties(): Promise<PropertyData[]> {
    const properties = await this.query<PropertyData>(
      "SELECT * FROM properties"
    )

    return properties.rows
  }

  async getProperty(
    propertyId: string
  ): Promise<PropertyData> {
    const query = `SELECT 
    properties.*,
    COALESCE(
      json_agg(appointments) FILTER (WHERE appointments.id IS NOT NULL), 
      '[]'
    ) AS appointments
  FROM properties
  LEFT JOIN appointments ON properties.id = appointments.property_id
  WHERE properties.id = $1
  GROUP BY properties.id;`

    const property = await this.query<PropertyData>(query, [propertyId])

    return property.rows[0]
  }

  async updateProperty(
    propertyId: string,
    data: Record<string, string | number>
  ) {
    const fields = Object.keys(data)
    const values = Object.keys(data)

    if (fields.length === 0) {
      throw new Error("No fields provided for update.")
    }

    const setClause = fields
      .map((field, i) => `${field} = $${i + 2}`)
      .join(", ")

    const query = `UPDATE properties Set ${setClause} where id = $1 RETURNING *`
    const result = await this.query<number | null>(query, [
      propertyId,
      ...values,
    ])

    return result.rowCount
  }

  async ensurePropertyTableExists() {
    try {
      const result = await this.query<QueryResult>(`
        CREATE TABLE IF NOT EXISTS properties (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        state VARCHAR(255) NOT NULL,
        zip_code VARCHAR(255),
        country VARCHAR(255) NOT NULL,
        inspection_count INTEGER DEFAULT 0,
        agent_id UUID REFERENCES agents(id) NOT NULL
      )`)
      console.log(`Property table created: ${result.rowCount} rows affected.`)
    } catch (err) {
      console.error("Error creating property table:", err)
      process.exit(1)
    }
  }
}

export interface PropertyData {
  id?: string
  address: string
  city: string
  state: string
  zip_code?: string
  country: string
  inspection_count?: number
  agent_id: string
}
