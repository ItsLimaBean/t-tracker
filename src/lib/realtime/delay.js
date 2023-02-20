import gtfs from "../gtfs/gtfsSingleton"
import { calcCrow, getLngLatCenter } from "../maputil";
import { getDateStr, getTimestamp } from "../timeutil";

// The minimum spacing between two shape points in KM
// to be included in shape time interpolation.
// NOTE: This fixes issuses where two route shape points
//       are placed on top of eachother, causing time
//       prediction to be wilding skewed.
const MinShapeSpacing = 0.050; // 50 meters

export const buildShapeTimes = async (tripId, busId, busPos) => {
    const shapeId = gtfs.trips[tripId].shapeId;

    const shape = gtfs.shapes[shapeId].shape;
    const stopTimes = gtfs.stopTimes[tripId].times;

    const shapeTimes = {};
    for (let i in stopTimes) {
        if (parseInt(i) + 1 > Object.keys(stopTimes).length) continue;
        
        const stopSeq = i;
        const nextSeq = (parseInt(stopSeq) + 1).toString();
        const fromTime = getTimestamp(stopTimes[stopSeq].departure);
        const endTime = getTimestamp(stopTimes[nextSeq].departure)

        let lastDist = -999999999999.0;
        for (let si in shape) {
            const shapeDist = shape[si].distance;
            if (shapeDist >= stopTimes[stopSeq].distance){
                if (shapeDist > stopTimes[nextSeq].distance) {
                    break;
                }
                
                if (shapeDist - lastDist < MinShapeSpacing) { continue };

                lastDist = shapeDist
                let timeoffset = (shapeDist - stopTimes[stopSeq].distance) / (stopTimes[nextSeq].distance - stopTimes[stopSeq].distance)
                timeoffset *= (endTime - fromTime);
                shapeTimes[si] = { departure_time: (fromTime + timeoffset), pos: shape[si].pos }
            } 
        }

    }

    return shapeTimes
}

export const getCenterPoints = async (shape) => {
    const centres = [];
    for (let i in shape) {
        const next = (parseInt(i)+1).toString();

        if (shape[next] === undefined) continue;
        centres.push({
            fromStop: shape[i].departure_time,
            nextStop: shape[next].departure_time,
            center: getLngLatCenter([shape[i].pos, shape[next].pos])
        });
    }

    return centres;
}

export const findCurrentStop = async (busPos, shapeTimes) => {
    let closestDist = 9999999999.9;
    let closestSeq;
    for (let seq of shapeTimes) {
        const dist = calcCrow(busPos, seq.center)
        if (dist < closestDist && seq.fromStop !== seq.nextStop) {
            closestDist = dist;
            closestSeq = seq;
        }
    }

    return closestSeq
}

export const caclulateDelay = async (tripId, busId, busPos) => {
    const shapeTimes = await buildShapeTimes(tripId, busId, busPos);

    const centers = await getCenterPoints(shapeTimes);


    const closestSeq = await findCurrentStop(busPos, centers);
    // get the closest center of two shape points,
    // we use center to more easily calculate the next and last stop.
    
    
    const now = new Date().getTime();

    const start = closestSeq.fromStop / 1000;
    const end = closestSeq.nextStop / 1000;

    const curtime = now / 1000;
    const shouldBe = (curtime - start) / (end - start);
    const rawDelay = curtime - (shouldBe + start);
    const delay = Math.round(((rawDelay / 60) * -1) * 10) / 10;

    return [delay, closestSeq.center];
    
}