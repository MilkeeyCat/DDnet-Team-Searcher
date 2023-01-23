import net from "net"
import { Db } from "./db.service.js"

type Response = {
    status: "SERVER_STARTED_SUCCESSFULLY";
    pid: number;
    id: number;
    password: string;
    port: number;
} |
{
    status: "SERVER_SHUTDOWN_SUCCESSFULLY";
    pid: number;
} |
{
    status: "SERVER_STARTED_ERROR" | "SERVER_SHUTDOWN_ERROR";
}

export class Service {
    sockets: Map<string, net.Socket> = new Map()
    ips: Array<string> = []

    setIps(val: Array<string>) {
        this.ips = val
    }

    connect() {
        this.ips.forEach(ip => {
            let socket = new net.Socket();

            this.sockets.set(ip, socket);

            socket.connect(9090, ip, () => {
                console.log(`TCP connection established with ${ip}:9090`)
            })

            socket.on("error", (err) => {
                console.log("Error occured: ", err.message);
            })

            socket?.on("data", async (bytes) => {
                let res: Response = JSON.parse(Buffer.from(bytes).toString())

                if(res.status === "SERVER_SHUTDOWN_SUCCESSFULLY") {
                    let server = await Db.query("SELECT id FROM servers where pid = $1", [res.pid])
                    await Db.query("UPDATE servers SET password = NULL, pid = NULL where pid = $1", [res.pid])
                    await Db.query("UPDATE runs SET status = '2', server_id = NULL where server_id = $1", [server.rows[0].id])
                        
                } else if (res.status === "SERVER_SHUTDOWN_ERROR") {
                    // error xD
                }
        })
        })
    }

    start(ip: string, data: {password: string, config_file: string, map_name: string, id: number, port: number}, callback: (res:{
        status: "SERVER_STARTED_SUCCESSFULLY";
        pid: number;
        id: number;
        password: string;
        port: number;
    }) => void) {
        let socket = this.sockets.get(ip)

        socket?.write(Buffer.from(JSON.stringify(data) + "\n"))

        socket?.on("data", (bytes) => {
                let res: Response = JSON.parse(Buffer.from(bytes).toString())

                if(res.status === "SERVER_STARTED_SUCCESSFULLY") {
                    callback(res)
                } else if (res.status === "SERVER_STARTED_ERROR") {
                    // error :\
                }
        })
    }

    shutdown(ip: string, data: {pid: number}, callback: (res: {pid: number}) => void) {
        let socket = this.sockets.get(ip)

        socket?.write(Buffer.from(JSON.stringify(data) + "\n"))

        socket?.on("data", (bytes) => {
                let res: Response = JSON.parse(Buffer.from(bytes).toString())

                if(res.status === "SERVER_SHUTDOWN_SUCCESSFULLY") {
                    callback(res)
                } else if (res.status === "SERVER_SHUTDOWN_ERROR") {
                    // error xD
                }
        })
    }
}

export const GameServerService = new Service()