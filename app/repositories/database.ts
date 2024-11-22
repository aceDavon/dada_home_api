import { Pool } from "pg"
import { Agent, UserData } from "./agent"

export abstract class Database {
  protected pool: Pool

  constructor(config: {
    user: string
    host: string
    database: string
    password: string
    port: number
  }) {
    this.pool = new Pool(config)
  }

  async query<T>(
    text: string,
    params?: any[]
  ): Promise<{ rows: T[]; rowCount: number | null }> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(text, params)
      return { rows: result.rows as T[], rowCount: result.rowCount }
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      client.release()
    }
  }

  async findOrCreateUser(userData: UserData): Promise<Agent> {
  let user = await this.query<Agent>("SELECT * FROM agents WHERE google_id = $1", [
    userData.googleId,
  ]);

  if (user.rows.length) {
    return user.rows[0];
  }

  user = await this.query("SELECT * FROM agents WHERE email = $1", [
    userData.email,
  ]);

  if (user.rows.length) {
    await this.query("UPDATE agents SET google_id = $1 WHERE email = $2", [
      userData.googleId,
      userData.email,
    ]);

    return { ...user.rows[0], google_id: userData.googleId };
  }

  // If no user exists, create a new record
  const result = await this.query<Agent>(
    "INSERT INTO agents (google_id, email, first_name) VALUES ($1, $2, $3) RETURNING *",
    [userData.googleId, userData.email, userData.name]
  );

  return result.rows[0];
}


  formatTsRange(tsrange: string): string {
    // Example input: "[\"2022-03-20 00:00:00\",\"2022-03-21 00:00:00\")"
    const match = tsrange.match(/^\["(.+?)","(.+?)"\)$/)
    if (!match) {
      throw new Error(`Invalid tsrange format: ${tsrange}`)
    }

    return `[${match[1]},${match[2]}]`
  }
}
