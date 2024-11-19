import { QueryResult, QueryResultRow } from "pg"
import { Database } from "../repositories/database"

export class SchemaManager extends Database {
  /**
   * Ensures a table matches the desired schema by adding, modifying, or removing columns.
   * @param tableName - The name of the table to alter.
   * @param desiredSchema - The desired schema definition as a mapping of column names to their data types and constraints.
   * @param dropExtraColumns - Whether to drop columns not defined in the desired schema. Defaults to false.
   * @returns A promise that resolves when the schema changes are applied.
   */
  async ensureTableSchema(
    tableName: string,
    desiredSchema: Record<string, string>,
    dropExtraColumns = false
  ): Promise<void> {
    try {
      // Fetch current schema from the database
      const currentSchema = await this.getTableSchema(tableName)

      // Generate ALTER TABLE statements
      const alterStatements = this.getSchemaDiff(
        tableName,
        desiredSchema,
        currentSchema,
        dropExtraColumns
      )

      // Apply changes
      if (alterStatements.length > 0) {
        console.log(`Applying schema updates to '${tableName}' table...`)
        for (const statement of alterStatements) {
          await this.query<QueryResult>(statement)
        }
        console.log(
          `Schema updated: ${alterStatements.length} changes applied.`
        )
      } else {
        console.log(`No schema changes required for '${tableName}' table.`)
      }
    } catch (err) {
      console.error(`Error updating schema for table '${tableName}':`, err)
      throw err
    }
  }

  /**
   * Fetches the schema of a given table from the database.
   * @param tableName - The name of the table to fetch the schema for.
   * @returns A mapping of column names to their data types and constraints.
   */
  private async getTableSchema(
    tableName: string
  ): Promise<Record<string, string>> {
    const query = `
      SELECT column_name, data_type, character_maximum_length, is_nullable
      FROM information_schema.columns
      WHERE table_name = $1
    `
    const result = await this.query<QueryResultRow>(query, [tableName])

    const schema: Record<string, string> = {}
    result.rows.forEach((row) => {
      const type = row.character_maximum_length
        ? `${row.data_type.toUpperCase()}(${row.character_maximum_length})`
        : row.data_type.toUpperCase()

      schema[row.column_name] = `${type} ${
        row.is_nullable === "NO" ? "NOT NULL" : ""
      }`.trim()
    })

    return schema
  }

  /**
   * Compares the desired schema with the current schema and generates ALTER TABLE statements.
   * @param tableName - The name of the table to update.
   * @param desiredSchema - The desired schema definition.
   * @param currentSchema - The current schema definition.
   * @param dropExtraColumns - Whether to drop columns not in the desired schema.
   * @returns An array of ALTER TABLE SQL statements.
   */
  private getSchemaDiff(
    tableName: string,
    desiredSchema: Record<string, string>,
    currentSchema: Record<string, string>,
    dropExtraColumns: boolean
  ): string[] {
    const statements: string[] = []

    // Add or update columns
    for (const [column, definition] of Object.entries(desiredSchema)) {
      if (!currentSchema[column]) {
        statements.push(
          `ALTER TABLE ${tableName} ADD COLUMN ${column} ${definition}`
        )
      } else if (currentSchema[column] !== definition) {
        statements.push(
          `ALTER TABLE ${tableName} ALTER COLUMN ${column} TYPE ${definition}`
        )
      }
    }

    // Remove extra columns not in the desired schema
    if (dropExtraColumns) {
      for (const column of Object.keys(currentSchema)) {
        if (!desiredSchema[column]) {
          statements.push(`ALTER TABLE ${tableName} DROP COLUMN ${column}`)
        }
      }
    }

    return statements
  }
}

export interface SchemaMigration {
  tableName: string
  schema: Record<string, string>
  dropExtraColumns: boolean
}
