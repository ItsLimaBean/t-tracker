import { BaseModel } from "./baseModel";

export class Stop extends BaseModel {
    constructor(data, system) {
        super(system);
        this.stopId = data["stop_id"];
        this.stopCode = data["stop_code"];
        this.stopName = data["stop_name"];
        this.pos = [ parseFloat(data["stop_lon"]), parseFloat(data["stop_lat"]) ];
        this.registered();
    }

    static index = () => {
        return "stop_id";
    }

    static addData = async (rows, headers, system, calendarId) => {
        const insert = await BaseModel.insertTransaction("stops", ["calendar_id", "stop_id", "stop_code", "stop_name", "stop_lat", "stop_lon"]);
        insert(rows.map(row => {
            return [
                calendarId,
                BaseModel.getColumn("stop_id", headers, row),
                BaseModel.getColumn("stop_code", headers, row),
                BaseModel.getColumn("stop_name", headers, row),
                BaseModel.getColumn("stop_lat", headers, row),
                BaseModel.getColumn("stop_lon", headers, row)
            ]
        }));
    }

    static getAllData = async (calendarId) => {
        return await BaseModel.selectBasic("stops", [
            "stop_id",
            "stop_code",
            "stop_name",
            "stop_lat",
            "stop_lon"
        ], ["calendar_id = ?"], calendarId);
    }
}