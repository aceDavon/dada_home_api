import { QueryResult } from "pg"
import { Database } from "./database"
import { TableInit } from "../../types/data-interface"
export class Appointment extends Database implements TableInit {
  /*
   * Ensures the existence of the 'appointments' table in the database.
   * If the table does not exist, it will be created with the specified columns.
   *
   * @remarks
   * This function is responsible for maintaining the integrity of the 
   * 'appointments' table in the database.
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
        await this.ensureAppointmentTableExists()
    }

  async ensureAppointmentTableExists() {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS appointments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        notes TEXT,
        agent_id UUID REFERENCES agents(id),
        appointment_type VARCHAR(255) NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        property_id UUID REFERENCES properties(id),
        start_time TIMESTAMP WITH TIME ZONE NOT NULL
        );`
      )
      console.log(`Appointment table created: ${result.length} rows affected`)
    } catch (err) {
      console.error("Error creating appointment table:", err)
      process.exit(1)
    }
  }
}
