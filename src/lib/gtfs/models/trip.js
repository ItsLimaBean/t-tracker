import { BaseModel } from "./baseModel";

export class Trip extends BaseModel {
    constructor(row, headers, system) {
        super(row, headers, system);
        this.routeId = this.get("route_id");
        this.tripId = this.get("trip_id");
        this.shapeId = this.get("shape_id");
        this.tripHeadsign = this.get("trip_headsign");
        this.registered();
    }

    static index = () => {
        return "trip_id";
    }

}