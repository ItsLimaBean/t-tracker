import { StopTimeNotFoundError, TripNotFoundError, SystemNotFoundError } from "../../../../lib/errors";
import gtfs from "../../../../lib/gtfs/gtfsSingleton";

const buildtTripStopsFeature = async (id, system) => {
    const systemGTFS = gtfs[system];
    if (systemGTFS.trips[id] === undefined) {
        throw new TripNotFoundError(id);
    }
    const stopTimes = systemGTFS.stopTimes[id];
    if (!stopTimes === undefined) {
        throw new StopTimeNotFoundError(id);
    }

    return {
        "type": "FeatureCollection",
        "features": Object.values(stopTimes.times).map((value, i) => {
            const stop = systemGTFS.stops[value.stopId];
            return {
                "type": "Feature",
                "properties": {
                    "stopName": stop.stopName
                },
                "geometry": {
                    "type": "Point",
                    "coordinates":stop.pos
                }
            }
        })
    }
}

export const GET = async ({ params, url }) => {
    try {
        const system = url.searchParams.get("sys");
        if (!gtfs[system]) throw new SystemNotFoundError(system);

        const tripStopFeatures = await buildtTripStopsFeature(params.slug, system);

        return new Response(JSON.stringify(tripStopFeatures), {
            headers: {
                "Content-Type": "application/JSON"
            }
        });
    } catch (err) {
        if (err instanceof TripNotFoundError || err instanceof StopTimeNotFoundError || err instanceof SystemNotFoundError) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 400,
            });
        }

        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }

}