export class BaseModel {

    constructor(row, headers, system) {
        this.headers = headers;
        this.row = row;
        this.system = system;
    }

    get = (name) => {
        if (this.headers === undefined || this.row === undefined) throw new Error("get(name) unavailable after this.registered is called.");
        return BaseModel.getColumn(name, this.headers, this.row);
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
}