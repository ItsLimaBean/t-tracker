import { get } from "svelte/store";
import { fetchBuses } from "$lib/server/realtime/fetchBuses";
import { buildBuses } from "$lib/server/realtime/busBuilder";
import { interval, buses } from "./store";


const BusCacheTime = 90; // use at least 120 for production

const clients = {};

const getEvent = (data) => {
    return `event: update\ndata: ${JSON.stringify(data)}\n\n`;
}

export const loadSSE = async () => {
    clearInterval(get(interval));
    interval.set(setInterval(updateBuses, BusCacheTime * 1000))
    await updateBuses();
}

export const addClient = (uuid, client) => {
    client.enqueue(getEvent(get(buses)));
    //console.log("added new client", uuid)
    clients[uuid] = client;
}

export const removeClient = (uuid) => {
    delete clients[uuid];
    //console.log("removed client", uuid);
}

export const updateBuses = async () => {
    const fetchedBuses = await fetchBuses();
    const builtBuses = await buildBuses(fetchedBuses)
    buses.set(builtBuses);
    for (const client of Object.values(clients)) {
        client.enqueue(getEvent(builtBuses));
    }
}