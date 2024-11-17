import { QueryResult } from "pg"
import { Database } from "./database"

export class Appointment extends Database {
  async ensureAppointmentTableExists() {
    try {
      const result = await this.query<QueryResult>(
        `CREATE TABLE IF NOT EXISTS appointments (
        id SERIAL PRIMARY KEY,
        notes TEXT,
        agent_id INTEGER REFERENCES agents(id),
        appointment_type VARCHAR(255) NOT NULL,
        end_time TIMESTAMP WITH TIME ZONE NOT NULL,
        property_id INTEGER REFERENCES properties(id)
        start_time TIMESTAMP WITH TIME ZONE NOT NULL,
        );`
      )
      console.log(`Appointment table created: ${result.length} rows affected`)
    } catch (err) {
      console.error("Error creating appointment table:", err)
      process.exit(1)
    }
  }
}
