export const MapZoomTextThreshold = 14; // Threshold of when to allow text overlap
export const MapZoomIconSizeThreshold = 12; // Threshold of when to change to larger icons
export const MapZoomStopIconFullOpacity = 13; // The zoom level when a bus stop icon should be fully visible.
export const MapZoomStopIconShowText = 15; // The zoom level of when bus stop text should be visible.

export const emptyLineString = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "LineString",
        "coordinates": []
    }
};

export const emptyCollection = {
    "type": "FeatureCollection",
    "features": []
}

export const routeLayerStyle = {
    "id": "route",
    "type": "line",
    "source": "route",
    "layout": {
        "line-join": "round",
        "line-cap": "round",
    },
    "paint": {
        "line-color": ["get", "color"],
        "line-width": 4
    }
};

export const busesLayerStyle = {
    "id": "buses",
    "type": "symbol",
    "source": "buses",
    "layout": {
        "icon-allow-overlap": true,
        "icon-image": ["get", "marker"],
        "icon-size": ["step",
            ["zoom"],
            24/512,
            MapZoomIconSizeThreshold, 36/512
        ],
        "text-allow-overlap": ["step",
            ["zoom"],
            false,
            MapZoomTextThreshold, true
        ],
        "text-optional": true,
        "text-field": ["get", "text"],
        "text-offset": [0, 0.7],
        "text-size": 9.5,
        "text-justify": "center",
        "symbol-z-order": "viewport-y"
    },
    "paint": {
        "text-halo-color": "rgba(0, 0, 0, 1)",
        "text-halo-width": .3,
        "text-opacity": ["step", 
            ["zoom"],
            0.0,
            MapZoomIconSizeThreshold, 1.0
        ]
    }
};

export const routeStopsLayerStyle = {
    "id": "route_stops",
    "type": "symbol",
    "source": "route_stops",
    "layout": {
        "icon-allow-overlap": true,
        "icon-image": "bus_stop",
        "icon-size": 0.8,
        "text-optional": true,
        "text-allow-overlap": false,
        "text-field": ["get", "stopName"],
        "text-size": 9,
        "text-offset": [0, 2],
    },
    "paint": {
        "icon-opacity": ["interpolate", ["linear"], ["zoom"], MapZoomIconSizeThreshold, 0.0, MapZoomStopIconFullOpacity, 1.0],
        "text-opacity": ["step", ["zoom"], 0.0, MapZoomStopIconShowText, 1.0],
        "text-halo-color": "#ffffff",
        "text-halo-width": 1,
        "text-color": "hsl(215,83%,53%)"
    }
};

export const generateBuses = (buses) => {
    const geoJson = {
        "type": "FeatureCollection",
        "features": buses.map((value, i) => {
            return {
                "type": "Feature",
                "properties": {
                    "id": value.id,
                    "text": `${value.route}\n\n${value.model.displayId}`,
                    "shape": value.shape,
                    "marker": `bus_${value.icon}`,
                },
                "geometry": {
                    "type": "Point",
                    "coordinates": [
                        value.lng,
                        value.lat
                    ]
                }
            }
        })  
    };

    return geoJson;
}