import { BaseModel } from "./baseModel";

export class Trip extends BaseModel {
    constructor(data, system) {
        super(system);
        this.routeId = data["route_id"];
        this.tripId = data["trip_id"];
        this.shapeId = data["shape_id"];
        this.tripHeadsign = data["trip_headsign"];
        this.registered();
    }

    static index = () => {
        return "trip_id";
    }


    static addData = async (rows, headers, system, calendarId) => {
        const insert = await BaseModel.insertTransaction("trips", ["calendar_id", "route_id", "trip_id", "shape_id", "trip_headsign", "service_id"]);
        insert(rows.map(row => {
            return [
                calendarId,
                BaseModel.getColumn("route_id", headers, row),
                BaseModel.getColumn("trip_id", headers, row),
                BaseModel.getColumn("shape_id", headers, row),
                BaseModel.getColumn("trip_headsign", headers, row),
                BaseModel.getColumn("service_id", headers, row)
            ]
        }));
    }

    static getAllData = async (calendarId) => {
        const time = new Date();
        
        return await BaseModel.selectBasic("trips", [
            "route_id",
            "trip_id",
            "shape_id",
            "trip_headsign",
            "service_id"
        ], ["calendar_id = ?"], calendarId);
    }
}