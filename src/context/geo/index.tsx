// React imports
import { useState, useEffect, useRef, useContext, createContext } from 'react';

// App imports
import * as Locations from './locations';

const GeoContext: React.Context<any> = createContext(null);

export const useGeo = () => useContext(GeoContext)

export const GeoProvider = ({children}: any) => {
	const mapRef = useRef<any>();
	const [ viewport, setViewport ] = useState(Locations.other);
	const [ mapStyle, setMapStyle ] = useState("mapbox://styles/hvoking/cmbzyje2c000f01s15h8fer9p");
	const { latitude, longitude } = viewport;

	const bounds = mapRef?.current?.getMap().getBounds();

	const bbox = [ 
		bounds?.getWest(), 
		bounds?.getSouth(), 
		bounds?.getEast(), 
		bounds?.getNorth() 
	];

	const mapCenter = { longitude, latitude };
	const metaData = { bbox, mapCenter };

	useEffect(() => {
		const viewportFlyTo = () => {
			mapRef.current?.flyTo({
				center: [ longitude, latitude ],
				duration: 3000, 
				essential: true,
			});	
		}
		viewport && viewportFlyTo();
	}, [ viewport ]);

	return (
		<GeoContext.Provider value={{
			mapRef, Locations, 
			viewport, setViewport, 
			mapStyle, metaData,
		}}>
			{children}
		</GeoContext.Provider>
	)
}

GeoContext.displayName = "GeoContext";