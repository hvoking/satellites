import { ApiProvider } from './api';
import { LayersProvider } from './layers';
import { GeoProvider } from './geo';

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