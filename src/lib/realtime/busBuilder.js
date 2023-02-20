import gtfs from "../gtfs/gtfsSingleton";
import { caclulateDelay } from "./delay";

export const buildBuses = async (apiBuses) => {
    let buses = [];
    for (const bus of apiBuses) {
        
        try {
            const delay = await caclulateDelay(bus.TripId.toString(), bus.VehicleNo, [bus.Longitude, bus.Latitude]);

            buses.push({
                dest: bus.Destination,
                dir: bus.Direction,
                lat: bus.Latitude,
                lng: bus.Longitude,
                trip: bus.TripId,
                updated: bus.RecordedTime,
                id: bus.VehicleNo,
                route: bus.RouteNo,
                shape: gtfs.trips[bus.TripId.toString()].shapeId || '279902',
                delay: delay
            });
        } catch (err) {
            console.log("Failed building bus " + bus.VehicleNo)
            console.error(err);
        }     

    }

    return buses;
}