import { browser } from "$app/environment";
import { writable } from "svelte/store";

// i hate that this has to be a thing...
const handleBoolean = (key, defaultValue) => {
    const value = localStorage.getItem(key);
    if (!value) return defaultValue;

    return value === "true";
}

export const ShowBusPictureKey = "settings.showBusPicture";

export const ShowBusPicture = writable(browser && handleBoolean(ShowBusPictureKey, true));
ShowBusPicture.subscribe((value) => browser && localStorage.setItem(ShowBusPictureKey, value));