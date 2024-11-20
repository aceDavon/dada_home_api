import { QueryResult, QueryResultRow } from "pg"
import { Database } from "../repositories/database"

export class SchemaManager extends Database {
  async ensureTableSchema(
    tableName: string,
    desiredSchema: string[],
    dropExtraColumns = false
  ): Promise<void> {
    try {
      // Convert schema array to an object
      const desiredSchemaMap = this.parseSchemaArray(desiredSchema)

      // Fetch current schema from the database
      const currentSchema = await this.getTableSchema(tableName)

      // Generate ALTER TABLE statements
      const alterStatements = this.getSchemaDiff(
        tableName,
        desiredSchemaMap,
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
   * Converts an array of schema definitions into a map of column names to definitions.
   * @param schemaArray - Array of column definitions as strings.
   * @returns A map of column names to their SQL definitions.
   */
  private parseSchemaArray(schemaArray: string[]): Record<string, string> {
    const schemaMap: Record<string, string> = {}

    for (const definition of schemaArray) {
      const match = definition.match(/^(\w+)\s+(.*)$/)
      if (match) {
        const [, columnName, columnDefinition] = match
        schemaMap[columnName] = columnDefinition
      } else {
        throw new Error(`Invalid schema definition: '${definition}'`)
      }
    }

    return schemaMap
  }

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
  schema: string[]
  dropExtraColumns: boolean
}
