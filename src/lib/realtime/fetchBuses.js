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

const formatBCTCFV = async (trips, positions) => {
    const tripData = trips.entity.reduce((acc, entity) => {
        if (!entity.tripUpdate.vehicle) {
            return acc;
        }
        const vehicleId = entity.tripUpdate.vehicle.id.slice(-4);

        acc[vehicleId] = entity.tripUpdate;
        return acc;
    }, []);

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

        const trip = tripData[vehicleId];
        
        let tripId;
        let route = "NIS";
        let dest = "NOT IN SERVICE";
        if (trip !== undefined && trip.trip !== undefined) {
            tripId = trip.trip.tripId;
            route = trip.trip.routeId.replace("-CFV", "");
            try {
                route = parseInt(route).toString().padStart(3, "0");
            } catch (e) {
            }
            dest = gtfs["bct/cfv"].trips[tripId].tripHeadsign;
        }

        const bus = {
            id: vehicleId,
            route: route,
            trip: tripId,
            dest: dest,//trip.trip.tripHeadsign,
            dir: undefined,//trip.trip.directionId,
            lat: vehicle.position.latitude,
            lng: vehicle.position.longitude,
            updated: getTimeFormat(vehicle.timestamp),
            system: "bct/cfv"
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

        const [tripsData, positionsData] = await Promise.all([
            fetch(`https://bct.tmix.se/gtfs-realtime/tripupdates.pb?operatorIds=13`, {
                headers: {
                    "content-type": "application/octet-stream"
                }
            }),
            fetch(`https://bct.tmix.se/gtfs-realtime/vehiclepositions.pb?operatorIds=13`, {
                headers: {
                    "content-type": "application/octet-stream"
                }
            })
        ]);
        const trips = gtfs.decode(new Uint8Array(await tripsData.arrayBuffer()));
        const positions = gtfs.decode(new Uint8Array(await positionsData.arrayBuffer()));
        
        return await formatBCTCFV(trips, positions);
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

    return translink.concat(bctcfv);
    
}