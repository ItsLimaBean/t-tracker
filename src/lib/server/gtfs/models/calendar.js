import { BaseModel } from "./baseModel";
import { getNumberDate  } from "$lib/timeutil";

export class Calendar extends BaseModel {

    static addData = async (rows, headers, system) => {
        const insert = await BaseModel.insertTransaction("service_dates", ["system_id", "start_date", "end_date"]);

        const numberDate = getNumberDate();

        let startRow = rows[0];
        let endRow = rows[0];

        // This is needed since bctransit updates their static data once a week
        // unlike translink who does it every couple of months
        if (system !== "translink") {

            for (let i = 0; i < rows.length; i++) {
                const row = rows[i];
                if (numberDate >= parseInt(BaseModel.getColumn("start_date", headers, row))) {
                    endRow = row;
                }
                if (numberDate <= parseInt(BaseModel.getColumn("end_date", headers, row))) {
                    startRow = row;
                }
            }
        }
        insert([
            [
                system,
                parseInt(BaseModel.getColumn("start_date", headers, rows[0])),
                parseInt(BaseModel.getColumn("end_date", headers, rows[0]))
            ]
        ]);
    }

    static selectCurrentCalendar = async (system, date) => {
        return await BaseModel.selectBasic("service_dates", ["id"], ["system_id = ?", "start_date <= ?", "end_date >= ?"], [system, date, date]);
    }
}