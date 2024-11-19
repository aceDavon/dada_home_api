import dotenv from "dotenv"
dotenv.config()
import { DB_CONFIG } from "../app/config/db"
import { SchemaManager, SchemaMigration } from "../app/schema/tableSchema"
import migrations from "../migrations"

type Migrations = Record<string, { default: SchemaMigration }>

const typedMigrations = migrations as Migrations

async function runMigrations() {
  const schemaManager = new SchemaManager(DB_CONFIG)

  // Validate and filter migrations upfront
  const validMigrations = Object.entries(typedMigrations).filter(
    ([, migration]) =>
      migration?.default &&
      "tableName" in migration.default &&
      "schema" in migration.default
  )

  if (validMigrations.length === 0) {
    console.error("No valid migrations found.")
    process.exit(1)
  }

  // Apply each valid migration
  for (const [migrationName, migration] of validMigrations) {
    const migrationData = migration.default
    console.log(`Migrating: ${migrationName}`)
    await schemaManager.ensureTableSchema(
      migrationData.tableName,
      migrationData.schema,
      migrationData.dropExtraColumns ?? false
    )
  }

  console.log("All migrations applied successfully.")
}

runMigrations().catch((err) => {
  console.error("Migration error:", err)
  process.exit(1)
})
