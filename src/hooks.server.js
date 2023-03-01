import { loadGTFS } from "$lib/server/gtfs/loader";
import { loadSSE } from "$lib/server/realtime/realtime";
import { CORS_ORIGIN } from "$env/static/private";


const gtfsLoaded = loadGTFS();
const sseLoaded = loadSSE();

export const handle = async ({event, resolve}) => {
    await gtfsLoaded;
    await sseLoaded;

    const response = await resolve(event);
    response.headers.append("Access-Control-Allow-Origin", CORS_ORIGIN);

    return response;
}