// App imports
import { Maps } from './maps';
import { ContextProvider } from 'context';
import './styles.scss';

export const App = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  
  return (
    <ContextProvider>
      <div className="App">
        <Maps/>
      </div>
    </ContextProvider>
  );
}

App.displayName="App";