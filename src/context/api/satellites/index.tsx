// React imports
import { useState, useEffect, useContext, createContext } from 'react';

// Third-party imports
import * as satellite from 'satellite.js';

const SatellitesApiContext: React.Context<any> = createContext(null)

export const useSatellitesApi = () => useContext(SatellitesApiContext);

export const SatellitesApiProvider = ({children}: any) => {
	const [ satellitesData, setSatellitesData ] = useState<any>(null);

	useEffect(() => {
		const fetchData = () => {
			fetch('space-track-leo.txt')
				.then((res: any) => res.text())
				.then((raw: any) => {
			    	const tleData = raw
						.replace(/\r/g, '')
						.split(/\n(?=[^12])/)
						.map((tle: any) => tle.split('\n'));

			    	const resp = tleData
						.map(([name, ...tle]: any) => {
							if (!tle[0] || !tle[1]) return null;
							return {
								satrec: satellite.twoline2satrec(tle[0], tle[1]),
								name: name.trim().replace(/^0 /, ''),
							}
						})
					.filter((d: any): d is { satrec: any; name: string } => !!d)
					.filter((d: any) => !!satellite.propagate(d.satrec, new Date())?.position)
					.slice(0, 10);
			    setSatellitesData(resp);
			});
		}
		fetchData();
	}, []);

	return (
		<SatellitesApiContext.Provider value={{ satellitesData }}>
			{children}
		</SatellitesApiContext.Provider>
	)
}

SatellitesApiContext.displayName = "SatellitesApiContext";