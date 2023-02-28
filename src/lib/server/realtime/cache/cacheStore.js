import { writable } from "svelte/store"
export const buses = writable([]);
export const cacheTime = writable(1);
export const cacheLock = writable(false);