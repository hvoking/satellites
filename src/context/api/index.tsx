import { SatellitesApiProvider } from './satellites';

export const ApiProvider = ({ children }: any) => {
	return (
		<SatellitesApiProvider>
			{children}
		</SatellitesApiProvider>
	)
}

ApiProvider.displayName="ApiProvider";