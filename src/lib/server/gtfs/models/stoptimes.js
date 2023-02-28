import { normalizeDistance } from "$lib/timeutil";
import { BaseModel } from "./baseModel";
import { database } from "$lib/server/database/singleton";

export class StopTime extends BaseModel {
    constructor(data, system) {
        super(system);
        this.tripId = data["trip_id"];
        this.times = JSON.parse(data["times"]);
        this.registered();
    }

    static index = () => {
        return "trip_id";
    }

    static addData = async (rows, headers, system, calendarId) => {
        const insert = await BaseModel.insertTransaction("stop_times", ["calendar_id", "trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence", "shape_dist_traveled"]);
        
        insert(rows.map(row => {
            return [
                calendarId,
                BaseModel.getColumn("trip_id", headers, row),
                BaseModel.getColumn("arrival_time", headers, row),
                BaseModel.getColumn("departure_time", headers, row),
                BaseModel.getColumn("stop_id", headers, row),
                BaseModel.getColumn("stop_sequence", headers, row),
                normalizeDistance(system, BaseModel.getColumn("shape_dist_traveled", headers, row))
            ]
        }));
    }

    static getAllData = async (calendarId) => {
        const db = database.get();

        return db.prepare(`
            SELECT
            trip_id,
            json_group_object(stop_sequence,
                json_object(
                        'departure', departure_time,
                        'stopId', stop_id,
                        'distance', shape_dist_traveled
                )) as times
            FROM (
                SELECT trip_id, departure_time, stop_id, shape_dist_traveled, stop_sequence 
                FROM stop_times 
                WHERE calendar_id = ?
                ORDER BY
                    stop_sequence ASC,
                    trip_id ASC
            )
            GROUP BY trip_id
        `).all(calendarId);
    }
}