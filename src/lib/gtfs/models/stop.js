import { BaseModel } from "./baseModel";

export class Stop extends BaseModel {
    constructor(row, headers, system) {
        super(row, headers, system);
        this.stopId = this.get("stop_id");
        this.stopCode = this.get("stop_code");
        this.stopName = this.get("stop_name");
        this.pos = [ parseFloat(this.get("stop_lon")), parseFloat(this.get("stop_lat")) ];
        this.registered();
    }

    static index = () => {
        return "stop_id";
    }

}