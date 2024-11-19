import fs from "fs"
import path from "path"

const MIGRATIONS_DIR = path.join(__dirname, "../migrations")

function getTimestampedFilename(name: string): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "")
  return `${timestamp}_${name}.ts`
}

function constructTableName(name: string): string {
  const words = name.split("_")

  // Remove the last word
  words.pop()

  // Capitalize the first letter of each word except the first one
  const tableName = words
    .map((word, index) => {
      return index === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join("")

  return tableName
}

function getMigrationTemplate(name: string, table: string): string {
  return `import { SchemaMigration } from "../app/schema/tableSchema";

const ${constructTableName(name)}: SchemaMigration = {
  tableName: "${table}",
  schema: {
    id: "UUID PRIMARY KEY DEFAULT uuid_generate_v4()",
    // Add your additional table-specific columns here
    // e.g., columnName: "DATA_TYPE CONSTRAINTS"
    created_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP",
    updated_at: "TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
  },
  dropExtraColumns: false, // Change to true to drop columns not in the schema
};

export default ${constructTableName(name)};
`
}


function generateMigrationFile(name: string, tableName: string): void {
  if (!fs.existsSync(MIGRATIONS_DIR)) {
    fs.mkdirSync(MIGRATIONS_DIR, { recursive: true })
  }

  const filename = getTimestampedFilename(name)
  const filePath = path.join(MIGRATIONS_DIR, filename)
  const template = getMigrationTemplate(name, tableName)

  fs.writeFileSync(filePath, template, "utf-8")
  console.log(`Migration file created: ${filePath}`)
}

// CLI
const [name, tableName] = process.argv.slice(2)

if (!name || !tableName) {
  console.error("Usage: ts-node script/generateMigration.ts <name> <tableName>")
  process.exit(1)
}

generateMigrationFile(name, tableName)
