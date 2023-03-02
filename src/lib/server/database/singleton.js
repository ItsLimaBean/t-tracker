import Database from "better-sqlite3";

class ArchiveDatabase {
    constructor() {
        this.db = new Database("database.db"/*, { verbose: (msg ) => {
            // there's a lot of these, don't log them
            if (msg.startsWith("INSERT INTO stop_times (calendar_id, trip_id, arrival_time, departure_time, stop_id, stop_sequence, shape_dist_traveled) VALUES")) {
                return;
            }
            console.log(msg);
            }
        }*/);
    }
    
    init() {
        this.db.exec("CREATE TABLE IF NOT EXISTS service_dates (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, system_id VARCHAR(32),  start_date INTEGER NOT NULL, end_date INTEGER NOT NULL)");
        this.db.exec(`CREATE TABLE IF NOT EXISTS shapes (
            calendar_id INTEGER NOT NULL, 
            shape_id INTEGER NOT NULL,
            shape_pt_lat REAL NOT NULL,
            shape_pt_lon REAL NOT NULL,
            shape_pt_sequence INTEGER NOT NULL,
            shape_dist_traveled REAL NOT NULL,
            PRIMARY KEY(calendar_id, shape_id, shape_pt_sequence),
            FOREIGN KEY (calendar_id) REFERENCES service_dates(id)
        )`);
        
        this.db.exec(`CREATE TABLE IF NOT EXISTS routes (
            calendar_id INTEGER NOT NULL,
            route_id VARCHAR(32) NOT NULL,
            route_short_name VARCHAR(32) NOT NULL,
            route_long_name VARCHAR(32) NOT NULL,
            route_text_color VARCHAR(8),
            route_color VARCHAR(8),
            PRIMARY KEY(calendar_id, route_id),
            FOREIGN KEY (calendar_id) REFERENCES service_dates(id)
        )`);
        
        this.db.exec(`CREATE TABLE IF NOT EXISTS trips (
            calendar_id INTEGER NOT NULL, 
            trip_id VARCHAR(32) NOT NULL,
            trip_headsign VARCHAR(128) NOT NULL,
            route_id VARCHAR(32) NOT NULL,
            service_id VARCHAR(32) NOT NULL,
            shape_id VARCHAR(32) NOT NULL,
            block_id VARCHART(32) NOT NULL,
            PRIMARY KEY(calendar_id, trip_id),
            FOREIGN KEY (calendar_id, route_id) REFERENCES routes(calendar_id, route_id)
        )`);

        this.db.exec(`CREATE TABLE IF NOT EXISTS stops (
            calendar_id INTEGER NOT NULL,
            stop_id VARCHAR(32) NOT NULL,
            stop_code VARCHAR(32) NOT NULL,
            stop_name VARCHAR(32) NOT NULL,
            stop_lat REAL NOT NULL,
            stop_lon REAL NOT NULL,
            PRIMARY KEY(calendar_id, stop_id),
            FOREIGN KEY (calendar_id) REFERENCES service_dates(id)
        )`);

        this.db.exec(`CREATE TABLE IF NOT EXISTS stop_times (
            id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
            calendar_id INTEGER NOT NULL,
            trip_id INTEGER NOT NULL,
            arrival_time INTEGER NOT NULL,
            departure_time INTEGER NOT NULL,
            stop_id VARCHAR(32) NOT NULL,
            stop_sequence INTEGER NOT NULL,
            shape_dist_traveled REAL NOT NULL,
            FOREIGN KEY (calendar_id) REFERENCES service_dates(id),
            FOREIGN KEY (calendar_id, trip_id) REFERENCES trips(calendar_id, trip_id),
            FOREIGN KEY (calendar_id, stop_id) REFERENCES stops(calendar_id, stop_id)
        )`);
    }

    get() {
        return this.db;
    }
}

export const database = new ArchiveDatabase();