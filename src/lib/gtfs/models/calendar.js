import { BaseModel } from "./baseModel";

export class Calendar extends BaseModel {

    static addData = async (rows, headers, system) => {
        const insert = await BaseModel.insertTransaction("service_dates", ["system_id", "start_date", "end_date"]);

        insert([
            [
                system,
                parseInt(BaseModel.getColumn("start_date", headers, rows[0 ])),
                parseInt(BaseModel.getColumn("end_date", headers, rows[0]))
            ]
        ]);
    }

    static selectCurrentCalendar = async (system, date) => {
        return await BaseModel.selectBasic("service_dates", ["id"], ["system_id = ?", "start_date <= ?", "end_date >= ?"], [system, date, date]);
    }
}