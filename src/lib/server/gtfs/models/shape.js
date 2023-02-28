import { database } from "$lib/server/database/singleton";
import { normalizeDistance } from "$lib/timeutil";
import { BaseModel } from "./baseModel";

export class Shape extends BaseModel {
    constructor(data, system) {
        super(system);
        this.shapeId = data["shape_id"];
        this.shape = JSON.parse(data["shape"]);
        this.registered();
    }

    static index = () => {
        return "shape_id";
    }

    static addData = async (rows, headers, system, calendarId) => {
        const insert = await BaseModel.insertTransaction("shapes", ["calendar_id", "shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence", "shape_dist_traveled"]);

        insert(rows.map(row => {
            return [
                calendarId,
                BaseModel.getColumn("shape_id", headers, row),
                parseFloat(BaseModel.getColumn("shape_pt_lat", headers, row)),
                parseFloat(BaseModel.getColumn("shape_pt_lon", headers, row)),
                BaseModel.getColumn("shape_pt_sequence", headers, row),
                normalizeDistance(system, parseFloat(BaseModel.getColumn("shape_dist_traveled", headers, row)))
            ]
        }));
    }

    static getAllData = async (calendarId) => {
        const db = database.get();

        return db.prepare(`
            SELECT
            shape_id,
            json_group_object(shape_pt_sequence,
                json_object(
                        'pos', json_array(shape_pt_lon, shape_pt_lat),
                        'distance',shape_dist_traveled)
                ) as shape
            FROM (
                SELECT shape_id, shape_pt_lon, shape_pt_lat, shape_dist_traveled, shape_pt_sequence 
                FROM shapes 
                WHERE calendar_id = ?
                ORDER BY
                    shape_pt_sequence ASC,
                    shape_id ASC
            )
            GROUP BY shape_id
        `).all(calendarId);
    }

}