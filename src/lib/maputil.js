// Converts numeric degrees to radians
const toRad = (Value) => {
    return Value * Math.PI / 180;
}

export const calcCrow = (lnglat1, lnglat2) => {
    const R = 6371;
    const dLat = toRad(lnglat2[1] - lnglat1[1]);
    const dLon = toRad(lnglat2[0] - lnglat1[0])
    const lat1 = toRad(lnglat1[1]);
    const lat2 = toRad(lnglat2[1]);

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const d = R * c;
    return d;
}


export const getLngLatCenter = (lngLatInDegr) => {
    function rad2degr(rad) { return rad * 180 / Math.PI; }
    function degr2rad(degr) { return degr * Math.PI / 180; }

    var LATIDX = 0;
    var LNGIDX = 1;
    var sumX = 0;
    var sumY = 0;
    var sumZ = 0;

    for (var i=0; i<lngLatInDegr.length; i++) {
        var lat = degr2rad(lngLatInDegr[i][1]);
        var lng = degr2rad(lngLatInDegr[i][0]);
        // sum of cartesian coordinates
        sumX += Math.cos(lat) * Math.cos(lng);
        sumY += Math.cos(lat) * Math.sin(lng);
        sumZ += Math.sin(lat);
    }

    var avgX = sumX / lngLatInDegr.length;
    var avgY = sumY / lngLatInDegr.length;
    var avgZ = sumZ / lngLatInDegr.length;

    // convert average x, y, z coordinate to latitude and longtitude
    var lng = Math.atan2(avgY, avgX);
    var hyp = Math.sqrt(avgX * avgX + avgY * avgY);
    var lat = Math.atan2(avgZ, hyp);

    return [rad2degr(lng), rad2degr(lat)];
}