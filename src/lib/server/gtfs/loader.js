import JSZip from "jszip";
import gtfs from "./gtfsSingleton";
import { GTFSFile } from "./gtfsFile";
import { Shape } from "./models/shape";
import { Trip } from "./models/trip";
import { StopTime } from "./models/stoptimes";
import { Stop } from "./models/stop";
import { Route } from "./models/route";
import protobuf from "protobufjs";

import { database } from "$lib/server/database/singleton";
import { Calendar } from "./models/calendar";
import { getNumberDate } from "$lib/timeutil";


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


const gtfsFilesToLoad = [
    { file: "trips", type: Trip },
    { file: "shapes", type: Shape },
    { file: "stop_times", type: StopTime },
    { file: "stops", type: Stop },
    { file: "routes", type: Route }
];

export const loadSystemGTFS = async (systemName) => {

    const currentDate = getNumberDate();

    let zipObj;    
    let serviceDates = await Calendar.selectCurrentCalendar(systemName, currentDate);
    let calendarId = serviceDates?.[0]?.id;
    if (serviceDates.length === 0) {
        console.log(`[${systemName}] No service dates found in database, downloading GTFS data...`);
        
        zipObj = await downloadGTFS(systemName);

        console.log(`[${systemName}] Downloaded GTFS data!`);

        const calendar = new GTFSFile(zipObj.files["calendar.txt"].nodeStream(), Calendar, systemName);
        await calendar.fromCsv();

        serviceDates = await Calendar.selectCurrentCalendar(systemName, currentDate);
        if (serviceDates.length === 0) {
            console.log(`[${systemName}] No usable server dates, skipping...`);
            return;
        }
        calendarId = serviceDates[0].id;

        for (const gtfsEntry of gtfsFilesToLoad) {
            const gtfsFile = new GTFSFile(zipObj.files[gtfsEntry.file + ".txt"].nodeStream(), gtfsEntry.type, systemName, calendarId);
            await gtfsFile.fromCsv();
        }
    }


    const buildData = await Promise.all(gtfsFilesToLoad.map(async (gtfsEntry) => {
        const time = new Date();

        const output = {};
        const allData = await gtfsEntry.type.getAllData(calendarId)
        for (const data of allData) {
            const obj = new gtfsEntry.type(data, systemName)
            output[data[gtfsEntry.type.index()]] = obj;
        }
        
        console.log(`[${systemName}] Loaded ${gtfsEntry.file} in ${new Date() - time}ms`);
        return output;
    }));

    buildData.unshift(systemName);
    gtfs.build.apply(gtfs, buildData);

    console.log(`[${systemName}] Finished loading GTFS data!`);
}

export const loadGTFS = async () => {
    initState = 1;

    database.init();


    const protoRoot = await protobuf.load(`gtfs-realtime.proto`);
    
    gtfs.feedMessage = protoRoot.lookupType("transit_realtime.FeedMessage");

    await Promise.all([
        loadSystemGTFS("translink"),
        loadSystemGTFS("bct/cfv")
    ]);

    initState = 2;

    return true;
}