import { database } from "$lib/server/database/singleton";
export class BaseModel {

    constructor(system) {
        this.system = system;
    }

    registered = () => {
        this.headers = undefined;
        this.row = undefined;
    }

    static getColumn = (name, headers, row) => {
        let idx = -1;
        for (let i = 0; i < headers.length; i++) {
            if (headers[i] === name) {
                idx = i;
                break;
            }
        }

        if (idx == -1) throw Error(`${name} is not a valid Column.\n Valid columns ${headers}`);

        return row[idx];
    }

    static insertTransaction = async (tableName, columns) => {
        const db = database.get();

        const insert = db.prepare(`INSERT INTO ${tableName} (${columns.join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`);

        return db.transaction((rows) => {
            for (let row of rows) {
                insert.run(row);
            }
        })
    }

    static addData = async (rows, headers, system, calendarId) => {
        throw new Error("addData(rows, headers, system, calendarId) must be implemented by the extending class.");
    }

    static selectBasic = async (tableName, columns, where, params) => {
        const db = database.get();

        const select = db.prepare(`SELECT ${columns.join(", ")} FROM ${tableName} WHERE ${where.join(" AND ")}`);

        return select.all(params);
    }

    static getAllData = async (calendarId) => {
        throw new Error("getAllData(calendarId) must be implemented by the extending class.");
    }
}