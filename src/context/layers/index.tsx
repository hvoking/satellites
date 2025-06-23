import { SatellitesLayerProvider } from './satellites';
import { WrapperLayerProvider } from './wrapper';
import { AntennaLayerProvider } from './antenna';

export const LayersProvider = ({ children }: any) => {
	return (
		<SatellitesLayerProvider>
		<WrapperLayerProvider>
		<AntennaLayerProvider>
			{children}
		</AntennaLayerProvider>
		</WrapperLayerProvider>
		</SatellitesLayerProvider>
	)
}

LayersProvider.displayName="LayersProvider";