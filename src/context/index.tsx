import { ApiProvider } from './api';
import { LayersProvider } from './layers';

export const MainProvider = ({children}: any) => {
  return (
    <ApiProvider>
    <LayersProvider>
      {children}
    </LayersProvider>
    </ApiProvider>
  )
}

MainProvider.displayName="MainProvider";