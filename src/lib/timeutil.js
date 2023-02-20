import dateFormat from "dateformat"
export const getTimestamp = (time) => {
    let date = new Date();

    const hour = parseInt(time.split(":")[0])
    if (hour > 23) {
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