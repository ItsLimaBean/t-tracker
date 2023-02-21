import { BaseModel } from "./baseModel";

export class Shape extends BaseModel {
    constructor(row, headers) {
        super(row, headers);
        this.shapeId = this.get("shape_id");
        this.shape = this.get("shape");
        this.registered();
    }

    static index = () => {
        return "shape_id";
    }

    static mapper = (rows, headers) => {
        const newRows = [];
        const newHeaders = headers;
        const filteredRows = {};

        newHeaders.push("shape");

        for (let row of rows) {
            const shapeId = BaseModel.getColumn("shape_id", headers, row);
            if (!filteredRows[shapeId])
                filteredRows[shapeId] = { parsed: false, rows: [] }

            filteredRows[shapeId].rows.push(row);
        }

        for (let row of rows) {
            const shapeId = BaseModel.getColumn("shape_id", headers, row);
            
            if (!filteredRows[shapeId].parsed) {
                filteredRows[shapeId].parsed = true;
                
                const shapePositions = filteredRows[shapeId].rows;
                const positions = {};
                for (let pos of shapePositions) {
                    let seq = BaseModel.getColumn("shape_pt_sequence", headers, pos);
                    let lng = BaseModel.getColumn("shape_pt_lon", headers, pos);
                    let lat = BaseModel.getColumn("shape_pt_lat", headers, pos);
                    let dist = parseFloat(BaseModel.getColumn("shape_dist_traveled", headers, pos)) || 0;

                    positions[seq] = {pos: [parseFloat(lng), parseFloat(lat)], distance: dist };
                    
                }
                row.push(positions);
                newRows.push(row);
            }
        }

        return [newRows, newHeaders];
    }
}