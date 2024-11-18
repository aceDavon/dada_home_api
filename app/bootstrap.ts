import { DB_CONFIG } from "./config/db"
import { Agents } from "./db/agent"
import { Appointment } from "./db/appointment"
import { Property } from "./db/property"

export async function ensureAllTables() {
  const agentDB = new Agents(DB_CONFIG)
  const propertyDB = new Property(DB_CONFIG)
  const appointmentDB = new Appointment(DB_CONFIG)

  await Promise.all([
    agentDB.ensureTablesExist(),
    propertyDB.ensureTablesExist(),
    appointmentDB.ensureTablesExist(),
  ])
}
