import gtfs from "../gtfs/gtfsSingleton";
import { caclulateDelay, buildShapeTimes, getCenterPoints, findCurrentStop } from "./delay";
import { getBusModelInfo } from "../gtfs/fleet";
import { findNextStopFromShape } from "./stoputil";

export const getBusIcon = (delay) => {
    if (delay === null || delay === undefined) {
        return "unk";
    } else if (delay > 60.0) {
        return "early";
    } else if (delay >= -2 * 60) {
        return "ontime";
    } else if (delay >= -10 * 60) {
        return "late";
    } else {
        return "verylate";
    }
}

const Directions = {
    "NORTH": "Northbound",
    "EAST": "Eastbound",
    "SOUTH": "Southbound",
    "WEST": "Westbound"
}

export const buildBuses = async (apiBuses) => {
    let buses = [];
    let first = 0;
    for (const bus of apiBuses) {
        
        try {


            const busPos = [bus.Longitude, bus.Latitude];
            const busTrip = bus.TripId.toString();
            const busTripShape = gtfs.trips[busTrip].shapeId

            const shapeTimes = await buildShapeTimes(busTrip);
            const centers = await getCenterPoints(shapeTimes);
            
            const closestSeq = await findCurrentStop(busPos, centers);
            const delay = await caclulateDelay(closestSeq);
            const nextStop = await findNextStopFromShape(busTrip, busTripShape, closestSeq.nextShape.shapeSeq);

            buses.push({
                dest: bus.Destination,
                dir: Directions[bus.Direction],
                lat: bus.Latitude,
                lng: bus.Longitude,
                trip: busTrip,
                updated: bus.RecordedTime,
                id: bus.VehicleNo,
                route: bus.RouteNo,
                shape: busTripShape,
                delay: delay,
                icon: getBusIcon(delay),
                model: getBusModelInfo(bus.VehicleNo),
                nextStop: nextStop?.stopName,
                
            });
        } catch (err) {
            console.log("Failed building bus " + bus.VehicleNo)
            console.error(err);
        }     

    }

    return buses;
}