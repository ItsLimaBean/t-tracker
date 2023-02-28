import { ShapeNotFoundError, SystemNotFoundError } from "../../../../lib/errors";
import gtfs from "../../../../lib/gtfs/gtfsSingleton";

const buildShapeFeature = async (id, system) => {
    const systemGTFS = gtfs[system];

    if (systemGTFS.shapes[id] === undefined) {
        throw new ShapeNotFoundError(id);
    }

    const shape = systemGTFS.shapes[id].shape;

    
    const coordinates = [];
    for (let i in shape) {
        coordinates.push([shape[i].pos[0], shape[i].pos[1]])
    }

    return {
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "LineString",
            "coordinates": coordinates
        }
    }


}

export const GET = async ({ params, url }) => {
    try {
        const system = url.searchParams.get("sys");
        if (!gtfs[system]) throw new SystemNotFoundError(system);

        const shapeFeatures = await buildShapeFeature(params.slug, system);

        return new Response(JSON.stringify(shapeFeatures), {
            headers: {
                "Content-Type": "application/JSON"
            }
        });
    } catch (err) {
        if (err instanceof ShapeNotFoundError || err instanceof SystemNotFoundError) {
            return new Response(JSON.stringify({ error: err.message }), {
                status: 400,
            });
        }

        console.error(err);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    }

}