// React imports
import { useRef } from 'react';

// Context imports
import { useSatellitesLayer } from 'context/layers/satellites';
import { useWrapperLayer } from 'context/layers/wrapper';

// Third-party imports
import { Map } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Main = () => {
    const mapRef = useRef<any>();

    const { satellitesLayer } = useSatellitesLayer();
    const { wrapperLayer } = useWrapperLayer();

    const onLoad = () => {
        const map = mapRef.current.getMap();
        map.addLayer(satellitesLayer);
        map.addLayer(wrapperLayer);
    };

    const initialViewState = { latitude: 0, longitude: 0, zoom: 2 };

    return (
        <Map
            ref={mapRef}
            initialViewState={initialViewState}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={"mapbox://styles/hvoking/cm1h7n1kp01ed01pd24g689ob"}
            onLoad={onLoad}
            antialias={true}
        />
    );
};

Main.displayName = "Main";