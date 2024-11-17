declare module "pg-hstore" {
  type HstoreOptions = {
    sanitize?: boolean
  }

  class PgHstore {
    constructor(options?: HstoreOptions)
    stringify(
      data: Record<string, string | null>,
      callback: (err: Error | null, result: string) => void
    ): void
    parse(
      hstoreString: string,
      callback: (
        err: Error | null,
        result: Record<string, string | null>
      ) => void
    ): void
  }

  export = PgHstore
}
