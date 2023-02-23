import { loadGTFS } from "./loader";
import { BaseModel } from "./models/baseModel";
import { Route } from "./models/route";
import { Shape } from "./models/shape";
import { Stop } from "./models/stop";
import { StopTime } from "./models/stoptimes";
import { Trip } from "./models/trip";

class GTFS {
    constructor() {
        this.trips = {};
        this.shapes = {};
        this.stopTimes = {};
        this.stops = {};
        this.routes = {};
    }

    build = async (trips, shapes, stopTimes, stops, routes) => {
        [this.trips, this.shapes, this.stopTimes, this.stops, this.routes] = await Promise.all([
            this.buildType(trips.getRows(), trips.getHeaders(), Trip),
            this.buildType(shapes.getRows(), shapes.getHeaders(), Shape),
            this.buildType(stopTimes.getRows(), stopTimes.getHeaders(), StopTime),
            this.buildType(stops.getRows(), stops.getHeaders(), Stop),
            this.buildType(routes.getRows(), routes.getHeaders(), Route)
        ]);
    }

    buildType = async (values, headers, type) => {
        const startTime = Date.now();
        if (type.mapper) {
            [values, headers] = type.mapper(values, headers);
        }

        let t = {};
        for (let v of values) {
            let index = BaseModel.getColumn(type.index(), headers, v);
            t[index] = new type(v, headers);
        }

        console.log(`Took ${Date.now() - startTime}ms to parse ${type.name}.`);
        return t;
    }
}

const gtfs = new GTFS();
export default gtfs;