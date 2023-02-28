import { get } from "svelte/store";
import { fetchBuses } from "$lib/server/realtime/fetchBuses";
import { buses, cacheTime, cacheLock } from "./cacheStore";

const BusCacheTime = 90; // use at least 120 for production

export const getBuses = async (timestamp) => {

    const currentTime = new Date().getTime() / 1000;
    if (currentTime - get(cacheTime) >= BusCacheTime && !get(cacheLock)) {
        cacheLock.set(true);
        const fetchedBuses = await fetchBuses();

        buses.set(fetchedBuses);
        cacheTime.set(currentTime);

        cacheLock.set(false);
        return [fetchedBuses, currentTime, "new"];
    }

    if (get(cacheTime) === timestamp) {
        return [[], timestamp, "up-to-date"];
    }

    return [get(buses), get(cacheTime), "cache"];
}