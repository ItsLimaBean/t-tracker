export class ShapeNotFoundError extends Error {
    constructor(shapeId) {
        super("No shape id " + shapeId);
    }
}

export class TripNotFoundError extends Error {
    constructor(tripId) {
        super("No trip id " + tripId);
    }
}

export class StopTimeNotFoundError extends Error {
    constructor(tripId) {
        super("No stop time with trip id " + tripId);
    }
}

export class SystemNotFoundError extends Error {
    constructor(systemName) {
        super("No system id " + systemName);
    }
}