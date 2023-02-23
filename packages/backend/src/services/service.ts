import { Db } from "./db.service.js";

const where = <T extends object>(data: T, index = 0): {value: string, index: number} => {
    let currentIndex = index

    const res = Object.keys(data).map((key) => {
        currentIndex++
        return `${key} = $${currentIndex}`
    }).join(" AND ")

    return {
        value: res,
        index: currentIndex
    }
}

const set = <T extends object>(data: T, index = 0): {value: string, index: number} => {
    let currentIndex = index

    const res = Object.keys(data).map((key) => {
        currentIndex++
        return `${key} = $${currentIndex}`
    }).join(", ")

    return {
        value: res,
        index: currentIndex
    }
}

export class Service<T extends object> {
    table: string;

    constructor(table: string) {
        this.table = table
    }

    async delete(data: Partial<T>): Promise<boolean> {
        try {
            const {value} = where(data)

            await Db.query(`DELETE FROM ${this.table} WHERE ${value}`, Object.values(data))
            return true
        } catch(e) {
            console.log(e)
            return false 
        }
    }

    async update(data: Partial<T>, whereObj: Partial<T>) {
        const {value, index} = set(data)
        const {value: whereString} = where(whereObj, index)

        try {
            //@ts-ignore
            await Db.query(`UPDATE ${this.table} SET ${value} WHERE ${whereString}`, [...Object.values(data), ... Object.values(whereObj)])
            return true
        } catch(e) {
            console.log(e);
            return false
        }
    }
}