export class BaseModel {

    constructor(row, headers) {
        this.headers = headers;
        this.row = row;
    }

    get = (name) => {
        return BaseModel.getColumn(name, this.headers, this.row);
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