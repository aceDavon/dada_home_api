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

  async query<T>(text: string, params?: any[]): Promise<T[]> {
    const client = await this.pool.connect()
    try {
      const result = await client.query(text, params)
      return result.rows as T[]
    } catch (err) {
      console.error(err)
      throw err
    } finally {
      client.release()
    }
  }
}