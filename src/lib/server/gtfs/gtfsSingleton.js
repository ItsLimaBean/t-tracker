class GTFS {
    constructor() {
        this.trips = {};
        this.shapes = {};
        this.stopTimes = {};
        this.stops = {};
        this.routes = {};
    }
    build = (system, shapes, routes, trips, stops, stopTimes) => {
        this[system] = {
            trips, shapes, stopTimes, stops, routes
        }
    }

    decode = (encoded) => {
        return this.feedMessage.decode(encoded);
    }

}

const gtfs = new GTFS();
export default gtfs;