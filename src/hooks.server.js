import { loadGTFS } from "$lib/server/gtfs/loader";
import { loadSSE } from "$lib/server/realtime/realtime";
import { PUBLIC_SITE_ORIGIN } from "$env/static/public";


const gtfsLoaded = loadGTFS();
const sseLoaded = loadSSE(gtfsLoaded);

export const handle = async ({event, resolve}) => {
    await gtfsLoaded;
    await sseLoaded;

    const response = await resolve(event);
    response.headers.append("Access-Control-Allow-Origin", PUBLIC_SITE_ORIGIN);

    return response;
}