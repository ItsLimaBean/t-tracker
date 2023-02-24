import JSZip from "jszip";
import gtfs from "./gtfsSingleton";
import { GTFSFile } from "./gtfsFile";
import { Shape } from "./models/shape";
import { Trip } from "./models/trip";
import { StopTime } from "./models/stoptimes";
import { Stop } from "./models/stop";
import { Route } from "./models/route";
import protobuf from "protobufjs";

import fs from "fs";

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

export const downloadGTFS = async (systemName) => {
    const systemUrls = { 
        "translink": "https://tlebtsprd01startti.blob.core.windows.net/gtfs/google_transit.zip",
        "bct/cfv": "https://bct.tmix.se/Tmix.Cap.TdExport.WebApi/gtfs/?operatorIds=13"
    }

    const url = systemUrls[systemName];

    let data;
    try {
        const response = await fetch(url, {
            headers: {
                "content-type": "application/octet-stream"
            }
        });

        data = response.arrayBuffer();

    } catch (err) {
        console.log(err, "could not download gtfs for system " + systemName);
    }

    if (data) {
        return unzipGTFS(data);
    }
}


export const loadSystemGTFS = async (systemName) => {
    console.log(`[${systemName}] Downloading GTFS data...`);


    const zipObj = await downloadGTFS(systemName);

    console.log(`[${systemName}] Downloaded GTFS data!`);

    console.log(`[${systemName}] Unpacking GTFS data...`);

    const trips = new GTFSFile(zipObj.files["trips.txt"].nodeStream(), Trip, systemName);    
    const shapes = new GTFSFile(zipObj.files["shapes.txt"].nodeStream(), Shape, systemName);
    const stopTimes = new GTFSFile(zipObj.files["stop_times.txt"].nodeStream(), StopTime, systemName);
    const stops = new GTFSFile(zipObj.files["stops.txt"].nodeStream(), Stop, systemName);
    const routes = new GTFSFile(zipObj.files["routes.txt"].nodeStream(), Route, systemName);


    // The order of this array is important, it needs to match the order of the arguments in the gtfs.build function
    const builtData = await Promise.all([
        trips.fromCsv(),
        shapes.fromCsv(),
        stopTimes.fromCsv(),
        stops.fromCsv(),
        routes.fromCsv()
    ]);
    
    builtData.unshift(systemName);

    gtfs.build.apply(gtfs, builtData);
    console.log(`[${systemName}] Unpacked GTFS data!`);

    console.log(`[${systemName}] Ready!`);
}

export const loadGTFS = async () => {
    initState = 1;

    const currentDir = new URL('.', import.meta.url).pathname;
    const protoRoot = await protobuf.load(`${currentDir}gtfs-realtime.proto`);
    
    gtfs.feedMessage = protoRoot.lookupType("transit_realtime.FeedMessage");

    await Promise.all([
        loadSystemGTFS("translink"),
        loadSystemGTFS("bct/cfv")
    ]);

    initState = 2;

    return true;
}