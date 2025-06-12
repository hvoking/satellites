// React imports
import { useState, useEffect, useRef, useContext, createContext } from 'react';

// App imports
import * as Locations from './locations';

const GeoContext: React.Context<any> = createContext(null);

export const useGeo = () => useContext(GeoContext)

export const GeoProvider = ({children}: any) => {
	const mapRef = useRef<any>();

	const [ viewport, setViewport ] = useState(Locations.sp);
	const [ mapStyle, setMapStyle ] = useState("mapbox://styles/hvoking/cm6k7wwbu00cw01ryeqdb9fik");
	
	const { latitude, longitude } = viewport;

	const [ isInitialState, setIsInitialState ] = useState(true);

	const bounds = mapRef?.current?.getMap().getBounds();
	const bbox = [ 
		bounds?.getWest(), 
		bounds?.getSouth(), 
		bounds?.getEast(), 
		bounds?.getNorth() 
	];

	const mapCenter = { longitude, latitude };

	const metaData = { bbox, mapCenter }

	useEffect(() => {
		const viewportFlyTo = () => {
			const center = [ longitude, latitude ];

			mapRef.current?.flyTo({
				center: center,
				duration: 3000, 
				essential: true,
			});	
		}
		viewport && viewportFlyTo();
	}, [ viewport ]);

	return (
		<GeoContext.Provider value={{
			mapRef, Locations, 
			mapStyle, setMapStyle, 
			viewport, setViewport, 
			isInitialState, setIsInitialState,
			metaData
		}}>
			{children}
		</GeoContext.Provider>
	)
}

GeoContext.displayName = "GeoContext";