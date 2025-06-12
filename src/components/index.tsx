// App imports
import { MapContainer } from './map';
import './styles.scss';

export const Main = () => {
  return (
    <div className="world-wrapper"> 
        <MapContainer/>
    </div>
  );
};

Main.displayName = "Main";