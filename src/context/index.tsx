import { ApiProvider } from './api';
import { LayersProvider } from './layers';
import { GeoProvider } from './geo';

export const ContextProvider = ({children}: any) => {
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

ContextProvider.displayName="ContextProvider";