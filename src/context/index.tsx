import { GeoProvider } from './geo';
import { ApiProvider } from './api';
import { LayersProvider } from './layers';

export const MainProvider = ({children}: any) => {
  return (
    <GeoProvider>
    <ApiProvider>
    <LayersProvider>
      {children}
    </LayersProvider>
    </ApiProvider>
    </GeoProvider>
  )
}

MainProvider.displayName="MainProvider";