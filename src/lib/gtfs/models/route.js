import { BaseModel } from "./baseModel";

export class Route extends BaseModel {
    constructor(row, headers) {
        super(row, headers);
        this.routeId = this.get("route_id");
        this.shortName = this.get("route_short_name");
        this.routeName = this.get("route_long_name");
        this.routeColor = this.getColor();

        this.registered();
    }

    getColor = () => {
        let obj = { color: this.get("route_color"), text: this.get("route_text_color") };
        if (obj.color === "" || obj.text === "") {
            obj = { color: "1463a7", text: "ffffff" }
        }

        obj.color = "#" + obj.color;
        obj.text = "#" + obj.text;

        return obj;
    }

    static index = () => {
        return "route_id";
    }

}