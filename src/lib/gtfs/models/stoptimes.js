import { BaseModel } from "./baseModel";

export class StopTime extends BaseModel {
    constructor(row, headers) {
        super(row, headers);
        this.tripId = this.get("trip_id");
        this.times = this.get("times");
    }

    static index = () => {
        return "trip_id";
    }

    static mapper = (rows, headers) => {
        const newRows = [];
        const newHeaders = headers;
        const filteredRows = {};

        newHeaders.push("times");

        for (let row of rows) {
            const tripId = BaseModel.getColumn("trip_id", headers, row);
            if (!filteredRows[tripId])
                filteredRows[tripId] = { parsed: false, rows: [] }

            filteredRows[tripId].rows.push(row);
        }

        for (let row of rows) {
            const tripId = BaseModel.getColumn("trip_id", headers, row);
            
            if (!filteredRows[tripId].parsed) {
                filteredRows[tripId].parsed = true;
                
                const stopTimes = filteredRows[tripId].rows;
                const filtered = {};
                for (let pos of stopTimes) {
                    let seq = BaseModel.getColumn("stop_sequence", headers, pos);
                    let departure = BaseModel.getColumn("departure_time", headers, pos);
                    let stopId = BaseModel.getColumn("stop_id", headers, pos);
                    let distance = parseFloat(BaseModel.getColumn("shape_dist_traveled", headers, pos)) || 0.0

                    filtered[seq] = {departure, stopId, distance}
                    
                }
                row.push(filtered);
                newRows.push(row);
            }
        }

        return [newRows, newHeaders];
    }
}