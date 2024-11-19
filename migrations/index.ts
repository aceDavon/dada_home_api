import fs from "fs"
import path from "path"

const migrationsDir = __dirname

// Dynamically import all migration files in the directory
const migrationModules = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".ts") && file !== "index.ts")
  .reduce((exports, file) => {
    const moduleName = path.parse(file).name
    const modulePath = path.join(migrationsDir, file)
    exports[moduleName] = require(modulePath)
    return exports
  }, {} as Record<string, unknown>)

export default migrationModules
