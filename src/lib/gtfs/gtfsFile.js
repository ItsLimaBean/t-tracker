import AutoDetectDecoderStream from "autodetect-decoder-stream";
import CsvReadableStream from "csv-reader";
import { BaseModel } from "./models/baseModel";

export class GTFSFile {
    constructor(nodeStream, type) {
        this.nodeStream = nodeStream;
        this.type = type;
    }

    fromCsv = () => {
        return new Promise((resolve, reject) => {
            const startTime = new Date();

            let headers = [];
            const rows = [];

            this.nodeStream
                .pipe(new AutoDetectDecoderStream({ defaultEncoding: "1255" }))
                .pipe(new CsvReadableStream({ parseNumbers: false, parseBooleans: true, trim: true }))
                .on("data", async (row) => {
                    if (headers.length == 0) {
                        headers = row;
                    } else {
                        rows.push(row);
                    }
                })
                .on("end", () => {
                    console.log(`Took ${Date.now() - startTime}ms to load ${this.type.name}.`);
                    const parsedType = this.build(rows, headers);
                    resolve(parsedType);
                });
        });
    }

    build = (row, headers) => {
        const startTime = Date.now();
        if (this.type.mapper) {
            [row, headers] = this.type.mapper(row, headers);
        }

        let t = {};
        for (let v of row) {
            let index = BaseModel.getColumn(this.type.index(), headers, v);
            t[index] = new this.type(v, headers);
        }

        console.log(`Took ${Date.now() - startTime}ms to parse ${this.type.name}.`);
        return t;

    }

}