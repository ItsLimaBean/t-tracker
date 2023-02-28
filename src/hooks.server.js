import { gtfsLoaded } from "$lib/server/gtfs/loader"

export const handle = async ({event, resolve}) => {
    await gtfsLoaded();
    const response = await resolve(event);
    return response;
}