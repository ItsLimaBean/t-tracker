import gtfs from "../gtfs/gtfsSingleton"
import { calcCrow, getLngLatCenter } from "../maputil";
import { getDateStr, getTimestamp } from "../timeutil";

// The minimum spacing between two shape points in KM
// to be included in shape time interpolation.
// NOTE: This fixes issuses where two route shape points
//       are placed on top of eachother, causing time
//       prediction to be wilding skewed.
const MinShapeSpacing = 0.025; // 25 meters

export const buildShapeTimes = async (tripId) => {
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

                shapeTimes[si] = { departure_time: (fromTime + timeoffset), pos: shape[si].pos, shapeSeq: si };
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
            fromShape: shape[i],
            nextShape: shape[next],
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
        if (dist < closestDist) {
            closestDist = dist;
            closestSeq = seq;
        }
    }

    return closestSeq
}

export const caclulateDelay = async (closestSeq) => {
    const now = new Date().getTime();

    const start = closestSeq.fromShape.departure_time / 1000;
    const end = closestSeq.nextShape.departure_time / 1000;

    const curtime = now / 1000;
    const shouldBe = (curtime - start) / (end - start);
    const rawDelay = curtime - (shouldBe + start);
    const delay = Math.round(rawDelay * -1);

    return delay;
    
}