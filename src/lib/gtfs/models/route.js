import { BaseModel } from "./baseModel";
import { DefaultColor } from "../../colors";

export class Route extends BaseModel {
    constructor(row, headers, system) {
        super(row, headers, system);
        this.routeId = this.get("route_id");
        this.shortName = this.get("route_short_name");
        this.routeName = this.get("route_long_name");
        this.routeColor = this.getColor();

        this.registered();
    }

    getColor = () => {
        let obj = { color: this.get("route_color"), text: this.get("route_text_color") };
        if (obj.color === "" || obj.text === "") {
            // we do this copy* to prevent the default color from being modified
            const def = DefaultColor[this.system];
            obj = { color: def.color, text: def.text };
        }

        if (!obj.color.startsWith("#") && !obj.text.startsWith("#")) {
            obj.color = "#" + obj.color;
            obj.text = "#" + obj.text;
        }


        return obj;
    }

    static index = () => {
        return "route_id";
    }

} 