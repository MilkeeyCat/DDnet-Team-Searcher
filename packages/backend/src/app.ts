import express, {Response} from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import {UsersRouter} from "./routes/users.route.js"
import {RunsRouter} from "./routes/runs.route.js"
import cron from "node-cron"
import {RunsService} from "./services/runs.service.js"
import { EventsRouter } from "./routes/events.route.js"
import { GameServerService } from "./services/gameServer.service.js"
import { ServersService } from "./services/servers.service.js"
import { json } from "body-parser"
import path from "path"

const app = express()
const port = 8080

dotenv.config()
app.use("/public", express.static("./public"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:5173")
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    res.header("Access-Control-Allow-Credentials", "true")

    res.header("Access-Control-Allow-Headers", "Content-type,Accept,X-Custom-Header")

    if (req.method === "OPTIONS") {
        return res.status(200).end()
    }

    return next()
})


app.use("/api", UsersRouter)
app.use("/api", RunsRouter)
app.use("/api", EventsRouter)

app.get("/*", (_, res: Response) => {
    res.sendFile("public/index.html", {root: "./"})
})

cron.schedule("* * * * *", async () => {
    await RunsService.update()
})

app.listen(port, async () => {
    const res = await ServersService.getServersIp()
    const ips = res.rows.map(obj => obj.ip)
    
    GameServerService.ips = ips
    GameServerService.connect()

    console.log(`server started at http://localhost:${port}`)
})