import gtfs from "$lib/server/gtfs/gtfsSingleton";
import { caclulateDelay, buildShapeTimes, getCenterPoints, findCurrentStop } from "./delay";
import { getBusModelInfo } from "$lib/server/gtfs/fleet";
import { findNextStopFromShape } from "./stoputil";
import { DefaultColor } from "$lib/colors";

export const getBusIcon = (delay) => {
    if (typeof delay !== "number" || Math.abs(delay) === Infinity) {
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
/*
            id: vehicleId,
            route: trip?.tripUpdate.trip.routeId.replace("-CFV", ""),
            trip: trip.trip.tripId,
            dest: "TODO- LATER",//trip.trip.tripHeadsign,
            dir: "EAST",//trip.trip.directionId,
            lat: vehicle.position.latitude,
            lng: vehicle.position.longitude,
            updated: getTimeFormat(vehicle.timestamp),
            system: "bct/cfv"
*/
export const buildBuses = async (apiBuses) => {
    let buses = [];
    for (const bus of apiBuses) {
        try {
            const busPos = [bus.lng, bus.lat];
            const busTrip = bus.trip?.toString();

            const systemGTFS = gtfs[bus.system];

            let route, delay, nextStop, busTripShape;

            if (busTrip) {
                const trip = systemGTFS.trips[busTrip];
                if (trip) {
                    route = systemGTFS.routes[trip.routeId];
    
                    busTripShape = trip.shapeId
        
                    const shapeTimes = await buildShapeTimes(systemGTFS, busTrip);
                    
                    const centers = await getCenterPoints(shapeTimes);
                    
                    const closestSeq = await findCurrentStop(busPos, centers);
    
                    delay = await caclulateDelay(closestSeq);
                    nextStop = await findNextStopFromShape(systemGTFS, busTrip, busTripShape, closestSeq.nextShape.shapeSeq);
                }
            }

            buses.push({
                dest: bus.dest,
                dir: Directions[bus.dir],
                lat: bus.lat,
                lng: bus.lng,
                trip: busTrip,
                updated: bus.updated,
                id: `${bus.system[0]}_${bus.id}`,
                route: bus.route,
                shape: busTripShape,
                delay: delay,
                icon: getBusIcon(delay),
                model: getBusModelInfo(bus.id, bus.system),
                nextStop: nextStop?.stopName,
                color: route?.routeColor || DefaultColor[bus.system],
                system: bus.system
            });
        } catch (err) {
            console.log("Failed building bus " + bus?.id)
            console.error(err);
        }     

    }

    return buses;
}