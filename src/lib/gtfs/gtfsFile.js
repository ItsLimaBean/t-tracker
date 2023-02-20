import AutoDetectDecoderStream from "autodetect-decoder-stream";
import CsvReadableStream from "csv-reader";

export class GTFSFile {
    
    constructor(nodeStream, type) {
        this.nodeStream = nodeStream;
        this.headers = [];
        this.rows = [];
        this.name = type.name;
    }

    fromCsv = () => {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            this.nodeStream
                .pipe(new AutoDetectDecoderStream({ defaultEncoding: "1255" }))
                .pipe(new CsvReadableStream({ parseNumbers: false, parseBooleans: true, trim: true }))
                .on("data", async (row) => {
                    if (this.headers.length == 0) {
                        this.headers = row;
                    } else {
                        this.rows.push(row);
                    }
                })
                .on("end", () => {
                    console.log(`Took ${Date.now() - startTime}ms to load ${this.name}.`);
                    resolve();
                })
                .on("error", (err) => {
                    reject(err);
                });
        });
    }

    getRows = () => {
        return this.rows;
    }

    getHeaders = () => {
        return this.headers;
    }
}