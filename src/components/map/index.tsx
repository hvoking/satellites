// React imports  
import { useState, useCallback } from 'react';

// App imports
import { Pin } from './pin';

// Context imports
import { useGeo } from 'context/geo';
import { useSatellitesLayer } from 'context/layers/satellites';
import { useWrapperLayer } from 'context/layers/wrapper';

// Third-party imports
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const MapContainer = () => {
    const { mapRef, setViewport, viewport, Locations, isInitialState, setIsInitialState } = useGeo();
    const { satellitesLayer } = useSatellitesLayer();
    const { wrapperLayer } = useWrapperLayer();

    const [ isMapLoaded, setIsMapLoaded ] = useState(false);

    const onClick = useCallback((event: any) => {
        const { lng, lat } = event.lngLat;
        setViewport({ ...viewport, longitude: lng, latitude: lat });
        setIsInitialState(false);
    }, []);

    const onLoad = () => {
        setIsMapLoaded(true);
        const map = mapRef.current.getMap();
        map.addLayer(satellitesLayer);
        map.addLayer(wrapperLayer);
    }

    return (
        <Map
            ref={mapRef}
            initialViewState={Locations.other}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={"mapbox://styles/hvoking/cm1h7n1kp01ed01pd24g689ob"}
            onClick={onClick}
            onLoad={onLoad}
            doubleClickZoom={false}
            antialias={true}
        >
            {isMapLoaded && 
                <>
                    {!isInitialState && <Pin/>}
                </>
            }
        </Map>
    );
};

MapContainer.displayName = "MapContainer";