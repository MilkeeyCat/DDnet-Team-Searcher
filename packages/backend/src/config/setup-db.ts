import {Db} from "../services/db.service.js"
import fs from "fs"
import dotenv from "dotenv"

(async () => {
    dotenv.config()
    
    const sql = fs.readFileSync("db.sql", "utf8");
    
    console.log(sql)

    await Db.query(sql);
})()