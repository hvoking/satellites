export const videoStyle: any = {
    "version": 8,
    "sources": {
        "video": {
            "type": "video",
            "urls": [ "ozone.mp4", "https://static-assets.mapbox.com/mapbox-gl-js/ozone2.mp4"],
            "coordinates": [
                [-180.0, 85.0511287798066],
                [180.0, 85.0511287798066],
                [180.0, -85.0511287798066],
                [-180.0, -85.0511287798066]
            ]
        },
        "mapbox-vector": {
            "type": "vector",
            "url": "mapbox://mapbox.mapbox-streets-v8"
        }
    },
    "layers": [
        {
            "id": "background",
            "type": "background",
            "paint": {
                "background-color": "rgb(4,7,14)"
            }
        }, 
        {
            "id": "video",
            "type": "raster",
            "source": "video"
        },
        {
            "id": "mapbox-vector",
            "type": "line",
            "source": "mapbox-vector",
            'source-layer': 'water',
            'layout': {
                'line-join': 'round',
                'line-cap': 'round'
            },
            'paint': {
                'line-color': '#FFFFFF',
                'line-width': 1
            }
        }
    ]
};