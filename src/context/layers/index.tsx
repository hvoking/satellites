import { SatellitesLayerProvider } from './satellites';
import { WrapperLayerProvider } from './wrapper';

export const LayersProvider = ({ children }: any) => {
	return (
		<SatellitesLayerProvider>
		<WrapperLayerProvider>
			{children}
		</WrapperLayerProvider>
		</SatellitesLayerProvider>
	)
}

LayersProvider.displayName="LayersProvider";