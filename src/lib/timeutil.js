import dateFormat from "dateformat"
export const getTimestamp = (time) => {
    let date = new Date();

    const hour = parseInt(time.split(":")[0])
    let greater = false;
    if (hour > 23) {
        greater = true;
        time = `${hour % 24}${time.slice(2)}`;
        date = new Date(date.getTime() + (24 * 60 * 60 * 1000));
    }

    const dateStr = dateFormat(date, "yyyy-mm-d");
    

    return new Date(`${dateStr} ${time}`).getTime();
}

export const getDateStr = (time) => {
    const dateStr = dateFormat(new Date(time * 1000), "yyyy-mm-d hh:MM:ss");
    return dateStr
}

export const getTimeFormat = (time) => {
    const dateStr = dateFormat(new Date(parseFloat(time) * 1000), "h:MM:ss TT");
    return dateStr
}

export const normalizeDistance = (system, distance) => {
    if (distance === undefined || distance === null || distance === "") return 0.0;
    distance = parseFloat(distance);
    return system !== "translink" ? distance / 1000 : distance;
};

export const getNumberDate = () => {
    const date = new Date();
    const dateStr = dateFormat(date, "yyyymmdd");
    return parseInt(dateStr);
} 