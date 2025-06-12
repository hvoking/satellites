// App imports
import { Main } from 'components';
import { MainProvider } from 'context';
import './styles.scss';

export const App = () => {
  let vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);

  window.addEventListener('resize', () => {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  });
  
  return (
    <div className="App">
      <MainProvider>
        <Main/>
      </MainProvider>
    </div>
  );
}

App.displayName="App";