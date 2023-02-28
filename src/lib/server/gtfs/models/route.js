import { BaseModel } from "./baseModel";
import { DefaultColor } from "$lib/colors";

export class Route extends BaseModel {
    constructor(data, system) {
        super(system);
        this.routeId = data["route_id"];
        this.shortName = data["route_short_name"];
        this.routeName = data["route_long_name"];
        this.routeColor = this.getColor(data);

        this.registered();
    }

    getColor = (data) => {
        let obj = { color: data["route_color"], text: data["route_text_color"] };
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


    static addData = async (rows, headers, system, calendarId) => {
        const insert = await BaseModel.insertTransaction("routes", ["calendar_id", "route_id", "route_short_name", "route_long_name", "route_text_color", "route_color"]);

        insert(rows.map(row => {
            return [
                calendarId,
                BaseModel.getColumn("route_id", headers, row),
                BaseModel.getColumn("route_short_name", headers, row),
                BaseModel.getColumn("route_long_name", headers, row),
                BaseModel.getColumn("route_text_color", headers, row),
                BaseModel.getColumn("route_color", headers, row),

            ];
        }));
    }

    static getAllData = async (calendarId) => {
        return await BaseModel.selectBasic("routes", [
            "route_id",
            "route_short_name",
            "route_long_name",
            "route_text_color",
            "route_color"
        ], ["calendar_id = ?"], [calendarId])
    }

} 