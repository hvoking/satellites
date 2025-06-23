// Context imports
import { useGeo } from 'context/geo';
import { useSatellitesLayer } from 'context/layers/satellites';
import { useWrapperLayer } from 'context/layers/wrapper';
import { useAntennaLayer } from 'context/layers/antenna';
import { useCubeLayer } from 'context/layers/cube';

// Third-party imports
import { Map } from 'react-map-gl/mapbox';
import 'mapbox-gl/dist/mapbox-gl.css';

export const Main = () => {
    const { mapRef, viewport, videoStyle } = useGeo();

    const { satellitesLayer } = useSatellitesLayer();
    const { wrapperLayer } = useWrapperLayer();
    const { antennaLayer } = useAntennaLayer();
    const { cubeLayer } = useCubeLayer();

    const onLoad = () => {
        const map = mapRef.current.getMap();
        map.addLayer(cubeLayer);
        map.addLayer(satellitesLayer);
        map.addLayer(wrapperLayer);
        map.addLayer(antennaLayer);
    };

    return (
        <Map
            ref={mapRef}
            initialViewState={viewport}
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            mapStyle={videoStyle}
            onLoad={onLoad}
            antialias={true}
            projection="globe"
        />
    );
};

Main.displayName = "Main";