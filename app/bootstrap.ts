import { DB_CONFIG } from "./config/db"
import { Agents } from "./repositories/agent"
import { Appointment } from "./repositories/appointment"
import { Property } from "./repositories/property"

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
