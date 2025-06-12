// React imports
import { useCallback } from 'react';

// App imports
import { Path } from './path';

// Context imports
import { useGeo } from 'context/geo';

// Third-party imports
import { Marker } from 'react-map-gl';

export const Pin = () => {
	const { viewport, setViewport } = useGeo();
	const { longitude, latitude } = viewport;

	const onMarkerDragEnd = useCallback((event: any) => {
		const { lng, lat } = event.lngLat;
	    setViewport({...viewport, longitude: lng, latitude: lat });
	}, []);

	return (
			<Marker
				longitude={longitude}
				latitude={latitude}
				anchor="bottom"
				draggable
				onDragEnd={onMarkerDragEnd}
			>
		      <svg 
		      	viewBox="0 0 45.1 63.3"
		      	width="35px" 
		      	fill="rgba(233, 12, 131, 1)"
		      >
		        <Path/>
		      </svg>
		    </Marker>
	)
}

Pin.displayName="Pin";