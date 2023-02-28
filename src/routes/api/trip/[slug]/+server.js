import { SystemNotFoundError, TripNotFoundError } from "$lib/server/errors";
import gtfs from "$lib/server/gtfs/gtfsSingleton";

const getTripInfo = async (id, system) => {
    const systemGTFS = gtfs[system];
    if (systemGTFS.trips[id] === undefined) {
        throw new TripNotFoundError(id);
    }
    const trip = systemGTFS.trips[id];
    const stopTimes = systemGTFS.stopTimes[id];
    const route = systemGTFS.routes[trip.routeId];
    return {
        headsign: trip.tripHeadsign,
        shortName: route.shortName,
        routeColor:  route.routeColor,
        stops : Object.values(stopTimes.times).map((stopTime, i) => {
            const stop = systemGTFS.stops[stopTime.stopId];
            return {
                name: stop.stopName,
                departureTime: stopTime.departure,
                stopSequence: Object.keys(stopTimes.times)[i],
            }
        })
    }
}

export const GET = async ({ params, url }) => {
    try {
        const system = url.searchParams.get("sys");
        if (!gtfs[system]) throw new SystemNotFoundError(system);

        const tripInfo = await getTripInfo(params.slug, system)

        return new Response(JSON.stringify(tripInfo), {
            headers: {
                "Content-Type": "application/JSON"
            }
        });
    } catch (err) {
        if (err instanceof SystemNotFoundError) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 400,
            });
        }

        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }
};