import pkg, { QueryResult } from "pg"

const {Pool} = pkg

export class Db {
    static query<T extends {[column: string]: any}>(sql: string, params?: (string | number)[]): Promise<QueryResult<T>> {
        const pool = new Pool();

        return (async () => {
            const client = await pool.connect()
            try {
                return await client.query(sql, params)
            } finally {
                client.release()
            }
        })().catch(err => {
            console.log("Lol something broke in db.service.ts");
            throw Error(err.stack)
        })
    }
}