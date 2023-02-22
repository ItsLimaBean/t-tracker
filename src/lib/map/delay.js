export const formatDelayTime = (delay) => {
    if (delay === undefined || delay === null) return "Unknown.";

    let displayText = [];
    let endText = "behind";
    if (delay > 0) {
        endText = "ahead"
    } else if (delay === 0) {
        return "On time";
    }

    delay = Math.abs(delay);
    const hours = Math.floor((delay / 60) / 60);
    const minutes = Math.floor(delay / 60) % 60;
    const seconds = Math.floor(delay) % 60;

    if (hours > 0) displayText.push(`${hours}h`);
    if (minutes > 0) displayText.push(`${minutes}m`);
    if (seconds > 0) displayText.push(`${seconds}s`);
    displayText.push(endText);

    return displayText.join(" ");
}