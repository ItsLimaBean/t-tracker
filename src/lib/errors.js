export class ShapeNotFoundError extends Error {
    constructor(shapeId) {
        super("No shape id " + shapeId);
    }
}