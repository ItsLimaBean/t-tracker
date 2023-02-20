import JSZip from "jszip";
import gtfs from "./gtfsSingleton";
import { GTFSFile } from "./gtfsFile";
import { Shape } from "./models/shape";
import { Trip } from "./models/trip";
import { StopTime } from "./models/stoptimes";

let initState = 0;
let statePromise;

export const gtfsLoaded = async () => {
    if (initState === 0) {
        statePromise = loadGTFS();
    }
    return statePromise;
};

export const unzipGTFS = async (data) => {
    const zip = new JSZip();

    const zipData = await zip.loadAsync(data);

    return zipData;
}

export const downloadGTFS = async () => {
    const url = "https://tlebtsprd01startti.blob.core.windows.net/gtfs/google_transit.zip";

    let data;
    try {
        const response = await fetch(url, {
            headers: {
                "content-type": "application/octet-stream"
            }
        });

        data = response.arrayBuffer();

    } catch (err) {
        console.log(err, "could not download gtfs");
    }

    if (data) {
        return unzipGTFS(data);
    }
}

export const loadGTFS = async () => {
    initState = 1;

    console.log("Downloading GTFS data...");

    const zipObj = await downloadGTFS();

    console.log("Downloaded GTFS data!");

    console.log("Unpacking GTFS data...");

    const trips = new GTFSFile(zipObj.files["trips.txt"].nodeStream(), Trip);    
    const shapes = new GTFSFile(zipObj.files["shapes.txt"].nodeStream(), Shape);
    const stopTimes = new GTFSFile(zipObj.files["stop_times.txt"].nodeStream(), StopTime)

    await Promise.all([
        trips.fromCsv(),
        shapes.fromCsv(),
        stopTimes.fromCsv(),
    ])
    
    await gtfs.build(trips, shapes, stopTimes);
    console.log("Unpacked GTFS data!");

    console.log("Ready!");

    initState = 2;

    return true;
}