import { SatellitesLayerProvider } from './satellites';
import { WrapperLayerProvider } from './wrapper';
import { AntennaLayerProvider } from './antenna';
import { CubeLayerProvider } from './cube';

export const LayersProvider = ({ children }: any) => {
	return (
		<SatellitesLayerProvider>
		<WrapperLayerProvider>
		<AntennaLayerProvider>
		<CubeLayerProvider>
			{children}
		</CubeLayerProvider>
		</AntennaLayerProvider>
		</WrapperLayerProvider>
		</SatellitesLayerProvider>
	)
}

LayersProvider.displayName="LayersProvider";