import { StopTimeNotFoundError, TripNotFoundError } from "../../../../lib/errors";
import gtfs from "../../../../lib/gtfs/gtfsSingleton";

const buildtTripStopsFeature = async (id) => {
    if (gtfs.trips[id] === undefined) {
        throw new TripNotFoundError(id);
    }
    const stopTimes = gtfs.stopTimes[id];
    if (stopTimes === undefined) {
        throw new StopTimeNotFoundError(id);
    }

    return {
        "type": "FeatureCollection",
        "features": Object.values(stopTimes.times).map((value, i) => {
            const stop = gtfs.stops[value.stopId];
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


export const GET = async ({ params }) => {
    try {
        const tripStopFeatures = await buildtTripStopsFeature(params.slug);

        return new Response(JSON.stringify(tripStopFeatures), {
            headers: {
                "Content-Type": "application/JSON"
            }
        });
    } catch (err) {
        if (err instanceof TripNotFoundError || err instanceof StopTimeNotFoundError) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 400,
            });
        }

        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }

}