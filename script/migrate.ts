// Ensure migrations are correctly typed
import dotenv from "dotenv";
dotenv.config();
import { DB_CONFIG } from "../app/config/db";
import { SchemaManager, SchemaMigration } from "../app/schema/tableSchema";
import migrations from "../migrations";

// Properly type migrations as a record
const typedMigrations = migrations as Record<string, { default: SchemaMigration }>;

async function runMigrations() {
  const schemaManager = new SchemaManager(DB_CONFIG);

  // Validate and filter migrations
  const validMigrations = Object.entries(typedMigrations).filter(
    ([, migration]) =>
      migration?.default &&
      typeof migration.default.tableName === "string" &&
      Array.isArray(migration.default.schema) &&
      migration.default.schema.every((col) => typeof col === "string")
  );

  if (validMigrations.length === 0) {
    console.error("No valid migrations found.");
    process.exit(1);
  }

  // Apply each valid migration
  for (const [migrationName, migration] of validMigrations) {
    const migrationData = migration.default;
    console.log(`Migrating: ${migrationName}`);
    await schemaManager.ensureTableSchema(
      migrationData.tableName,
      migrationData.schema,
      migrationData.dropExtraColumns ?? false
    );
  }

  console.log("All migrations applied successfully.");
}

// Handle errors during migration
runMigrations().catch((err) => {
  console.error("Migration error:", err);
  process.exit(1);
});
