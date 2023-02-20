import { BaseModel } from "./baseModel";

export class Trip extends BaseModel {
    constructor(row, headers) {
        super(row, headers);
        this.routeId = this.get("route_id");
        this.tripId = this.get("trip_id");
        this.shapeId = this.get("shape_id");
    }

    static index = () => {
        return "trip_id";
    }

}