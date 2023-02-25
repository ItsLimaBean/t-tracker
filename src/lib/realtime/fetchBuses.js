import { TRANSLINK_API_KEY } from "$env/static/private";
import gtfs from "../gtfs/gtfsSingleton";
import { getTimeFormat } from "../timeutil";

const formatTranslink = async (data) => {
    return data.map((bus) => {
        return {
            id: bus.VehicleNo,
            route: bus.RouteNo,
            trip: bus.TripId,
            dest: bus.Destination,
            dir: bus.Direction,
            lat: bus.Latitude,
            lng: bus.Longitude,
            updated: bus.RecordedTime,
            system: "translink"
        };
    });
};

const formatBCTCFV = async (positions) => {
    const positionData = positions.entity.reduce((acc, entity) => {
        if (!entity.vehicle) {
            return acc;
        }
        
        const vehicleId = entity.vehicle.vehicle.id.slice(-4);
        acc[vehicleId] = entity.vehicle;
        return acc;
    }, []);

    const buses = [];
    for (const vehicleId in positionData) {
        const vehicle = positionData[vehicleId];

        if (!vehicle.position) { continue; }

        const trip = vehicle.trip;
        
        let tripId;
        let route = "UNK";
        let dest = "Unknown";

        if (trip) {
            tripId = trip.tripId;
            if (gtfs["bct/cfv"].trips[tripId]) {
                route = trip.routeId.replace("-CFV", "");
                route = parseInt(route).toString().padStart(3, "0");
    
                dest = gtfs["bct/cfv"].trips[tripId].tripHeadsign;
            }
            
            route = trip.routeId.replace("-CFV", "");

            dest = gtfs["bct/cfv"].routes[trip.routeId].routeName;
        } else {
            dest = "NOT IN SERVICE"
            route = "NIS";
        }

        const bus = {
            id: vehicleId,
            route: route,
            trip: tripId,
            dest: dest,
            dir: undefined,
            lat: vehicle.position.latitude,
            lng: vehicle.position.longitude,
            updated: getTimeFormat(vehicle.timestamp),
            system: "bct/cfv",
            stopSeq: vehicle.currentStopSequence.toString(),
        };

        buses.push(bus);

    }
    return buses;
}

const fetchTranslinkBuses = async () => {
    try {
        const fetchData = await fetch(`https://api.translink.ca/rttiapi/v1/buses?apikey=${TRANSLINK_API_KEY}`, {
            headers: {
                "content-type": "application/json",
                "accept": "application/json"
            }
        });

        if (fetchData.status === 500) {
            throw new Error(await fetchData.text())
        }

        if (fetchData.status !== 200 ) {
            throw new Error("Failed to fetch buses. Status Code: " + fetchData.status);
        }

        return await formatTranslink(await fetchData.json());
    } catch (err) {
        console.log("fetchBuses Failure. ")
        console.log(err);
        return [];
    }

}

const fetchBCTCFVBuses = async () => {
    try {

        const fetchData = await fetch(`https://bct.tmix.se/gtfs-realtime/vehiclepositions.pb?operatorIds=13`, {
            headers: {
                "content-type": "application/octet-stream"
            }
        });

        const positions = gtfs.decode(new Uint8Array(await fetchData.arrayBuffer()));
        
        return await formatBCTCFV(positions);
    } catch (err) {
        console.error(err);
    
    }
}

export const fetchBuses = async () => {
    const [translink, bctcfv] = await Promise.all([
        fetchTranslinkBuses(),
        fetchBCTCFVBuses()
    ]);

    //console.log(bctcfv);

    // This is not a good solution but it works for now
    if (!bctcfv) {
        return translink;
    } else {
        return translink.concat(bctcfv);
    }
}