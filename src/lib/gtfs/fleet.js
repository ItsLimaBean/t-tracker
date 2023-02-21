
const Fleet = [
    //CMBC
    { "start_range": 3309, "end_range": 3358, "name": "2006 NFI C40LFR", "operator": "CMBC" },
    { "start_range": 7375, "end_range": 7399, "name": "2000 NFI D40LF", "operator": "CMBC" },
    { "start_range": 7401, "end_range": 7429, "name": "2000 NFI D40LF", "operator": "CMBC" },
    { "start_range": 7430, "end_range": 7446, "name": "2001 NFI D40LF", "operator": "CMBC" },
    { "start_range": 7447, "end_range": 7499, "name": "2006 NFI D40LFR", "operator": "CMBC" },
    { "start_range": 7501, "end_range": 7504, "name": "2006 NFI D40LFR", "operator": "CMBC" },
    { "start_range": 8102, "end_range": 8117, "name": "2007 NFI D60LFR", "operator": "CMBC" },
    { "start_range": 8118, "end_range": 8156, "name": "2009 NFI DE60LFR", "operator": "CMBC" },
    { "start_range": 9201, "end_range": 9276, "name": "2000-01 OBI Orion V (05.501)", "operator": "CMBC" },
    { "start_range": 9277, "end_range": 9285, "name": "2007-08 OBI Orion V (05.501)", "operator": "CMBC" },
    { "start_range": 9401, "end_range": 9499, "name": "2009 Nova Bus LFS HEV", "operator": "CMBC" },
    { "start_range": 9501, "end_range": 9542, "name": "2009 Nova Bus LFS HEV", "operator": "CMBC" },
    { "start_range": 9543, "end_range": 9581, "name": "2009 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 9583, "end_range": 9590, "name": "2009 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 9605, "end_range": 9699, "name": "2007 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 9701, "end_range": 9725, "name": "2007 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 9726, "end_range": 9791, "name": "2008 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 9797, "end_range": 9799, "name": "2008 Nova Bus LFS", "operator": "CMBC" },
    { "start_range": 12001, "end_range": 12025, "name": "2012-13 NFI XDE60", "operator": "CMBC" },
    { "start_range": 14001, "end_range": 14045, "name": "2014 NFI XN40", "operator": "CMBC" },
    { "start_range": 15001, "end_range": 15021, "name": "2015-16 NFI XDE60", "operator": "CMBC" },
    { "start_range": 16001, "end_range": 16051, "name": "2016-17 NFI XN40", "operator": "CMBC" },
    { "start_range": 16101, "end_range": 16130, "name": "2016 NFI XD40", "operator": "CMBC" },
    { "start_range": 16137, "end_range": 16137, "name": "2016 NFI XD40", "operator": "CMBC" },
    { "start_range": 16201, "end_range": 16226, "name": "2016-17 NFI XDE60", "operator": "CMBC" },
    { "start_range": 18001, "end_range": 18063, "name": "2018-19 NFI XDE60", "operator": "CMBC" },
    { "start_range": 18101, "end_range": 18206, "name": "2018 NFI XN40", "operator": "CMBC" },
    { "start_range": 18301, "end_range": 18404, "name": "2018 Nova Bus LFS HEV", "operator": "CMBC" },
    { "start_range": 18451, "end_range": 18473, "name": "2018 Nova Bus LFS Suburban", "operator": "CMBC" },
    { "start_range": 19001, "end_range": 19047, "name": "2019 NFI XDE60", "operator": "CMBC" },
    { "start_range": 19101, "end_range": 19147, "name": "2019 NFI XN40", "operator": "CMBC" },
    { "start_range": 19301, "end_range": 19302, "name": "2019 Nova Bus LFSe", "operator": "CMBC" },
    { "start_range": 19303, "end_range": 19304, "name": "2019 NFI XE40", "operator": "CMBC" },
    { "start_range": 19401, "end_range": 19432, "name": "2019 Alexander Dennis Enviro500", "operator": "CMBC" },
    { "start_range": 21001, "end_range": 21025, "name": "2021 NFI XDE60", "operator": "CMBC" },
    { "start_range": 21401, "end_range": 21425, "name": "2021 Alexander Dennis Enviro500", "operator": "CMBC" },
    { "start_range": 23201, "end_range": 23215, "name": "2022 Nova Bus LFSe+", "operator": "CMBC" },
    { "start_range": 2101, "end_range": 2199, "name": "2005-07 NFI E40LF", "operator": "CMBC" },
    { "start_range": 2201, "end_range": 2289, "name": "2005-07 NFI E40LF", "operator": "CMBC" },
    { "start_range": 2501, "end_range": 2540, "name": "2007-08 NFI E60LFR", "operator": "CMBC" },
    { "start_range": 2541, "end_range": 2574, "name": "2009 NFI E60LFR", "operator": "CMBC" },
    { "start_range": 16501, "end_range": 16562, "name": "2016 Girardin G5", "operator": "CMBC" },
    { "start_range": 17506, "end_range": 17564, "name": "2017 Girardin G5", "operator": "CMBC" },
    { "start_range": 18510, "end_range": 18527, "name": "2018 Girardin G5", "operator": "CMBC" },
    { "start_range": 19503, "end_range": 19535, "name": "2019-20 ARBOC SOM 28", "operator": "CMBC" },
    { "start_range": 19538, "end_range": 19549, "name": "2019-20 ARBOC SOM 28", "operator": "CMBC" },
    { "start_range": 19550, "end_range": 19554, "name": "2019 Girardin G5", "operator": "CMBC" },
    { "start_range": 21501, "end_range": 21562, "name": "2020-21 ARBOC SOF 27", "operator": "CMBC" },



    // Blue Bus

    { "start_range": 17501, "end_range": 17505, "name": "2017 ARBOC SOM 28", "operator": "Blue Bus" },
    { "start_range": 18501, "end_range": 18509, "name": "2018 ARBOC SOM 28", "operator": "Blue Bus" },
    { "start_range": 19501, "end_range": 19502, "name": "2019-20 ARBOC SOM 28", "operator": "Blue Bus" },
    { "start_range": 19536, "end_range": 19537, "name": "2019-20 ARBOC SOM 28", "operator": "Blue Bus" },
    { "start_range": 701, "end_range": 706, "name": "2007 Nova Bus LFS", "operator": "Blue Bus" },
    { "start_range": 901, "end_range": 909, "name": "2009 Nova Bus LFS", "operator": "Blue Bus" },
    { "start_range": 1201, "end_range": 1217, "name": "2012 NFI XD40", "operator": "Blue Bus" },
    { "start_range": 1601, "end_range": 1605, "name": "2016 NFI XD40", "operator": "Blue Bus" },
    { "start_range": 1606, "end_range": 1614, "name": "2016 NFI XD40", "operator": "Blue Bus" }


];

const LongTermWestVanTransfers = {
    16131: 1608,
    16132: 1613,
    16133: 1614,
    16134: 1610,
    16135: 1611,
    16136: 1612,
    16138: 1609,
    16139: 1606,
    16140: 1607,
}

export const getDisplayBusId = (busId) => {
    if (typeof busId !== "number") throw new TypeError("Type \"" + (typeof busId) + "\" !== \"number\"");


    if (LongTermWestVanTransfers[busId] !== undefined) {
        return LongTermWestVanTransfers[busId];
    }

    // for some reason the 2016 xd40 transfers are ultra random numbers.
    if (busId >= 16600 && busId <= 16699) {
        return busId - 15000;
    }
    if (busId >= 80000 && busId <= 89999) {
        return busId - 80000;
    }

    return busId;
}

export const getBusModelInfo = (busId) => {
    busId =  typeof busId === "string" ? parseInt(busId) : busId;
    
    const displayBusId = getDisplayBusId(busId);

    for (let vehicles of Fleet) {
        if (displayBusId >= vehicles.start_range && displayBusId <= vehicles.end_range) {
            return { name: vehicles.name, operator: vehicles.operator, displayId: displayBusId };
        }
    }

    console.log("Unknown bus id " + busId + " display id " + displayBusId);
    return { name: "Unknown Model", operator: "Unknown operator", displayId: displayBusId };
}

/**

// GET CMBC - https://cptdb.ca/wiki/index.php/Coast_Mountain_Bus_Company
clear()
let head = document.querySelectorAll(".sortable.jquery-tablesorter")

const bodyConventional = head[0].children[1]
const bodyTrolley = head[2].children[1]
const bodyShuttles  =head[4].children[1]

const bodies = [ bodyConventional, bodyTrolley, bodyShuttles ];

let fleet = [];
for (let body of bodies) {
    for (let node of body.children) {
        let range = node.children[0].firstChild.innerText;
        if (node.children[0].children.length > 1) range += "," + node.children[0].children[2].innerText;
        

        let year = node.children[2].innerText.replaceAll("–", "-");
        if (year.indexOf("-") >= 0) {
            year = year.slice(0, 5) + year.slice(7, 9)
        }
        let childindex = 0;
        if (node.children[3].children.length > 1) childindex = 2;
        let manuf = node.children[3].children[childindex].innerText;
        let model = node.children[4].children[childindex].innerText.replaceAll("\n", " ");
        let separate_ranges = range.replaceAll("–", "-").replace(", ", ",").replace(",\n", ",").replace("\n", ",").split(",")
        for (let r of separate_ranges) {
            if (r.includes("-")) {
                console.log(r)
                let rr = r.split("-");
                fleet.push({ start_range: parseInt(rr[0]), end_range: parseInt(rr[1]), name: `${year} ${manuf} ${model}`, operator: "CMBC" })
            } else {
                fleet.push({ start_range: parseInt(r), end_range: parseInt(r), name: `${year} ${manuf} ${model}`, operator: "CMBC" })
            }
        }
    }
}

console.log(fleet)


// GET BLUE BUS - https://cptdb.ca/wiki/index.php/West_Vancouver_Municipal_Transit
clear()
let head = document.querySelector(".sortable.jquery-tablesorter")

const body = head.children[1]

let fleet = [];
for (let node of body.children) {
    if (node.innerText === "Community Shuttles" || node.innerText === "Conventional Buses") continue;
    let range = node.children[0].firstChild.innerText;
    
    let year = node.children[2].innerText.replaceAll("–", "-");
    if (year.indexOf("-") >= 0) {
        year = year.slice(0, 5) + year.slice(7, 9)
    }
    let childindex = 0;
    if (node.children[3].children.length > 1) childindex = 2;
    let manuf = node.children[3].children[childindex].innerText;
    let model = node.children[4].children[childindex].innerText.replaceAll("\n", " ");
    let separate_ranges = range.replaceAll("–", "-").replace(", ", ",").replace(",\n", ",").replace("\n", ",").split(",")
    for (let r of separate_ranges) {
        if (r.includes("-")) {
            console.log(r)
            let rr = r.split("-");
            fleet.push({ start_range: parseInt(rr[0]), end_range: parseInt(rr[1]), name: `${year} ${manuf} ${model}`, operator: "Blue Bus" })
        } else {
            fleet.push({ start_range: parseInt(r), end_range: parseInt(r), name: `${year} ${manuf} ${model}`, operator: "Blue Bus" })
        }
    }
}


console.log(fleet)

 */