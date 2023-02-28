import AutoDetectDecoderStream from "autodetect-decoder-stream";
import CsvReadableStream from "csv-reader";

export class GTFSFile {
    constructor(nodeStream, type, systemName, calendarId) {
        this.nodeStream = nodeStream;
        this.type = type || { name: "unknown" };
        this.systemName = systemName;
        this.calendarId = calendarId;
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
                .on("end", async () => {
                    console.log(`[${this.systemName}] Took ${Date.now() - startTime}ms to insert ${this.type.name} into database.`);
                    await this.type.addData(rows, headers, this.systemName, this.calendarId);
                    resolve();
                });
        });
    }
}