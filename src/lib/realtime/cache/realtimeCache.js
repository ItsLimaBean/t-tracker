import { get } from "svelte/store";
import { fetchBuses } from "../fetchBuses";
import { buses, cacheTime } from "./cacheStore";

const BusCacheTime = 90; // use at least 120 for production

export const getBuses = async (timestamp) => {

    const currentTime = new Date().getTime() / 1000;
    if (currentTime - get(cacheTime) >= BusCacheTime) {

        const fetchedBuses = await fetchBuses();

        buses.set(fetchedBuses);
        cacheTime.set(currentTime);

        return [fetchedBuses, currentTime, "new"]
    }

    if (get(cacheTime) === timestamp) {
        return [[], timestamp, "up-to-date"];
    }

    return [get(buses), get(cacheTime), "cache"];
}