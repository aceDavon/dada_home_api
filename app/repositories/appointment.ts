import { QueryResult } from "pg"
import { Database } from "./database"
import { TableInit } from "../../types/data-interface"
export class Appointment extends Database implements TableInit {
  /**
   * Ensures the existence of the 'appointments' table in the database.
   * If the table does not exist, it will be created with the specified columns.
   * @remarks - This function is responsible for maintaining the integrity of
   * the 'appointments' table in the database.
   * It uses the provided database connection to execute a SQL query to create
   * the table if it does not exist.
   * @throws {Error} If an error occurs while creating the table, the function
   * will log the error and exit the process with a status code of 1.
   * @returns {Promise<void>} A promise that resolves when the table creation
   * process is complete.
   */

  async ensureTablesExist(): Promise<void> {
    await this.ensureAppointmentTableExists()
  }

  /**
   * Creates a new appointment in the database.
   * @param data - The appointment data to be inserted.
   * @returns The created appointment record.
   */
  async createAppointment(data: AppointmentData): Promise<AppointmentData> {
    const query = `
        INSERT INTO appointments (notes, appointment_type, appointment_time, property_id)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `

    const values = [
      data.notes || null,
      data.appointmentType,
      `[${data.appointmentTime[0]},${data.appointmentTime[1]}]`,
      data.propertyId || null,
    ]

    const result = await this.query(query, values)

    return result.rows[0] as AppointmentData
  }

  async ensureAppointmentTableExists() {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        notes TEXT,
        appointment_type VARCHAR(255) NOT NULL,
        appointment_time tsrange NOT NULL,
        property_id UUID REFERENCES properties(id)
        );`
      )
      console.log(`Appointment table created: ${result.rowCount} rows affected`)
    } catch (err) {
      console.error("Error creating appointment table:", err)
      process.exit(1)
    }
  }
}

export interface AppointmentData {
  notes?: string
  appointmentType: string
  appointmentTime: [string, string] // Start and end times in ISO string format
  propertyId?: string
}
