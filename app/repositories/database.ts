import { Pool } from "pg"

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

  formatTsRange(tsrange: string): string {
    // Example input: "[\"2022-03-20 00:00:00\",\"2022-03-21 00:00:00\")"
    const match = tsrange.match(/^\["(.+?)","(.+?)"\)$/)
    if (!match) {
      throw new Error(`Invalid tsrange format: ${tsrange}`)
    }

    return `[${match[1]},${match[2]}]`
  }
}
