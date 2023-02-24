class GTFS {
    constructor() {
        this.trips = {};
        this.shapes = {};
        this.stopTimes = {};
        this.stops = {};
        this.routes = {};
    }

    build = (trips, shapes, stopTimes, stops, routes) => {
        this.trips = trips;
        this.shapes = shapes;
        this.stopTimes = stopTimes;
        this.stops = stops;
        this.routes = routes;
    }

}

const gtfs = new GTFS();
export default gtfs;