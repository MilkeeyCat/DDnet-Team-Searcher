import { QueryResult } from "pg";
import { Db } from "./db.service.js";
import { Service } from "./service.js";

export type DBReport = {
    id: number,
    author_id: number,
    reported_user_id: number,
    text: string | null
}

class MyService<T extends object> extends Service<T> {
    async getAll(): Promise<QueryResult<DBReport>> {
        return await Db.query<DBReport>("SELECT id::integer, author_id, reported_user_id, text FROM reports")
    }
    
    async isReportAlreadyExists({authorId, reportedUserId}: {authorId: number, reportedUserId: number}): Promise<boolean> {
        const report = await Db.query<{id?: number}>("SELECT id::integer FROM reports WHERE author_id = $1 AND reported_user_id = $2", [authorId, reportedUserId])

        if(report.rowCount) {
            return true
        }

        return false
    }

    async createReport({authorId, reportedUserId, text}: {authorId: number, reportedUserId: number, text: string}): Promise<boolean> {
        try {
            await Db.query("INSERT INTO reports (author_id, reported_user_id, text) VALUES($1, $2, $3)", [authorId, reportedUserId, text]) 
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }
}

export const ReportsService = new MyService<DBReport>("reports")