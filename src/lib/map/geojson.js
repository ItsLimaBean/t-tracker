export const MapZoomTextThreshold = 14; // Threshold of when to allow text overlap
export const MapZoomIconSizeThreshold = 12; // Threshold of when to change to larger icons

export const emptyLineString = {
    "type": "Feature",
    "properties": {},
    "geometry": {
        "type": "LineString",
        "coordinates": []
    }
};

export const routeLayerStyle = {
    "id": "route",
    "type": "line",
    "source": "route",
    "layout": {
        "line-join": "round",
        "line-cap": "round",
    },
    "paint": {
        "line-color": "#3d51aa",
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

export const generateBuses = (buses) => {
    const geoJson = {
        "type": "FeatureCollection",
        "features": buses.map((value, i) => {
            return {
                "type": "Feature",
                "properties": {
                    "id": `${value.id}`,
                    "text": `${value.route}\n\n${value.model.displayId}`,
                    "shape": `${value.shape}`,
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