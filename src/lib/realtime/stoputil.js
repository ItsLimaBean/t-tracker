import gtfs from "../gtfs/gtfsSingleton"

export const findNextStopFromShape = async (tripId, shapeId, nextShapeSeq) => {
    const stopTimes = gtfs.stopTimes[tripId].times;
    const shape = gtfs.shapes[shapeId].shape;
    for (let i in stopTimes) {
        const stopTime = stopTimes[i];
        const timeDist = stopTime.distance;
        const nextDist = shape[nextShapeSeq].distance;
        if (nextDist <= timeDist) {
            return gtfs.stops[stopTime.stopId];
        }
    }
}